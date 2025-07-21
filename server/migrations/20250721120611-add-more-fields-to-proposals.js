'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('proposals', 'created_by', {
      type: Sequelize.BIGINT,
      allowNull: false,
    });

    await queryInterface.addColumn('proposals', 'approved_by', {
      type: Sequelize.BIGINT,
      allowNull: true,
    });

    await queryInterface.addColumn('proposals', 'approval_status', {
      type: Sequelize.TINYINT,
      allowNull: false,
      comment: '0 = unapproved, 1 = approved'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('proposals', 'created_by');
    await queryInterface.removeColumn('proposals', 'approved_by');
    await queryInterface.removeColumn('proposals', 'approval_status');
  }
};
