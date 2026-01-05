export default {
  up: async (queryInterface, Sequelize) => {
    // Add imagePublicId column to Posts table
    await queryInterface.addColumn('Posts', 'imagePublicId', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Add imagePublicId column to Users table
    await queryInterface.addColumn('Users', 'imagePublicId', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove imagePublicId column from Posts table
    await queryInterface.removeColumn('Posts', 'imagePublicId');

    // Remove imagePublicId column from Users table
    await queryInterface.removeColumn('Users', 'imagePublicId');
  }
};
