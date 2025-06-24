'use strict';
const bcrypt = require('bcrypt');
 
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const adminPassword = await bcrypt.hash('admin123', 10);
    const empPassword = await bcrypt.hash('employee123', 10);
 
    return queryInterface.bulkInsert('users', [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: adminPassword,
        role: 'admin',
        created_at: new Date()
      },
      {
        name: 'Employee One',
        email: 'employee1@example.com',
        password: empPassword,
        role: 'employee',
        created_at: new Date()
      }
    ]);
  },
 
  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', {
      email: { [Sequelize.Op.in]: ['admin@example.com', 'employee1@example.com'] }
    });
  }

};