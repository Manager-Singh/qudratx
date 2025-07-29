'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.changeColumn('proposals', 'proposal_status', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'Proposal Sent'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('proposals', 'proposal_status', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false // or whatever was previously used
    });
  }
};
