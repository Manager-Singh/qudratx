'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
  await queryInterface.createTable('proposals', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  uuid: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    unique: true,
  },
  lead_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  business_zone_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  business_zone_authority_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  business_activity_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  package_detail: {
    type: Sequelize.JSON, // use Sequelize.TEXT if JSON not supported
    allowNull: false,
  },
  fee_breakdown: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  notes: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  total: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  status: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  created_at: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
  updated_at: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
  deleted_at: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  updated_by: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  last_update: {
    type: Sequelize.DATE,
    allowNull: true,
  },
});

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('proposals');
  }
};
