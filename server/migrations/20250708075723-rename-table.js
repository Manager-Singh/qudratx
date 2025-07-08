'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('business_activity', {
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
      activity_master_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      zone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      activity_code: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      activity_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      activity_name_arabic: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      minimum_share_capital: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      license_type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      is_not_allowed_for_coworking_esr: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: true,
      },
      is_special: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: true,
      },
      activity_price: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      activity_group: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      qualification_requirement: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      documents_required: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      category: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      additional_approval: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      sub_category: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      group_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      third_party: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      when: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      esr: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('business_activity');
  }
};
