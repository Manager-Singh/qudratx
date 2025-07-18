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
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
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
    // Proposal.associate = (models) => {
    //   Proposal.belongsTo(models.Lead, {
    //     foreignKey: 'lead_id',
    //     as: 'lead'
    //   });

    //   Proposal.belongsTo(models.BusinessZone, {
    //     foreignKey: 'zone_id',
    //     as: 'zone'
    //   });

    //   Proposal.belongsTo(models.BusinessZoneAuthority, {
    //     foreignKey: 'authority_id',
    //     as: 'authority'
    //   });

    //   Proposal.belongsTo(models.Package, {
    //     foreignKey: 'package_id',
    //     as: 'package'
    //   });

    //   Proposal.belongsTo(models.Client, {
    //     foreignKey: 'client_id',
    //     as: 'client'
    //   });
    // };

  return Proposal;
};
