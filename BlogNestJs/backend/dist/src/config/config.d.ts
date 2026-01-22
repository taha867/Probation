declare const _default: () => {
    port: number;
    nodeEnv: string;
    frontendUrl: string;
    database: {
        host: string;
        port: number;
        username: string;
        password: string;
        name: string;
    };
    jwt: {
        secret: string;
        accessTokenExpiresIn: string;
        refreshTokenExpiresIn: string;
        resetTokenExpiresIn: string;
    };
    cloudinary: {
        cloudName: string;
        apiKey: string;
        apiSecret: string;
    };
    email: {
        host: string;
        port: number;
        secure: boolean;
        user: string;
        pass: string;
        from: string;
    };
};
export default _default;
//# sourceMappingURL=config.d.ts.map