'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('leads', 'lead_number', {
      type: Sequelize.STRING,
      allowNull: true, // or false if you want it required
      unique: true     // optional, based on your logic
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('leads', 'lead_number');
  }
};
