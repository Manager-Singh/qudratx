module.exports = (sequelize, DataTypes) => {
  const Proposal = sequelize.define('Proposal', {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
    },
    lead_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    business_zone_id: {
    type: DataTypes.INTEGER,
    allowNull: true
    },
    business_zone_authority_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    business_activity_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    package_detail: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    fee_breakdown: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
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
    },
  }, {
    tableName: 'proposals',
    timestamps: false,
    paranoid: true,
  });
 
  return Proposal;
};
