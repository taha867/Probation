import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { User } from "./User.js";
import { Post } from "./Post.js";
import { BaseEntity } from "./BaseEntity.js";

/**
 * Comment entity
 * Represents a comment on a post, with support for nested replies
 * Extends BaseEntity for automatic timestamp management
 */
@Entity("Comments")
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn() //Auto increment
  id!: number;

  @Column({ type: "text", nullable: false }) // nullable if true relation column can be null
  body!: string;

  @Column({ type: "integer", nullable: false })
  postId!: number;

  @Column({ type: "integer", nullable: false })
  userId!: number;

  @Column({ type: "integer", nullable: true })
  parentId: number | null = null;

  // Relations
  @ManyToOne(() => Post, (post: Post) => post.comments, { onDelete: "CASCADE" })
  @JoinColumn({ name: "postId" })
  post!: Post;

  @ManyToOne(() => User, (user: User) => user.comments, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  author!: User;

  // Self-referential relations for nested comments
  @ManyToOne(() => Comment, (comment: Comment) => comment.replies, { nullable: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "parentId" })
  parent: Comment | null = null;

  @OneToMany(() => Comment, (comment: Comment) => comment.parent, { cascade: true, onDelete: "CASCADE" })
  replies!: Comment[];
}

