module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define('Company', {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
       phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Array of address objects',
    },
    terms_and_conditions: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    bank_details: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Includes bank_title, account_number, iban_number, bank, branch, swift_code',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    logo: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    icon: {
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
    },
    updated_by: {
      type: DataTypes.INTEGER,
    },
    last_update: {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'company',
    timestamps: false,
    paranoid: true,
  });

  return Company;
};
