import { ObjectSchema } from "joi";
import { SignUpInput, SignInInput, ForgotPasswordInput, ResetPasswordInput, RefreshTokenInput } from "../interfaces";
export type { SignUpInput, SignInInput, ForgotPasswordInput, ResetPasswordInput, RefreshTokenInput, };
export declare const signUpSchema: ObjectSchema<SignUpInput>;
export declare const signInSchema: ObjectSchema<SignInInput>;
export declare const forgotPasswordSchema: ObjectSchema<ForgotPasswordInput>;
export declare const resetPasswordSchema: ObjectSchema<ResetPasswordInput>;
export declare const refreshTokenSchema: ObjectSchema<RefreshTokenInput>;
//# sourceMappingURL=authValidation.d.ts.map