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

/**
 * Comment entity
 * Represents a comment on a post, with support for nested replies
 * Extends BaseEntity for automatic timestamp management
 */
@Entity('Comments')
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn() //Auto increment
  id: number;

  @Column({ type: 'text' }) // nullable if true relation column can be null
  body: string;

  @Column({ type: 'integer' })
  postId: number;

  @Column({ type: 'integer' })
  userId: number;

  @Column({ type: 'integer', nullable: true })
  parentId: number | null;

  // Relations
  @ManyToOne('Post', (post: Post) => post.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: Post;

  @ManyToOne('User', (user: User) => user.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  author: User;

  // Self-referential relations for nested comments
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
