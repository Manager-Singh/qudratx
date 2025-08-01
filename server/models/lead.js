module.exports = (sequelize, DataTypes) => {
  const Lead = sequelize.define('Lead', {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    lead_number: {
  type: DataTypes.STRING,
  allowNull: true,
  unique: true
},
    origin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
     created_status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
     lead_status: {
      type: DataTypes.STRING,
    defaultValue: 'Waiting to Send Proposal',
      allowNull: false,
    },
      assigned_to: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    assigned_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    approval_status:{
        type: DataTypes.STRING,
        defaultValue: 'unapproved',
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
    tableName: 'leads',
    timestamps: false,
    paranoid: true,
  });
  Lead.associate = (models) => {
  Lead.belongsTo(models.Client, { foreignKey: 'client_id' });
  Lead.belongsTo(models.User, { as: 'assignedBy', foreignKey: 'assigned_by' });
  Lead.belongsTo(models.User, { as: 'assignedTo', foreignKey: 'assigned_to' });
  Lead.belongsTo(models.User, { as: 'createdBy', foreignKey: 'created_by' });
  // Lead.hasMany(models.Proposal, {
  //   foreignKey: 'lead_id',
  //   as: 'proposals'
  // });

};
  return Lead;
};
