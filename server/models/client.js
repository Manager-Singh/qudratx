module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define('Client', {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
     address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
     email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
     company_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
     notes: {
      type: DataTypes.STRING,
      allowNull: true,
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
    tableName: 'clients',
    timestamps: false,
    paranoid: true,
  });
  Client.associate = (models) => {
  Client.hasMany(models.Lead, { foreignKey: 'client_id' });
  Client.hasMany(models.Proposal, { foreignKey: "client_id", as: "proposals" });

};
  return Client;
};
