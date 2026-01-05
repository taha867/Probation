import { Model, Sequelize, DataTypes, ModelStatic } from "sequelize";
import { DatabaseModels } from "./index.js";

/**
 * Post status enum type
 * Defines valid post status values
 */
export type PostStatus = "draft" | "published";

/**
 * Post model attributes interface
 * Defines the structure of Post data in the database
 */
interface PostAttributes {
  id?: number;
  title: string;
  body: string;
  userId: number;
  status: PostStatus;
  image?: string | null;
  imagePublicId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Post creation attributes
 * Attributes required/optional when creating a new post
 */
interface PostCreationAttributes
  extends Omit<PostAttributes, "id" | "createdAt" | "updatedAt"> {
  title: string; // Required for creation
  body: string; // Required for creation
  userId: number; // Required for creation
}

/**
 * Post model class extending Sequelize Model
 * Includes static associations with User and Comment models
 */
class Post extends Model<PostAttributes, PostCreationAttributes> implements PostAttributes {
  declare id: number;
  declare title: string;
  declare body: string;
  declare userId: number;
  declare status: PostStatus;
  declare image: string | null;
  declare imagePublicId: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;

  /**
   * Define associations with other models
   * @param models - Database models object containing all models
   */
  static associate(models: DatabaseModels): void {
    const PostModel = this as ModelStatic<Post>;
    // Type assertion for models - they are loaded dynamically
    const UserModel = models.User as any;
    const CommentModel = models.Comment as any;

    PostModel.belongsTo(UserModel, {
      foreignKey: "userId",
      as: "author",
      onDelete: "CASCADE",
    });

    PostModel.hasMany(CommentModel, {
      foreignKey: "postId",
      as: "comments",
      onDelete: "CASCADE",
    });
  }
}

/**
 * Initialize the Post model
 * @param sequelize - Sequelize instance
 * @param dataTypes - Sequelize DataTypes
 * @returns Post model class
 */
export default function (sequelize: Sequelize, dataTypes: typeof DataTypes): typeof Post {
  Post.init(
    {
      title: {
        type: dataTypes.STRING,
        allowNull: false,
      },
      body: {
        type: dataTypes.TEXT,
        allowNull: false,
      },
      userId: {
        type: dataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      status: {
        type: dataTypes.ENUM("draft", "published"),
        defaultValue: "draft",
        allowNull: false,
      },
      image: {
        type: dataTypes.STRING,
        allowNull: true, // Optional field - posts can exist without images
      },
      imagePublicId: {
        type: dataTypes.STRING,
        allowNull: true, // Cloudinary public_id for image deletion
      },
    },
    {
      sequelize,
      modelName: "Post",
    }
  );

  return Post;
}

