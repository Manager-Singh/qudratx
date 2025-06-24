'use strict';
 
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};
 
// ✅ Import audit hook utility
const { createAuditHooks } = require('../utils/auditLogHooks');
 
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}
 
// ✅ Load all model files dynamically
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });
 
// ✅ Call associations + attach audit hooks
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
 
  // ✅ Attach audit hooks to all models except StatusLog
  if (modelName !== 'AuditLog') {
    const hooks = createAuditHooks(modelName);
    db[modelName].addHook('afterCreate', hooks.afterCreate);
    db[modelName].addHook('beforeUpdate', hooks.beforeUpdate);
    db[modelName].addHook('beforeDestroy', hooks.beforeDestroy);
  }
});
 
db.sequelize = sequelize;
db.Sequelize = Sequelize;
 
module.exports = db;