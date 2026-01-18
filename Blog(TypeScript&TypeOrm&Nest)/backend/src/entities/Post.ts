import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import type { User } from "./User.js";
import type { Comment } from "./Comment.js";
import { BaseEntity } from "./BaseEntity.js";

/**
 * Post status enum, best for roles, status, updates, etc.
 */
export enum PostStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
}

/**
 * Post entity
 * Represents a blog post in the database
 * Extends BaseEntity for automatic timestamp management
 */
@Entity("Posts")
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  title: string;

  @Column({ type: "text" })
  body: string;

  @Column({ type: "integer" })
  userId: number;

  @Column({
    type: "enum",
    enum: PostStatus,
    default: PostStatus.DRAFT,
  })
  status: PostStatus;

  @Column({ type: "varchar", nullable: true })
  image: string | null;

  @Column({ type: "varchar", nullable: true })
  imagePublicId: string | null;

  // Relations
  @ManyToOne("User", (user: User) => user.posts, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" }) // foreign key owner
  author: User;

  @OneToMany("Comment", (comment: Comment) => comment.post, { cascade: true, onDelete: "CASCADE" })
  comments: Comment[];
}

