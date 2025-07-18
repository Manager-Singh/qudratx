'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('leads', 'lead_status', {
      type: Sequelize.STRING,
      defaultValue: 'Waiting to Send Proposal',
      allowNull: false,
    });

  },

  async down (queryInterface, Sequelize) {
     await queryInterface.removeColumn('leads', 'lead_status');
  }
};
