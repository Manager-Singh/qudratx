module.exports = (sequelize, DataTypes) => {
  const FeeStructure = sequelize.define('FeeStructure', {
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
      amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
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
    tableName: 'fee_structure',
    timestamps: false,
    paranoid: true,
  });
  return FeeStructure;
};
