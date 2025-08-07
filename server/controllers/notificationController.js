const { Notification } = require('../models');
const { Op, where } = require('sequelize');

const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const notifications = await Notification.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
    });

    return res.status(200).json({
      success: true,
      message: 'Notifications fetched successfully',
      data: notifications,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
    });
  }
};

const markNotificationsAsRead = async (ids) => {
 try {
    const { ids, type } = req.body;
    const userId = req.user.id; // assuming you're using authentication middleware

    const whereClause = {
      user_id: userId,
      is_read: 0, 
    };

    if (ids) {
      const idArray = Array.isArray(ids) ? ids : [ids];
      whereClause.uuid = { [Op.in]: idArray };
    } else if (type) {
      whereClause.type = type; // e.g., 'proposal'
    } else {
      return res.status(400).json({ message: 'Either ids or type must be provided' });
    }

    const [updatedCount] = await Notification.update(
      { is_read: 1 },
      { where: whereClause }
    );

    return res.status(200).json({
      success: true,
      message: `${updatedCount} notification(s) marked as read.`
    });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating notifications',
      error
    });
  }
};




module.exports = {
  getNotifications,
  markNotificationsAsRead,
};
