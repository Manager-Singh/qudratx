'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.addColumn('packages', 'fee_structure', {
      type: Sequelize.JSON,
      allowNull: false,
    });
      await queryInterface.addColumn('packages', 'subtotal', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.addColumn('packages', 'discount', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
     await queryInterface.addColumn('packages', 'tax', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

  },

  async down (queryInterface, Sequelize) {
      await queryInterface.removeColumn('packages', 'fee_structure');
    await queryInterface.removeColumn('packages', 'subtotal');
    await queryInterface.removeColumn('packages', 'discount');
    await queryInterface.removeColumn('packages', 'tax');
  }
};
