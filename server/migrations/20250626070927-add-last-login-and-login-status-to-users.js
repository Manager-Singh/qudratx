'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'last_login', {
      type: Sequelize.DATE,
      allowNull: true,
      after: 'role', 
    });

    await queryInterface.addColumn('users', 'login_status', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
       after: 'last_login', 
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'last_login');
    await queryInterface.removeColumn('users', 'login_status');
  }
};
