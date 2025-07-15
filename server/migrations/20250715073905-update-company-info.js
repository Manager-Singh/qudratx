'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('company', 'phone', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('company', 'address', {
      type: Sequelize.JSON,
      allowNull: true,
      comment: 'Stores an array of addresses',
    });

    await queryInterface.addColumn('company', 'terms_and_conditions', {
      type: Sequelize.TEXT('long'),
      allowNull: true,
    });

    await queryInterface.addColumn('company', 'bank_details', {
      type: Sequelize.JSON,
      allowNull: true,
      comment: 'Includes bank_title, account_number, iban_number, bank, branch, swift_code',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('company', 'phone');
    await queryInterface.removeColumn('company', 'address');
    await queryInterface.removeColumn('company', 'terms_and_conditions');
    await queryInterface.removeColumn('company', 'bank_details');
  }
};
