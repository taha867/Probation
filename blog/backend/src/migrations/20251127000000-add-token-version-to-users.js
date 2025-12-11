export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Users", "tokenVersion", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Users", "tokenVersion");
  },
};

