import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import type { Post } from '../posts/post.entity';
import type { Comment } from '../comments/comment.entity';
import { BaseEntity } from '../common/entities/BaseEntity';

@Entity('Users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn() //Auto increment
  id: number;

 
  @Column()
  name: string;

  // Prevents duplicates at DB level, Protects against race condition
  @Column({ unique: true })
  email: string;

  // nullable: true = database constraint (allows NULL in DB)
  // string | null = TypeScript type safety (forces null checks in code)
  // Explicit type needed: TypeORM can't infer varchar from string | null
  @Column({ type: 'varchar', unique: true, nullable: true })
  phone: string | null = null;

  // select: false prevents password from being returned in queries
  @Column({ select: false })
  password: string;

 
  @Column({ type: 'varchar', nullable: true })
  status: string | null;


  @Column({ type: 'varchar', nullable: true })
  image: string | null;

    @Column({ type: 'varchar', nullable: true })
  imagePublicId: string | null;

  // Explicit type needed: TypeORM can't infer timestamp from Date
  // name: 'last_login_at' maps to snake_case DB column
  @Column({ type: 'timestamp', name: 'last_login_at', nullable: true })
  lastLoginAt: Date | null;

  // Explicit type needed: TypeORM can't infer integer from number
  // default: 0 sets database default value
  @Column({ type: 'integer', default: 0 })
  tokenVersion: number;


  @OneToMany('Post', (post: Post) => post.author, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  posts: Post[];

  @OneToMany('Comment', (comment: Comment) => comment.author, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  comments: Comment[];


  // Custom method to exclude password from JSON, it never fails
  toJSON(): Omit<User, 'password' | 'toJSON'> {
    const { password, toJSON, ...rest } = this;
    return rest as Omit<User, 'password' | 'toJSON'>;
  }
}
