'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('leads', 'lead_status', {
      type: Sequelize.STRING,
      defaultValue: 'Waiting to Send Proposal',
      allowNull: false,
    });
    
    await queryInterface.addColumn('leads', 'approval_status', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'unapproved'
    });
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.removeColumn('leads', 'approval_status');
  }
};
