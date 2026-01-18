import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import type { Post } from "./Post.js";
import type { Comment } from "./Comment.js";
import { BaseEntity } from "./BaseEntity.js";

@Entity("Users")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn() //Auto increment
  id: number;

  @Column({ type: "varchar" }) 
  name: string; 
  
  @Column({ type: "varchar", unique: true })
  email: string;

  @Column({ type: "varchar", unique: true, nullable: true }) // nullable if true relation column can be null
  phone: string | null = null;

  @Column({ type: "varchar", select: false }) // select false stores password but never return password in queries, it fails when Explicit select: ["password"]
  password: string;

  @Column({ type: "varchar", nullable: true })
  status: string | null;

  @Column({ type: "varchar", nullable: true })
  image: string | null;

  @Column({ type: "varchar", nullable: true }) // nullable: true ensures your database allows empty rows.
  imagePublicId: string | null; // | null ensures your code handles empty limits safely.

  @Column({ type: "timestamp", name: "last_login_at", nullable: true })
  lastLoginAt: Date | null;

  @Column({ type: "integer", default: 0 })
  tokenVersion: number;

  // Relations
  @OneToMany("Post", (post: Post) => post.author, {
    cascade: true,
    onDelete: "CASCADE",
  })
  posts: Post[];

  @OneToMany("Comment", (comment: Comment) => comment.author, {
    cascade: true,
    onDelete: "CASCADE",
  })
  comments: Comment[];

  // Entity Listner

  // Custom method to exclude password from JSON, it never fails
  toJSON(): Omit<User, "password" | "toJSON"> {
    const { password, toJSON, ...rest } = this; 
    return rest as Omit<User, "password" | "toJSON">;
  }
}
