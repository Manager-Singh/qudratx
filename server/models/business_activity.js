module.exports = (sequelize, DataTypes) => {
  const BusinessActivity = sequelize.define('BusinessActivity', {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
    },

    authority_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    activity_master_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    activity_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    zone: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    activity_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    activity_name_arabic: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },

    minimum_share_capital: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    license_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    is_not_allowed_for_coworking_esr: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },

    is_special: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    activity_price: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    activity_group: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    qualification_requirement: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    documents_required: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    additional_approval: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    sub_category: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    group_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    third_party: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    when: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    esr: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
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
      allowNull: true,
    },

    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    last_update: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'business_activity',
    timestamps: false,
    paranoid: true,
  });

  return BusinessActivity;
};
