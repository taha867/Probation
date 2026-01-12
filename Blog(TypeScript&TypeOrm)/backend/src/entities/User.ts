import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
import { hashPassword } from "../utils/bcrypt.js";
import { Post } from "./Post.js";
import { Comment } from "./Comment.js";

/**
 * User entity
 * Represents a user in the database
 */
@Entity("Users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  name!: string;

  @Column({ unique: true, nullable: false })
  email!: string;

  @Column({ unique: true, nullable: true })
  phone: string | null = null;

  @Column({ nullable: false, select: false })
  password!: string;

  @Column({ nullable: true })
  status: string | null = null;

  @Column({ nullable: true })
  image: string | null = null;

  @Column({ nullable: true })
  imagePublicId: string | null = null;

  @Column({ name: "last_login_at", nullable: true })
  lastLoginAt: Date | null = null;

  @Column({ default: 0, nullable: false })
  tokenVersion!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @OneToMany(() => Post, (post: Post) => post.author, { cascade: true, onDelete: "CASCADE" })
  posts!: Post[];

  @OneToMany(() => Comment, (comment: Comment) => comment.author, { cascade: true, onDelete: "CASCADE" })
  comments!: Comment[];

  // Hooks
  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    if (this.password) {
      this.password = await hashPassword(this.password);
    }
  }

  @BeforeUpdate()
  async hashPasswordBeforeUpdate() {
    // TypeORM doesn't track changes like Sequelize
    // We check if password looks like plain text (not a bcrypt hash)
    // Bcrypt hashes start with $2a$, $2b$, or $2y$ and are ~60 chars
    if (this.password && !this.password.startsWith("$2") && this.password.length < 60) {
      this.password = await hashPassword(this.password);
    }
  }

  // Custom method to exclude password from JSON
  toJSON(): Omit<User, "password" | "hashPasswordBeforeInsert" | "hashPasswordBeforeUpdate" | "toJSON"> {
    const { password, hashPasswordBeforeInsert, hashPasswordBeforeUpdate, toJSON, ...rest } = this;
    return rest as Omit<User, "password" | "hashPasswordBeforeInsert" | "hashPasswordBeforeUpdate" | "toJSON">;
  }
}

