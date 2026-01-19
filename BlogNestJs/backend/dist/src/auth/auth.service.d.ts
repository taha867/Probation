import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/User';
import { EmailService } from '../shared/services/email.service';
import { SignUpDto } from './dto/signUp.dto';
import { SignInDto } from './dto/signIn.dto';
export declare class AuthService {
    private userRepository;
    private jwtService;
    private emailService;
    constructor(userRepository: Repository<User>, jwtService: JwtService, emailService: EmailService);
    signUp(signUpDto: SignUpDto): Promise<void>;
    signIn(signInDto: SignInDto): Promise<{
        data: {
            message: string;
            accessToken: string;
            refreshToken: string;
            user: {
                id: number;
                name: string;
                email: string;
                phone: string | null;
                image: string | null;
                status: string | null;
            };
        };
    }>;
    logout(userId: number): Promise<void>;
    refreshToken(refreshToken: string): Promise<{
        data: {
            message: string;
            accessToken: string;
        };
    }>;
    forgotPassword(email: string): Promise<void>;
    resetPassword(token: string, newPassword: string): Promise<void>;
}
//# sourceMappingURL=auth.service.d.ts.map