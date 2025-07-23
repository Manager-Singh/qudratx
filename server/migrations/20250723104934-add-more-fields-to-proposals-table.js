'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('proposals', 'proposal_number', {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false,
        });

      await queryInterface.addColumn('proposals', 'step', {
                type: Sequelize.STRING,
                allowNull: true,
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
