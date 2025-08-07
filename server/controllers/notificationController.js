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
    // Normalize to array if single ID is passed
    const idArray = Array.isArray(ids) ? ids : [ids];

    // Update is_read = 1 for the given IDs
    const result = await Notification.update(
      { is_read: 1 },
      {
        where: {
          id: {
            [Op.in]: idArray
          },
          deleted_at: null // optional safeguard
        }
      }
    );

    return {
      success: true,
      message: `${result[0]} notification(s) marked as read.`
    };
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    return {
      success: false,
      message: 'Error occurred while updating notifications.',
      error
    };
  }
};




module.exports = {
  getNotifications,
  markNotificationsAsRead,
};
