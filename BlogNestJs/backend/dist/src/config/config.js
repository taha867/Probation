"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => {
    return {
        // Application Configuration
        port: parseInt(process.env.PORT || '3000', 10),
        nodeEnv: process.env.NODE_ENV || 'development',
        frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
        // Database Configuration
        database: {
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432', 10),
            username: process.env.DB_USERNAME || '',
            password: process.env.DB_PASSWORD || '',
            name: process.env.DB_NAME || '',
        },
        // JWT Configuration
        jwt: {
            secret: process.env.JWT_SECRET || '',
            accessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '15m',
            refreshTokenExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || '7d',
            resetTokenExpiresIn: process.env.JWT_RESET_TOKEN_EXPIRES_IN || '1h',
        },
        // Cloudinary Configuration
        cloudinary: {
            cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
            apiKey: process.env.CLOUDINARY_API_KEY || '',
            apiSecret: process.env.CLOUDINARY_API_SECRET || '',
        },
        // Email Configuration
        email: {
            host: process.env.EMAIL_HOST || '',
            port: parseInt(process.env.EMAIL_PORT || '587', 10),
            secure: process.env.EMAIL_SECURE === 'true',
            user: process.env.EMAIL_USER || '',
            pass: process.env.EMAIL_PASS || '',
            from: process.env.EMAIL_FROM || '',
        },
    };
};
//# sourceMappingURL=config.js.map