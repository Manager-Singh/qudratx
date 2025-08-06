'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('proposals', 'approval_status', {
              type: Sequelize.TINYINT,
              allowNull: false,
              defaultValue: 2,
              comment: '0 = unapproved, 1 = approved, 2 = pending'
            });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
