import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class SubComment extends Model {
    static associate(models) {
      SubComment.belongsTo(models.Comment, {
        foreignKey: "commentId",
        as: "parentComment",
        onDelete: "CASCADE",
      });

      SubComment.belongsTo(models.User, {
        foreignKey: "userId",
        as: "author",
        onDelete: "CASCADE",
      });
    }
  }

  SubComment.init(
    {
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      commentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Comments",
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
    },
    {
      sequelize,
      modelName: "SubComment",
    }
  );

  return SubComment;
};

