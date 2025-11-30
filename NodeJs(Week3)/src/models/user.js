import { Model } from "sequelize";
import bcrypt from "bcrypt";

const PROTECTED_ATTRIBUTES = ["password"];

export default (sequelize, DataTypes) => {
  class User extends Model {
    //The custom toJSON method copies the row’s values (this.get()),
    //deletes each protected field (currently just password),
    //and returns the cleaned object. That way, API responses never expose passwords.

    toJSON() {
      // hide protected fields
      const attributes = { ...this.get() };
      // eslint-disable-next-line no-restricted-syntax
      for (const a of PROTECTED_ATTRIBUTES) {
        delete attributes[a];
      }
      return attributes;
    }
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Post, {
        foreignKey: "userId",
        as: "posts",
        onDelete: "CASCADE",
      });

      User.hasMany(models.Comment, {
        foreignKey: "userId",
        as: "comments",
        onDelete: "CASCADE",
      });
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        allowNull: {
          args: false,
          msg: "Please enter your email address",
        },
        unique: {
          args: true,
          msg: "Email already exists",
        },
        validate: {
          isEmail: {
            args: true,
            msg: "Please enter a valid email address",
          },
        },
      },
      phone: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: DataTypes.STRING,
      status: DataTypes.STRING,
      last_login_at: DataTypes.DATE,
      tokenVersion: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
    },
    {
      // Other model options go here
      sequelize, // We need to pass the connection instance
      modelName: "User", // We need to choose the model name
      hooks: {
        // Hash password before creating a new user
        beforeCreate: async (user) => {
          if (user.password) {
            const saltRounds = 10;
            user.password = await bcrypt.hash(user.password, saltRounds);
          }
        },
        // Hash password before updating if password field is being changed
        beforeUpdate: async (user) => {
          if (user.changed("password") && user.password) {
            const saltRounds = 10; //how many times bcrypt will process and rehash the password internally.
            user.password = await bcrypt.hash(user.password, saltRounds);
          }
        },
      },
    }
  );
  return User; // if not returned we will get undefined
};
