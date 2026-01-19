"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const core_1 = require("@nestjs/core"); // A factory class that creates a NestJS application instance
const app_module_1 = require("./app.module"); // The root module of the application
const common_1 = require("@nestjs/common"); // A global validation pipe that validates all DTOs automatically
const http_exception_filter_1 = require("./common/filters/http-exception.filter"); // A global exception filter that catches all errors
const helmet_1 = __importDefault(require("helmet")); // A middleware that sets various HTTP headers for security
const cookie_parser_1 = __importDefault(require("cookie-parser")); // A middleware that parses cookies from the request
async function bootstrap() {
    // Environment variables are already loaded above
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    // Security middleware (ORDER MATTERS!)
    app.use((0, helmet_1.default)()); //Protects against: XSS, Clickjacking, MIME sniffing
    app.use((0, cookie_parser_1.default)());
    // CORS configuration
    app.enableCors({
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    // Global validation pipe
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true, // Strip away properties that do not have any decorators
        forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
        transform: true, // Automatically transform payloads to DTO instances
        validateCustomDecorators: true,
        transformOptions: {
            enableImplicitConversion: true, // Automatically transform primitive types
        },
    }));
    // Global exception filter(Error handling Layer)
    app.useGlobalFilters(new http_exception_filter_1.AppExceptionFilter());
    // Trust proxy (if behind load balancer/reverse proxy)
    app.set('trust proxy', true);
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
//# sourceMappingURL=main.js.map