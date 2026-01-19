# 🚀 Express + TypeORM → NestJS Migration Plan

## 📋 Table of Contents
1. [Pre-Migration Analysis](#pre-migration-analysis)
2. [Migration Strategy](#migration-strategy)
3. [Phase-by-Phase Plan](#phase-by-phase-plan)
4. [Code Mapping Guide](#code-mapping-guide)
5. [Module Structure](#module-structure)
6. [Migration Checklist](#migration-checklist)

---

## 📊 Pre-Migration Analysis

### Current Architecture
```
Express Backend:
├── Routes (manual registration)
├── Controllers (request/response handling)
├── Services (business logic)
├── Repositories (data access)
├── Middleware (auth, upload)
├── Validations (Joi schemas)
├── Utils (helpers, constants)
└── Entities (TypeORM)
```

### Target NestJS Architecture
```
NestJS Backend:
├── Modules (feature-based)
├── Controllers (decorator-based routes)
├── Services (business logic with DI)
├── Repositories (Direct TypeORM repositories - Approach 1)
├── Guards (auth, roles)
├── Pipes (validation)
├── Interceptors (logging, transformation)
├── Filters (error handling)
└── Entities (TypeORM)
```

---

## 🎯 Migration Strategy

### Approach: Incremental Migration
- **Phase 1**: Setup NestJS project alongside Express
- **Phase 2**: Migrate shared utilities and configs
- **Phase 3**: Migrate one feature at a time (Auth → Users → Posts → Comments)
- **Phase 4**: Implement security features
- **Phase 5**: Testing and validation
- **Phase 6**: Deploy and deprecate Express

### Benefits
- ✅ Can test each module independently
- ✅ Rollback capability if issues arise
- ✅ Gradual team learning curve
- ✅ Maintain Express API during migration

---

## 📅 Phase-by-Phase Plan

### **PHASE 1: Project Setup & Configuration** (Day 1-2)

#### 1.1 Initialize NestJS Project
```bash
# Create new NestJS project
nest new blog-backend-nestjs --strict

# Install required packages
cd blog-backend-nestjs
npm install @nestjs/typeorm typeorm pg
npm install @nestjs/jwt @nestjs/passport passport passport-jwt
npm install @nestjs/throttler
npm install class-validator class-transformer
npm install helmet cookie-parser
npm install csrf-csrf
npm install bcrypt
npm install cloudinary
npm install nodemailer
npm install reflect-metadata
```

#### 1.2 Project Structure Setup
```
backend-nestjs/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── config/
│   │   ├── database.config.ts
│   │   └── app.config.ts
│   ├── common/
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── pipes/
│   │   └── exceptions/
│   ├── shared/
│   │   ├── repositories/
│   │   ├── utils/
│   │   └── constants/
│   ├── auth/
│   ├── users/
│   ├── posts/
│   └── comments/
```

#### 1.3 Configuration Files
- ✅ `tsconfig.json` (already configured)
- ✅ Environment variables setup
- ✅ Database configuration
- ✅ JWT configuration

---

### **PHASE 2: Shared Modules & Utilities** (Day 3-4)

#### 2.1 Create Common Module
**File: `src/common/common.module.ts`**
```typescript
@Global()
@Module({
  providers: [
    // Common utilities
  ],
  exports: [
    // Export common utilities
  ],
})
export class CommonModule {}
```

#### 2.2 Migrate Constants
**File: `src/shared/constants/constants.ts`**
- Keep existing `HTTP_STATUS`, `SUCCESS_MESSAGES`, `ERROR_MESSAGES`
- Add NestJS-specific constants

#### 2.3 Create Custom Exceptions
**File: `src/common/exceptions/app.exception.ts`**
```typescript
export class AppException extends HttpException {
  constructor(
    public readonly code: string,
    statusCode: number,
    message?: string
  ) {
    super(message || code, statusCode);
    this.code = code;
  }
}
```

#### 2.4 Create Exception Filter
**File: `src/common/filters/http-exception.filter.ts`**
```typescript
@Catch(AppException)
export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: AppException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response.status(status).json({
      data: {
        message: ERROR_MESSAGES[exception.code] || exception.message,
      },
    });
  }
}
```

#### 2.5 Migrate Utilities
- `utils/bcrypt.ts` → Keep as-is (pure functions)
- `utils/jwt.ts` → Replace with `@nestjs/jwt`
- `utils/pagination.ts` → Keep as-is
- `utils/mappers.ts` → Keep as-is
- `utils/validations.ts` → Replace with `ValidationPipe`

---

### **PHASE 3: Database & TypeORM Setup** (Day 5)

> **📌 Repository Approach:** We're using **Approach 1 (Direct TypeORM Repositories)** - services will inject TypeORM repositories directly using `@InjectRepository(Entity)`. No custom repository classes needed!

#### 3.1 Create Database Module
**File: `src/config/database.module.ts`**
```typescript
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432'),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [User, Post, Comment],
        synchronize: process.env.NODE_ENV === 'development',
        logging: process.env.NODE_ENV === 'development',
        extra: {
          max: 10,
          min: 2,
        },
      }),
    }),
  ],
})
export class DatabaseModule {}
```

#### 3.2 Migrate Entities
- ✅ `entities/BaseEntity.ts` → Keep as-is
- ✅ `entities/User.ts` → Keep as-is
- ✅ `entities/Post.ts` → Keep as-is
- ✅ `entities/Comment.ts` → Keep as-is

#### 3.3 Use Direct TypeORM Repositories (Approach 1)
> **Note:** We'll use **Direct TypeORM Repositories** (Approach 1) - simpler and standard NestJS pattern. Services will inject TypeORM repositories directly using `@InjectRepository()`.

**No separate repositories folder needed!** TypeORM provides repositories automatically.

#### 3.4 Migration Strategy
- **Remove custom repository classes** - Use TypeORM repositories directly
- **Inject repositories** in services using `@InjectRepository(Entity)`
- **Move custom query methods** to services or create helper methods
- **Register entities** in feature modules with `TypeOrmModule.forFeature([Entity])`

**Example Migration:**
```typescript
// Before (Express) - Custom Repository
export class UserRepository extends BaseRepository<User> {
  constructor(dataSource: DataSource) {
    super(dataSource, User);
  }
  
  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }
}

// After (NestJS) - Direct TypeORM Repository
// No UserRepository class needed!
// Inject directly in service:

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>  // Direct TypeORM repository
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }
  
  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }
  
  async create(data: Partial<User>): Promise<User> {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }
}
```

**Module Setup:**
```typescript
@Module({
  imports: [TypeOrmModule.forFeature([User])],  // Register entity
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
```

---

### **PHASE 4: Authentication Module** (Day 6-7)

#### 4.1 Create Auth Module Structure
```
src/auth/
├── auth.module.ts
├── auth.controller.ts
├── auth.service.ts
├── dto/
│   ├── sign-in.dto.ts
│   ├── sign-up.dto.ts
│   ├── forgot-password.dto.ts
│   └── reset-password.dto.ts
├── guards/
│   ├── auth.guard.ts
│   └── rate-limit.guard.ts
└── decorators/
    └── public.decorator.ts
```

#### 4.2 Migrate Auth Service
**File: `src/auth/auth.service.ts`**
```typescript
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private emailService: EmailService
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<void> {
    // Migrate from authService.registerUser()
  }

  async signIn(signInDto: SignInDto): Promise<AuthenticationResult> {
    // Migrate from authService.authenticateUser()
  }

  async logout(userId: number): Promise<void> {
    // Migrate from authService.logoutUser()
  }

  async refreshToken(refreshToken: string): Promise<TokenRefreshResult> {
    // Migrate from authService.verifyAndRefreshToken()
  }

  async forgotPassword(email: string): Promise<void> {
    // Migrate from authService.createPasswordResetToken()
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    // Migrate from authService.resetUserPassword()
  }
}
```

#### 4.3 Create Auth Controller
**File: `src/auth/auth.controller.ts`**
```typescript
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  async signUp(@Body() signUpDto: SignUpDto) {
    await this.authService.signUp(signUpDto);
    return { data: { message: SUCCESS_MESSAGES.ACCOUNT_CREATED } };
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('login')
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('logout')
  async signOut(@User('id') userId: number) {
    await this.authService.logout(userId);
    return { data: { message: SUCCESS_MESSAGES.LOGGED_OUT } };
  }

  @Public()
  @Post('refreshToken')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @Public()
  @Post('forgotPassword')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.authService.forgotPassword(forgotPasswordDto.email);
    return { data: { message: SUCCESS_MESSAGES.RESET_TOKEN_SENT } };
  }

  @Public()
  @Post('resetPassword')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword
    );
    return { data: { message: SUCCESS_MESSAGES.PASSWORD_RESET } };
  }
}
```

#### 4.4 Create Auth Guard
**File: `src/auth/guards/auth.guard.ts`**
```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException(ERROR_MESSAGES.ACCESS_TOKEN_REQUIRED);
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      if (payload.type !== 'access') {
        throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
      }

      request.user = { id: payload.userId };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException(ERROR_MESSAGES.ACCESS_TOKEN_EXPIRED);
      }
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
```

#### 4.5 Create @Public() Decorator
**File: `src/auth/decorators/public.decorator.ts`**
```typescript
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

#### 4.6 Create @User() Decorator
**File: `src/common/decorators/user.decorator.ts`**
```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return data ? request.user?.[data] : request.user;
  },
);
```

#### 4.7 Create DTOs
**File: `src/auth/dto/sign-in.dto.ts`**
```typescript
import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';

export class SignInDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @MinLength(8)
  password: string;
}
```

#### 4.8 Configure Auth Module
**File: `src/auth/auth.module.ts`**
```typescript
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),  // Register User entity for repository injection
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '15m',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, EmailService, CloudinaryService],
  exports: [AuthService],
})
export class AuthModule {}
```

---

### **PHASE 5: Users Module** (Day 8-9)

#### 5.1 Create Users Module Structure
```
src/users/
├── users.module.ts
├── users.controller.ts
├── users.service.ts
├── dto/
│   ├── update-user.dto.ts
│   └── list-users-query.dto.ts
└── decorators/
```

#### 5.2 Migrate User Service
**File: `src/users/users.service.ts`**
```typescript
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private cloudinaryService: CloudinaryService
  ) {}

  async listUsers(query: ListUsersQueryDto) {
    // Migrate from userService.listUsers()
  }

  async findUserById(id: number) {
    // Migrate from userService.findUserById()
  }

  async getUserPostsWithComments(params: GetUserPostsDto) {
    // Migrate from userService.getUserPostsWithComments()
  }

  async updateUser(params: UpdateUserDto, userId: number, file?: Express.Multer.File) {
    // Migrate from userService.updateUserForSelf()
  }

  async deleteUser(userId: number) {
    // Migrate from userService.deleteUserForSelf()
  }
}
```

#### 5.3 Migrate User Controller
**File: `src/users/users.controller.ts`**
```typescript
@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async list(@Query() query: ListUsersQueryDto) {
    return this.usersService.listUsers(query);
  }

  @Get('me')
  async getCurrentUser(@User('id') userId: number) {
    return this.usersService.findUserById(userId);
  }

  @Get(':id/posts')
  async getUserPosts(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: GetUserPostsDto
  ) {
    return this.usersService.getUserPostsWithComments({ userId: id, ...query });
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @User('id') userId: number,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.usersService.updateUser(updateUserDto, userId, file);
  }

  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @User('id') userId: number
  ) {
    await this.usersService.deleteUser(userId);
    return { data: { message: SUCCESS_MESSAGES.USER_DELETED } };
  }
}
```

#### 5.4 Create Users Module
**File: `src/users/users.module.ts`**
```typescript
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Post]),  // Register entities for repository injection
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

> **Note:** Each feature module registers its own entities with `TypeOrmModule.forFeature([Entity])`. This allows services in that module to inject repositories using `@InjectRepository(Entity)`.

---

### **PHASE 6: Posts Module** (Day 10-11)

#### 6.1 Create Posts Module Structure
```
src/posts/
├── posts.module.ts
├── posts.controller.ts
├── posts.service.ts
└── dto/
    ├── create-post.dto.ts
    ├── update-post.dto.ts
    └── list-posts-query.dto.ts
```

#### 6.2 Migrate Post Service
- Keep all business logic
- Convert to `@Injectable()` service
- Inject repositories using `@InjectRepository(Post)` and `@InjectRepository(User)`
- Use dependency injection

**Example:**
```typescript
@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}
}
```

#### 6.3 Migrate Post Controller
**File: `src/posts/posts.controller.ts`**
```typescript
@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createPostDto: CreatePostDto,
    @User('id') userId: number,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.postsService.createPost(createPostDto, userId, file);
  }

  @Get()
  async list(@Query() query: ListPostsQueryDto) {
    return this.postsService.listPosts(query);
  }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findPostWithAuthor(id);
  }

  @Get(':postId/comments')
  async getPostComments(
    @Param('postId', ParseIntPipe) postId: number,
    @Query() query: PaginationQueryDto
  ) {
    return this.postsService.getPostWithComments(postId, query);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
    @User('id') userId: number,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.postsService.updatePost(id, updatePostDto, userId, file);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @User('id') userId: number
  ) {
    await this.postsService.deletePost(id, userId);
    return { data: { message: SUCCESS_MESSAGES.POST_DELETED } };
  }
}
```

#### 6.4 Create Posts Module
**File: `src/posts/posts.module.ts`**
```typescript
@Module({
  imports: [
    TypeOrmModule.forFeature([Post, User, Comment]),  // Register entities
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
```

---

### **PHASE 7: Comments Module** (Day 12)

#### 7.1 Create Comments Module
- Similar structure to Posts module
- Migrate comment service and controller
- Handle nested comments (replies)

#### 7.2 Create Comments Module
**File: `src/comments/comments.module.ts`**
```typescript
@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, Post, User]),  // Register entities
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
```

---

### **PHASE 8: Security Features** (Day 13)

#### 8.1 Setup main.ts with Security
**File: `src/main.ts`**
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AppExceptionFilter } from './common/filters/http-exception.filter';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security middleware (ORDER MATTERS!)
  app.use(helmet());
  app.use(cookieParser());
  
  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      validateCustomDecorators: true,
    })
  );

  // Global exception filter
  app.useGlobalFilters(new AppExceptionFilter());

  // Trust proxy (if behind load balancer)
  app.set('trust proxy', true);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`App is now running at port ${port}`);
}
bootstrap();
```

#### 8.2 Configure Rate Limiting
**File: `src/app.module.ts`**
```typescript
@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        { name: 'short', ttl: 1000, limit: 3 },
        { name: 'default', ttl: 60000, limit: 100 },
        { name: 'login', ttl: 60000, limit: 5 },
      ],
    }),
    // ... other modules
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
```

---

### **PHASE 9: Testing & Validation** (Day 14-15)

#### 9.1 API Testing
- Test all endpoints with Postman/curl
- Verify authentication flow
- Test authorization (owner checks)
- Validate error handling

#### 9.2 Integration Testing
- Test database operations
- Test file uploads
- Test email sending
- Test Cloudinary integration

---

## 🔄 Code Mapping Guide

### Express → NestJS Mapping

| Express Pattern | NestJS Equivalent |
|----------------|-------------------|
| `router.get('/path', handler)` | `@Get('path') handler()` |
| `router.post('/path', middleware, handler)` | `@Post('path') @UseGuards(Guard) handler()` |
| `req.params.id` | `@Param('id') id: number` |
| `req.body` | `@Body() dto: Dto` |
| `req.query` | `@Query() query: QueryDto` |
| `req.user` | `@User() user` or `@User('id') userId` |
| `res.status(200).send()` | `return { data: {...} }` |
| `middleware(req, res, next)` | `@Injectable() Guard implements CanActivate` |
| `validateRequest(schema, body)` | `@Body() dto: Dto` + `ValidationPipe` |
| `handleAppError(err, res)` | `ExceptionFilter` |
| `export const service = new Service()` | `@Injectable() export class Service` |
| Manual DI: `constructor(repo?: Repo)` | Auto DI: `constructor(private repo: Repo)` |

---

## 📁 Final Module Structure

```
src/
├── main.ts
├── app.module.ts
├── config/
│   ├── database.config.ts
│   └── app.config.ts
├── common/
│   ├── decorators/
│   │   └── user.decorator.ts
│   ├── filters/
│   │   └── http-exception.filter.ts
│   ├── guards/
│   ├── interceptors/
│   │   ├── logging.interceptor.ts
│   │   └── transform.interceptor.ts
│   └── exceptions/
│       └── app.exception.ts
├── shared/
│   ├── utils/
│   │   ├── bcrypt.ts
│   │   ├── pagination.ts
│   │   └── mappers.ts
│   └── constants/
│       └── constants.ts
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── dto/
│   ├── guards/
│   │   └── auth.guard.ts
│   └── decorators/
│       └── public.decorator.ts
├── users/
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── dto/
├── posts/
│   ├── posts.module.ts
│   ├── posts.controller.ts
│   ├── posts.service.ts
│   └── dto/
├── comments/
│   ├── comments.module.ts
│   ├── comments.controller.ts
│   ├── comments.service.ts
│   └── dto/
└── entities/
    ├── base.entity.ts
    ├── user.entity.ts
    ├── post.entity.ts
    └── comment.entity.ts
```

---

## ✅ Migration Checklist

### Phase 1: Setup
- [ ] Initialize NestJS project
- [ ] Install all dependencies
- [ ] Setup project structure
- [ ] Configure TypeScript
- [ ] Setup environment variables

### Phase 2: Shared
- [ ] Migrate constants
- [ ] Create custom exceptions
- [ ] Create exception filter
- [ ] Migrate utilities
- [ ] Create common module

### Phase 3: Database
- [ ] Setup TypeORM module
- [ ] Migrate entities
- [ ] Register entities in feature modules (TypeOrmModule.forFeature)
- [ ] Update services to use @InjectRepository() for direct repository injection

### Phase 4: Auth
- [ ] Create auth module
- [ ] Migrate auth service
- [ ] Create auth controller
- [ ] Create auth guard
- [ ] Create @Public() decorator
- [ ] Create @User() decorator
- [ ] Create auth DTOs
- [ ] Setup JWT module

### Phase 5: Users
- [ ] Create users module
- [ ] Migrate user service
- [ ] Create user controller
- [ ] Create user DTOs
- [ ] Test user endpoints

### Phase 6: Posts
- [ ] Create posts module
- [ ] Migrate post service
- [ ] Create post controller
- [ ] Create post DTOs
- [ ] Test post endpoints

### Phase 7: Comments
- [ ] Create comments module
- [ ] Migrate comment service
- [ ] Create comment controller
- [ ] Create comment DTOs
- [ ] Test comment endpoints

### Phase 8: Security
- [ ] Setup Helmet
- [ ] Configure CORS
- [ ] Setup rate limiting
- [ ] Configure CSRF (if needed)
- [ ] Setup global guards
- [ ] Setup global pipes
- [ ] Setup global filters

### Phase 9: Testing
- [ ] Test all endpoints
- [ ] Test authentication
- [ ] Test authorization
- [ ] Test file uploads
- [ ] Test error handling
- [ ] Performance testing

### Phase 10: Deployment
- [ ] Update environment variables
- [ ] Update deployment scripts
- [ ] Update documentation
- [ ] Deploy to staging
- [ ] Deploy to production
- [ ] Deprecate Express backend

---

## 🎯 Key Migration Patterns

### Pattern 1: Route → Controller Method
```typescript
// Express
router.post('/login', loginRateLimiter, signIn);

// NestJS
@Post('login')
@Public()
@Throttle({ login: { limit: 5, ttl: 60000 } })
async signIn(@Body() signInDto: SignInDto) {}
```

### Pattern 2: Middleware → Guard
```typescript
// Express
router.post('/logout', authenticateToken, signOut);

// NestJS
@Post('logout')
@UseGuards(AuthGuard)
async signOut(@User('id') userId: number) {}
```

### Pattern 3: Validation → DTO + ValidationPipe
```typescript
// Express
const validatedBody = validateRequest(signInSchema, req.body, res);

// NestJS
@Post('login')
async signIn(@Body() signInDto: SignInDto) {
  // Already validated by ValidationPipe
}
```

### Pattern 4: Error Handling → Exception Filter
```typescript
// Express
catch (err) {
  if (handleAppError(err, res, ERROR_MESSAGES)) return;
  res.status(500).send({ message: 'Error' });
}

// NestJS
// Just throw - filter handles it
throw new AppException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
```

### Pattern 5: Service → Injectable Service
```typescript
// Express
export class AuthService {
  constructor(userRepo?: UserRepository) {
    this.userRepo = userRepo || new UserRepository(AppDataSource);
  }
}
export const authService = new AuthService();

// NestJS - Direct TypeORM Repository Injection
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>  // Direct TypeORM repository
  ) {}
  // Auto-injected! No custom repository class needed
}
```

---

## 📝 Next Steps

1. **Review this plan** with your team
2. **Set up development environment** for NestJS
3. **Start with Phase 1** (Project Setup)
4. **Migrate incrementally** (one module at a time)
5. **Test thoroughly** after each phase
6. **Deploy gradually** (staging → production)

---

## 🆘 Common Issues & Solutions

### Issue 1: Circular Dependencies
**Solution:** Use `forwardRef()` or `ModuleRef`

### Issue 2: Validation Not Working
**Solution:** Ensure `ValidationPipe` is global and DTOs have decorators

### Issue 3: Auth Guard Not Working
**Solution:** Ensure `@Public()` decorator on public routes, guard is global

### Issue 4: File Upload Issues
**Solution:** Use `@UseInterceptors(FileInterceptor('image'))` and `@UploadedFile()`

### Issue 5: TypeORM Repository Injection
**Solution:** Use `@InjectRepository(Entity)` directly in services. Register entities in module with `TypeOrmModule.forFeature([Entity])`

---

**Ready to start migration? Let's begin with Phase 1!** 🚀

