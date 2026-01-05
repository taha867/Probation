import { Model, Sequelize, DataTypes, ModelStatic } from "sequelize";
import { hashPassword } from "../utils/bcrypt.js";
import { DatabaseModels } from "./index.js";

/**
 * Protected attributes that should not be exposed in API responses
 */
const PROTECTED_ATTRIBUTES = ["password"] as const;

/**
 * User model attributes interface
 * Defines the structure of User data in the database
 * reading
 * id , timestamp exists
 */
interface UserAttributes {
  id?: number;
  name: string;
  email: string;
  phone?: string | null;
  password: string;
  status?: string;
  image?: string | null;
  imagePublicId?: string | null;
  lastLoginAt?: Date | null;
  tokenVersion: number;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * User creation attributes
 * Attributes required/optional when creating a new user
 * Creation
 * id, timestamp doesnot exists
 */
interface UserCreationAttributes extends Omit<UserAttributes, "id" | "createdAt" | "updatedAt"> {
  email: string; // Required for creation
  password: string; // Required for creation
}

/**
 * User model class extending Sequelize Model
 * Includes custom methods and static associations
 * Here, all of these fields (id, name, email, etc.) are populated by Sequelize at runtime when you do something like:
 * const user = await User.findByPk(1);
 */
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: number;
  declare name: string;
  declare email: string;
  declare phone: string | null;
  declare password: string;
  declare status: string;
  declare image: string | null;
  declare imagePublicId: string | null;
  declare lastLoginAt: Date | null;
  declare tokenVersion: number;
  declare createdAt: Date;
  declare updatedAt: Date;

  /**
   * Custom toJSON method to hide protected fields
   * Removes password and other sensitive data from API responses
   */
  toJSON(): Omit<UserAttributes, "password"> {
    const attributes = { ...this.get() };
    // eslint-disable-next-line no-restricted-syntax
    for (const attr of PROTECTED_ATTRIBUTES) {
      delete attributes[attr as keyof typeof attributes];
    }
    return attributes as Omit<UserAttributes, "password">;
  }

  /**
   * Define associations with other models
   * @param models - Database models object containing all models
   */
  static associate(models: DatabaseModels): void {
    const UserModel = this as ModelStatic<User>;
    // Type assertion for models - they are loaded dynamically
    const PostModel = models.Post as any;
    const CommentModel = models.Comment as any;

    UserModel.hasMany(PostModel, {
      foreignKey: "userId",
      as: "posts",
      onDelete: "CASCADE",
    });

    UserModel.hasMany(CommentModel, {
      foreignKey: "userId",
      as: "comments",
      onDelete: "CASCADE",
    });
  }
}

/**
 * Initialize the User model
 * @param sequelize - Sequelize instance
 * @param dataTypes - Sequelize DataTypes
 * @returns User model class
 */
export default function (sequelize: Sequelize, dataTypes: typeof DataTypes): typeof User {
  User.init(
    {
      name: {
        type: dataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: dataTypes.STRING,
        allowNull: true,
      },
      imagePublicId: {
        type: dataTypes.STRING,
        allowNull: true, // Cloudinary public_id for image deletion
      },
      email: {
        type: dataTypes.STRING,
        allowNull: false,
        unique: {
          name: "email",
          msg: "Email already exists",
        },
        validate: {
          isEmail: {
            msg: "Please enter a valid email address",
          },
        },
      },
      phone: {
        type: dataTypes.STRING,
        unique: true,
        allowNull: true,
      },
      password: {
        type: dataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: dataTypes.STRING,
        allowNull: true,
      },
      lastLoginAt: {
        type: dataTypes.DATE,
        field: "last_login_at",
        allowNull: true,
      },
      tokenVersion: {
        type: dataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
    },
    {
      sequelize, // Pass the connection instance
      modelName: "User", // Model name
      hooks: {
        /**
         * Hash password before creating a new user
         */
        beforeCreate: async (user: User): Promise<void> => {
          if (user.password) {
            user.password = await hashPassword(user.password);
          }
        },
        /**
         * Hash password before updating if password field is being changed
         */
        beforeUpdate: async (user: User): Promise<void> => {
          if (user.changed("password") && user.password) {
            user.password = await hashPassword(user.password);
          }
        },
      },
    }
  );

  return User;
}

