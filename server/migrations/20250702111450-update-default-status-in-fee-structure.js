'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('fee_structure', 'status', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true 
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('fee_structure', 'status', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
  }
};
