import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user.entity';
import { EmailService } from '../../email/email.service';
import { comparePassword } from '../../lib/utils/bcrypt';
import {
  USER_STATUS,
  SUCCESS_MESSAGES,
  DEFAULTS,
  ERROR_MESSAGES,
} from '../../lib/constants';
import { AppException } from '../../common/exceptions/app.exception';
import { SignUpDto } from './dto/signUp-input.dto';
import { SignInDto } from './dto/signIn-input.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<void> {
    const { name, email, phone, password, image } = signUpDto;

    const exists = await this.userRepository.exists({
      where: [{ email }, { phone }],
    });

    if (exists) {
      throw new AppException(
        'USER_ALREADY_EXISTS',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    // Password will be automatically hashed by UserSubscriber before insert
    await this.userRepository.save({
      name,
      email,
      password, 
      phone: phone || null,
      image: image || null,
      status: USER_STATUS.LOGGED_OUT,
    });
  }

  async signIn(signInDto: SignInDto) {
    const { email, phone, password } = signInDto;

    const user = await this.userRepository.findOne({
      where: email ? { email } : { phone },
      select: [
        'id',
        'name',
        'email',
        'phone',
        'password',
        'status',
        'image',
        'tokenVersion',
      ],
    });

    if (!user || !user.password) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    await this.userRepository.update(user.id, {
      status: USER_STATUS.LOGGED_IN,
      lastLoginAt: new Date(),
    });

    const {
      id,
      name,
      email: userEmail,
      phone: userPhone,
      status: userStatus,
      image,
      tokenVersion = 0,
    } = user;

    const accessToken = await this.jwtService.signAsync(
      {
        userId: id,
        email: userEmail,
        tokenVersion,
        type: 'access',
      },
      { expiresIn: '15m' },
    );

    const refreshToken = await this.jwtService.signAsync(
      { userId: id, tokenVersion, type: 'refresh' },
      { expiresIn: '7d' },
    );

    return {
      data: {
        message: SUCCESS_MESSAGES.SIGNED_IN,
        accessToken,
        refreshToken,
        user: {
          id,
          name,
          email: userEmail,
          phone: userPhone,
          image: image ?? null,
          status: userStatus,
        },
      },
    };
  }

  async logout(userId: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const { tokenVersion = 0 } = user;

    await this.userRepository.save({
      ...user,
      status: USER_STATUS.LOGGED_OUT,
      tokenVersion: tokenVersion + 1,
    });
  }

  async refreshToken(refreshToken: string) {
    let decoded;
    try {
      decoded = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_SECRET,
      });
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'TokenExpiredError') {
        throw new UnauthorizedException(ERROR_MESSAGES.REFRESH_TOKEN_EXPIRED);
      }
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_REFRESH_TOKEN);
    }

    if (decoded.type !== 'refresh') {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_REFRESH_TOKEN);
    }

    const user = await this.userRepository.findOne({
      where: { id: decoded.userId },
    });

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const { id, email, tokenVersion = 0 } = user;

    if (tokenVersion !== decoded.tokenVersion) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_REFRESH_TOKEN);
    }

    const accessToken = await this.jwtService.signAsync(
      {
        userId: id,
        email,
        tokenVersion,
        type: 'access',
      },
      { expiresIn: '15m' },
    );

    return {
      data: {
        message: SUCCESS_MESSAGES.TOKEN_REFRESHED,
        accessToken,
      },
    };
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      // Security best practice: don't reveal if email exists
      return;
    }

    const resetToken = await this.jwtService.signAsync(
      { userId: user.id, type: 'password_reset' },
      { expiresIn: '1h' },
    );

    await this.emailService.sendPasswordResetEmail(
      email,
      resetToken,
      user.name || DEFAULTS.USER_NAME,
    );
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    let decoded;
    try {
      decoded = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'TokenExpiredError') {
        throw new UnauthorizedException(ERROR_MESSAGES.RESET_TOKEN_EXPIRED);
      }
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_RESET_TOKEN);
    }

    if (decoded.type !== 'password_reset') {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_RESET_TOKEN);
    }

    const user = await this.userRepository.findOne({
      where: { id: decoded.userId },
      select: ['id', 'password'],
    });

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const oldPasswordHash = user.password;
    // Password will be automatically hashed by UserSubscriber before update
    user.password = newPassword;

    await this.userRepository.save(user);

    // Verify password was hashed correctly by subscriber
    const updatedUser = await this.userRepository.findOne({
      where: { id: user.id },
      select: ['id', 'password'],
    });

    if (!updatedUser || updatedUser.password === oldPasswordHash) {
      throw new AppException(
        'PASSWORD_RESET_FAILED',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!updatedUser.password?.startsWith('$2b$')) {
      throw new AppException(
        'PASSWORD_RESET_FAILED',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
