'use strict'

const { v4: uuidv4 } = require('uuid')

module.exports = {
  async up(queryInterface, Sequelize) {
    // Step 1: Add 'uuid' column as nullable, after 'id'
    await queryInterface.addColumn('users', 'uuid', {
      type: Sequelize.UUID,
      allowNull: false,
      unique: true,
      after: 'id', 
      defaultValue: Sequelize.UUIDV4,
    });

    // Step 2: Populate UUIDs (✅ FIX: Use `users` instead of "users")
    const [users] = await queryInterface.sequelize.query(`SELECT id FROM users`);

    for (const user of users) {
      await queryInterface.sequelize.query(`
        UPDATE users
        SET uuid = '${uuidv4()}'
        WHERE id = ${user.id}
      `);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'uuid');
  }
}
