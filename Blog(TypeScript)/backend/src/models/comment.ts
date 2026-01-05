import { Model, Sequelize, DataTypes, ModelStatic } from "sequelize";
import { DatabaseModels } from "./index.js";

/**
 * Comment model attributes interface
 * Defines the structure of Comment data in the database
 */
interface CommentAttributes {
  id?: number;
  body: string;
  postId: number;
  userId: number;
  parentId?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Comment creation attributes
 * Attributes required/optional when creating a new comment
 */
interface CommentCreationAttributes
  extends Omit<CommentAttributes, "id" | "createdAt" | "updatedAt"> {
  body: string; // Required for creation
  postId: number; // Required for creation
  userId: number; // Required for creation
}

/**
 * Comment model class extending Sequelize Model
 * Includes static associations with Post, User, and self-referential relationships
 */
class Comment extends Model<CommentAttributes, CommentCreationAttributes>
  implements CommentAttributes
{
  declare id: number;
  declare body: string;
  declare postId: number;
  declare userId: number;
  declare parentId: number | null;
  declare createdAt: Date;
  declare updatedAt: Date;

  /**
   * Define associations with other models
   * Includes self-referential relationship for nested comments (replies)
   * @param models - Database models object containing all models
   */
  static associate(models: DatabaseModels): void {
    const CommentModel = this as ModelStatic<Comment>;
    // Type assertion for models - they are loaded dynamically
    const PostModel = models.Post as any;
    const UserModel = models.User as any;

    // Comment belongs to a Post
    CommentModel.belongsTo(PostModel, {
      foreignKey: "postId",
      as: "post",
      onDelete: "CASCADE",
    });

    // Comment belongs to a User (author)
    CommentModel.belongsTo(UserModel, {
      foreignKey: "userId",
      as: "author",
      onDelete: "CASCADE",
    });

    // Self-referential relationship: Comment belongs to parent Comment
    CommentModel.belongsTo(CommentModel, {
      foreignKey: "parentId",
      as: "parent",
      onDelete: "CASCADE",
    });

    // Self-referential relationship: Comment has many replies
    CommentModel.hasMany(CommentModel, {
      foreignKey: "parentId",
      as: "replies",
      onDelete: "CASCADE",
    });
  }
}

/**
 * Initialize the Comment model
 * @param sequelize - Sequelize instance
 * @param dataTypes - Sequelize DataTypes
 * @returns Comment model class
 */
export default function (sequelize: Sequelize, dataTypes: typeof DataTypes): typeof Comment {
  Comment.init(
    {
      body: {
        type: dataTypes.TEXT,
        allowNull: false,
      },
      postId: {
        type: dataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Posts",
          key: "id",
        },
      },
      userId: {
        type: dataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      parentId: {
        type: dataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Comments",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Comment",
    }
  );

  return Comment;
}

