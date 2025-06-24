const { AuditLog, User } = require('../models');
 
async function getUserName(userId) {
  if (!userId) return null;
  const user = await User.findByPk(userId, { attributes: ['name'] });
  return user?.name || `User ${userId}`;
}
 
function createAuditHooks(modelName) {
  return {
    afterCreate: async (instance, options) => {
      const performer = await getUserName(options.userId);
      await StatusLog.create({
        model: modelName,
        modelId: instance.id,
        action: 'created',
        changes: instance.dataValues,
        userId: options.userId || null,
        performedByName: performer
      });
    },
 
    beforeUpdate: async (instance, options) => {
      const performer = await getUserName(options.userId);
      const changedFields = instance.changed();
      const changes = {};
 
      changedFields.forEach(field => {
        changes[field] = [
          instance._previousDataValues[field],
          instance.dataValues[field]
        ];
      });
 
      if (Object.keys(changes).length > 0) {
        await StatusLog.create({
          model: modelName,
          modelId: instance.id,
          action: 'updated',
          changes,
          userId: options.userId || null,
          performedByName: performer
        });
      }
    },
 
    beforeDestroy: async (instance, options) => {
      const performer = await getUserName(options.userId);
      await StatusLog.create({
        model: modelName,
        modelId: instance.id,
        action: 'deleted',
        changes: instance.dataValues,
        userId: options.userId || null,
        performedByName: performer
      });
    }
  };
}
 
module.exports = { createAuditHooks };