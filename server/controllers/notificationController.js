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

const markNotificationsAsRead = async (req, res) => {
  try {
    const { uuid, type } = req.body;
    const userId = req.user.id; // assuming authentication middleware sets this

    if (!uuid && !type) {
      return res.status(400).json({
        success: false,
        message: "Either uuid or type must be provided",
      });
    }

    const whereClause = {
      user_id: userId,
    
    };

    if (uuid) {
      whereClause.uuid = uuid; // single notification
    } else if (type) {
      whereClause.type = type; // all notifications of that type
    }

   

    const [updatedCount] = await Notification.update(
      { is_read: 1 },
      { where: whereClause }
    );

    return res.status(200).json({
      success: true,
      message: `${updatedCount} notification(s) marked as read.`,
    });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating notifications",
      error: error.message,
    });
  }
};




module.exports = {
  getNotifications,
  markNotificationsAsRead,
};
