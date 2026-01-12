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
import { Comment } from "./Comment.js";

/**
 * Post status enum
 */
export enum PostStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
}

/**
 * Post entity
 * Represents a blog post in the database
 */
@Entity("Posts")
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  title!: string;

  @Column({ type: "text", nullable: false })
  body!: string;

  @Column({ nullable: false })
  userId!: number;

  @Column({
    type: "enum",
    enum: PostStatus,
    default: PostStatus.DRAFT,
    nullable: false,
  })
  status!: PostStatus;

  @Column({ nullable: true })
  image: string | null = null;

  @Column({ nullable: true })
  imagePublicId: string | null = null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @ManyToOne(() => User, (user: User) => user.posts, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  author!: User;

  @OneToMany(() => Comment, (comment: Comment) => comment.post, { cascade: true, onDelete: "CASCADE" })
  comments!: Comment[];
}

