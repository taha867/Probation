import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.Post, {
        foreignKey: "postId",
        as: "post",
        onDelete: "CASCADE",
      });

      Comment.belongsTo(models.User, {
        foreignKey: "userId",
        as: "author",
        onDelete: "CASCADE",
      });

      // Self referential relationship for nested comments
      Comment.belongsTo(models.Comment, {
        foreignKey: "parentId",
        as: "parent",
        onDelete: "CASCADE",
      });

      Comment.hasMany(models.Comment, {
        foreignKey: "parentId",
        as: "replies",
        onDelete: "CASCADE",
      });
    }
  }

  Comment.init(
    {
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Posts",
          key: "id",
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      parentId: {
        type: DataTypes.INTEGER,
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
};

