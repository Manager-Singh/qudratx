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
      type: DataTypes.INTEGER,
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
  return Client;
};
