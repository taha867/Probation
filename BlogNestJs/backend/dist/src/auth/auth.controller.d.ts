import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import { SignUpDto } from './dto/signUp.dto';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signUp(signUpDto: SignUpDto): Promise<{
        data: {
            message: "Account created successfully";
        };
    }>;
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
    signOut(userId: number): Promise<{
        data: {
            message: "Logged out successfully";
        };
    }>;
    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{
        data: {
            message: string;
            accessToken: string;
        };
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        data: {
            message: "Password reset token has been sent to your email";
        };
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        data: {
            message: "Password has been reset successfully";
        };
    }>;
}
//# sourceMappingURL=auth.controller.d.ts.map