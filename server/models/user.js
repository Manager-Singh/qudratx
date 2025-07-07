const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {

       uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Auto-generate UUID
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'employee'),
      allowNull: false
    },
     status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
    },
     last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    login_status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    paranoid: true, // ✅ enable soft delete
    deletedAt: 'deleted_at' // ✅ custom field name
  });

  User.prototype.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  User.associate = (models) => {
    User.hasMany(models.Lead, { foreignKey: 'assigned_by', as: 'assignedLeads' });
    User.hasMany(models.Lead, { foreignKey: 'assigned_to', as: 'receivedLeads' });
    User.hasMany(models.Lead, { foreignKey: 'created_by', as: 'createdLeads' });
  };

  return User;
};
