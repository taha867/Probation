export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Posts", "image", {
      type: Sequelize.STRING,
      allowNull: true, // Optional field - posts can exist without images
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Posts", "image");
  },
};
