'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('proposals', {
          id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        unique: true,
      },
      client_id: {
        type: Sequelize.BIGINT,
        allowNull: true
      },
      client_info: {
        type: Sequelize.JSON,
        allowNull: true
      },

      lead_id: {
        type: Sequelize.BIGINT,
        allowNull: true
      },

      zone_id: {
        type: Sequelize.BIGINT,
        allowNull: false
      },

      zone_name: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      zone_info: {
        type: Sequelize.JSON,
        allowNull: true
      },

      authority_id: {
        type: Sequelize.BIGINT,
        allowNull: false
      },

      authority_name: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      authority_info: {
        type: Sequelize.JSON,
        allowNull: true
      },

      package_id: {
        type: Sequelize.BIGINT,
        allowNull: false
      },

      package_name: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      package_info: {
        type: Sequelize.JSON,
        allowNull: true
      },

      business_activities: {
        type: Sequelize.JSON,
        allowNull: true
      },

      total_amount: {
        type: Sequelize.FLOAT,
        allowNull: true
      },

      business_questions: {
        type: Sequelize.JSON,
        allowNull: true
      },

      what_to_include: {
        type: Sequelize.JSON,
        allowNull: true
      },

      required_documents: {
        type: Sequelize.JSON,
        allowNull: true
      },

      benefits: {
        type: Sequelize.JSON,
        allowNull: true
      },

      other_benefits: {
        type: Sequelize.JSON,
        allowNull: true
      },

      scope_of_work: {
        type: Sequelize.JSON,
        allowNull: true
      },

      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
       status: {
       type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: true 
      },
       proposal_status: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true 
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

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('proposals');
  }
};
