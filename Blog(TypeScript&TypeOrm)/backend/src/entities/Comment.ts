import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { User } from "./User.js";
import { Post } from "./Post.js";

/**
 * Comment entity
 * Represents a comment on a post, with support for nested replies
 */
@Entity("Comments")
export class Comment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text", nullable: false })
  body!: string;

  @Column({ nullable: false })
  postId!: number;

  @Column({ nullable: false })
  userId!: number;

  @Column({ nullable: true })
  parentId: number | null = null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

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

