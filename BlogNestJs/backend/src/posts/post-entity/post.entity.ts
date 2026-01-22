import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import type { User } from "../../users/user-entity/user.entity";
import type { Comment } from "../../comments/comment-entity/comment.entity";
import { BaseEntity } from "../../common/entities/BaseEntity";

export enum PostStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
}

@Entity("Posts")
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  // Explicit type 'text' needed: TEXT vs VARCHAR (unlimited length)
  // TypeORM would default to VARCHAR(255) without explicit type
  @Column({ type: "text" })
  body: string;

  // Explicit type needed: TypeORM can't infer integer from number
  @Column({ type: "integer" })
  userId: number;

  // Explicit type 'enum' required for enum columns
  @Column({
    type: "enum",
    enum: PostStatus,
    default: PostStatus.DRAFT,
  })
  status: PostStatus;

  // nullable: true = database constraint
  // string | null = TypeScript type safety
  // Explicit type needed: TypeORM can't infer varchar from string | null
  @Column({ type: "varchar", nullable: true })
  image: string | null;

  @Column({ type: "varchar", nullable: true })
  imagePublicId: string | null;

  @ManyToOne("User", (user: User) => user.posts, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" }) // foreign key owner
  author: User;

  @OneToMany("Comment", (comment: Comment) => comment.post, {
    cascade: true,
    onDelete: "CASCADE",
  })
  comments: Comment[];
}

