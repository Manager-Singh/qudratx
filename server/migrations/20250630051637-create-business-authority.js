'use strict';

const { reference } = require("@popperjs/core");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('business_zones_authority', {
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
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      zone_id:{
        type:Sequelize.INTEGER,
        reference:{
          model:'business_zone',
          key: 'id'
        },
        onUpdate:'CASCADE',
        onDelte:'SET NULL'
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
      last_update: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('business_zones_authority');
  }
};
