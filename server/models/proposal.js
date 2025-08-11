module.exports = (sequelize, DataTypes) => {
  const Proposal = sequelize.define('Proposal', {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
    },

    lead_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },

    client_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },

    client_info: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    zone_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    zone_name: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    zone_info: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    authority_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },

    authority_name: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    authority_info: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    package_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },

    package_name: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    package_info: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    approved_by: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    approval_status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: '0 = unapproved, 1 = approved',
    },
    business_activities: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    total_amount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    business_questions: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    what_to_include: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    required_documents: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    benefits: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    other_benefits: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    scope_of_work: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    notes: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
   proposal_status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Proposal Sent'
    },
     proposal_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    step: {
      type: DataTypes.STRING,
      allowNull: true,
    },
      generated_pdf: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
      pdf_path: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
      employee_approval: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
       reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deleted_at: {
      type: DataTypes.DATE,
    },

    updated_by: {
      type: DataTypes.INTEGER,
    },

    last_update: {
      type: DataTypes.DATE,
    }
  }, {
    tableName: 'proposals',
    timestamps: false,
    paranoid: true,
  });
     Proposal.associate = (models) => {
      Proposal.belongsTo(models.User, {
      foreignKey: 'created_by',
      as: 'creator',
    });
    Proposal.belongsTo(models.Lead, { as: 'lead', foreignKey: 'lead_id' });
    
  };

  return Proposal;
};
