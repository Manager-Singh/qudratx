'use strict';

module.exports = (sequelize, DataTypes) => {
  const BusinessZonesAuthority = sequelize.define('BusinessZonesAuthority', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    zone_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    status: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    last_update: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'business_zones_authority',
    timestamps: false,
    paranoid: true
  });

  BusinessZonesAuthority.associate = function(models) {
    BusinessZonesAuthority.belongsTo(models.BusinessZone, {
      foreignKey: 'zone_id',
      as: 'zone'
    });
  };

  return BusinessZonesAuthority;
};
