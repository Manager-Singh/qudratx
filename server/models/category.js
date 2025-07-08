module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
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
    tableName: 'categories',
    timestamps: false,
    paranoid: true,
  });
  return Category;
};
