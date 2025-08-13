'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.changeColumn('leads', 'approval_status', {
      type: Sequelize.TINYINT, // can also use Sequelize.INTEGER if you prefer
      allowNull: false,
      defaultValue: 0,
      comment: '0 = unapproved, 1 = approved, 2 = pending'
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.changeColumn('leads', 'approval_status', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'unapproved'
    });
  }
};
