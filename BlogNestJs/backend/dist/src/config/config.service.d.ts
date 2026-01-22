import { ConfigService as NestConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './config.schema';
/**
 * Centralized configuration service
 * Single source of truth for all environment variables
 */
export declare class AppConfigService {
    private configService;
    constructor(configService: NestConfigService<EnvironmentVariables>);
    get nodeEnv(): EnvironmentVariables['NODE_ENV'];
    get port(): number;
    get frontendUrl(): string;
    get database(): {
        host: any;
        port: any;
        username: any;
        password: any;
        name: any;
    };
    get jwt(): {
        secret: any;
        accessTokenExpiresIn: string;
        refreshTokenExpiresIn: string;
        resetTokenExpiresIn: string;
    };
    get cloudinary(): {
        cloudName: any;
        apiKey: any;
        apiSecret: any;
    };
    get email(): {
        host: any;
        port: any;
        secure: any;
        user: any;
        pass: any;
        from: any;
    };
    get<T extends keyof EnvironmentVariables>(key: T): EnvironmentVariables[T];
}
//# sourceMappingURL=config.service.d.ts.map