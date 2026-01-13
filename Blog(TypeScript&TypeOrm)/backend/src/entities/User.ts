import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BeforeInsert,
} from "typeorm";
import { Post } from "./Post.js";
import { Comment } from "./Comment.js";
import { hashPassword } from "../utils/bcrypt.js";
import { BaseEntity } from "./BaseEntity.js";

/**
 * User entity
 * Represents a user in the database
 * Extends BaseEntity for automatic timestamp management
 */
@Entity("Users")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn() //Auto increment
  id!: number;

  @Column({ type: "varchar", nullable: false }) // nullable if true relation column can be null
  name!: string; // ! is a compile type assertion that tells typescript that this will be assigned before use

  @Column({ type: "varchar", unique: true, nullable: false }) 
  email!: string;

  @Column({ type: "varchar", unique: true, nullable: true })
  phone: string | null = null;

  @Column({ type: "varchar", nullable: false, select: false }) // select false stores password but never return password in queries, it fails when Explicit select: ["password"]
  password!: string;

  @Column({ type: "varchar", nullable: true })
  status: string | null = null;

  @Column({ type: "varchar", nullable: true })
  image: string | null = null;

  @Column({ type: "varchar", nullable: true })
  imagePublicId: string | null = null;

  @Column({ type: "timestamp", name: "last_login_at", nullable: true })
  lastLoginAt: Date | null = null;

  @Column({ type: "integer", default: 0, nullable: false })
  tokenVersion!: number;

  // Relations
  @OneToMany(() => Post, (post: Post) => post.author, { cascade: true, onDelete: "CASCADE" })
  posts!: Post[];

  @OneToMany(() => Comment, (comment: Comment) => comment.author, { cascade: true, onDelete: "CASCADE" })
  comments!: Comment[];

  // Entity Listner
  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    if (this.password) {
      this.password = await hashPassword(this.password);
    }
  }

  // Custom method to exclude password from JSON, it never fails
  toJSON(): Omit<User, "password" | "hashPasswordBeforeInsert" | "toJSON"> {
    const { password, hashPasswordBeforeInsert, toJSON, ...rest } = this;
    return rest as Omit<User, "password" | "hashPasswordBeforeInsert" | "toJSON">;
  }
}

