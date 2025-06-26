'use strict';
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const adminPassword = await bcrypt.hash('admin123', 10);
    const empPassword = await bcrypt.hash('employee123', 10);

    return queryInterface.bulkInsert('users', [
      {
        uuid: uuidv4(),
        name: 'Admin User',
        email: 'admin@example.com',
        password: adminPassword,
        role: 'admin',
        login_status: false,
        last_login: null,
        created_at: new Date(),
        deleted_at: null,
      },
      {
        uuid: uuidv4(),
        name: 'Employee One',
        email: 'employee1@example.com',
        password: empPassword,
        role: 'employee',
        login_status: false,
        last_login: null,
        created_at: new Date(),
        deleted_at: null,
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', {
      email: {
        [Sequelize.Op.in]: ['admin@example.com', 'employee1@example.com']
      }
    });
  }
};
