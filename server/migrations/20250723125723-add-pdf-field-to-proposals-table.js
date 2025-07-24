'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.addColumn('proposals', 'generated_pdf', {
            type: Sequelize.TEXT,
            allowNull: true,
        });

      await queryInterface.addColumn('proposals', 'pdf_path', {
               type: Sequelize.TEXT,
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
