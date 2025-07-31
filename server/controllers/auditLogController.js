const { Op } = require('sequelize');
const { AuditLog } = require('../models');

const getAuditLogs = async (req, res) => {
  try {
    const {
      day,
      month,
      year,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      search = ''
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    let whereClause = {};

    // Date filtering
    const today = new Date();
    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    } else if (year && month && day) {
      const from = new Date(year, month - 1, day);
      const to = new Date(year, month - 1, parseInt(day) + 1);
      whereClause.createdAt = {
        [Op.gte]: from,
        [Op.lt]: to
      };
    } else if (year && month) {
      const from = new Date(year, month - 1, 1);
      const to = new Date(year, month, 1);
      whereClause.createdAt = {
        [Op.gte]: from,
        [Op.lt]: to
      };
    } else if (year) {
      const from = new Date(year, 0, 1);
      const to = new Date(parseInt(year) + 1, 0, 1);
      whereClause.createdAt = {
        [Op.gte]: from,
        [Op.lt]: to
      };
    } else {
      const from = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const to = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
      whereClause.createdAt = {
        [Op.gte]: from,
        [Op.lt]: to
      };
    }

    // Search filtering
    if (search) {
      whereClause[Op.or] = [
        { model: { [Op.like]: `%${search}%` } },
        { action: { [Op.like]: `%${search}%` } },
        { performedByName: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await AuditLog.findAndCountAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      offset,
      limit: parseInt(limit)
    });

    // Format each log entry with log_message
    const formattedLogs = rows.map((log) => {
  const logData = log.toJSON();
  const name = logData.performedByName || 'Someone';
  const action = logData.action;
  const model = logData.model;

  // Parse changes
  let parsedChanges = {};
  try {
    parsedChanges = typeof logData.changes === 'string'
      ? JSON.parse(logData.changes)
      : logData.changes || {};
  } catch (err) {
    parsedChanges = {};
  }

  // Format change details safely
  const changeDetails = Object.entries(parsedChanges)
    .map(([field, values]) => {
      // If values is an array with at least 2 items
      if (Array.isArray(values) && values.length >= 2) {
        return `${field}: "${values[0]}" → "${values[1]}"`;
      } else {
        return `${field}: changed`;
      }
    })
    .join(', ');

  const log_message = `${name} ${action} the ${model}${changeDetails ? ` with changes: ${changeDetails}` : ''}`;

  return {
    ...logData,
    log_message
  };
});


    return res.json({
      data: formattedLogs,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
      totalRecords: count
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ message: 'Failed to fetch audit logs' });
  }
};


module.exports = {
  getAuditLogs,
};
