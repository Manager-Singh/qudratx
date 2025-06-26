module.exports = (sequelize, DataTypes) => {
  return sequelize.define('AuditLog', {
    model: {
      type: DataTypes.STRING,
      allowNull: false
    },
    modelId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    action: {
      type: DataTypes.ENUM('created', 'updated', 'deleted'),
      allowNull: false
    },
    changes: {
      type: DataTypes.JSON,
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    performedByName: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'audit_logs',
    timestamps: true
  });
};
