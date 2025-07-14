'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('packages', 'authority_id', {
        type: Sequelize.BIGINT,
        allowNull: false,
      });
    await queryInterface.addColumn('packages', 'activity', {
      type: Sequelize.BIGINT,
      allowNull: false,
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
