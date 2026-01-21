import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import type { User } from '../users/user.entity';
import type { Post } from '../posts/post.entity';
import { BaseEntity } from '../common/entities/BaseEntity';

@Entity('Comments')
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // Explicit type 'text' needed: TEXT vs VARCHAR (unlimited length)
  // TypeORM would default to VARCHAR(255) without explicit type
  @Column({ type: 'text' })
  body: string;

  // Explicit type needed: TypeORM can't infer integer from number
  @Column({ type: 'integer' })
  postId: number;

  @Column({ type: 'integer' })
  userId: number;

  // nullable: true = database constraint
  // number | null = TypeScript type safety
  @Column({ type: 'integer', nullable: true })
  parentId: number | null;

  @ManyToOne('Post', (post: Post) => post.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: Post;

  @ManyToOne('User', (user: User) => user.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  author: User;

  @ManyToOne('Comment', (comment: Comment) => comment.replies, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parentId' })
  parent: Comment | null;

  @OneToMany('Comment', (comment: Comment) => comment.parent, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  replies: Comment[];
}
