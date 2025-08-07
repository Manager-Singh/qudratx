const express = require('express');
const router = express.Router();
const { getNotifications,markNotificationsAsRead } = require('../../controllers/notificationController');

router.all('/get-notifications',getNotifications)
router.post('/mark-as-read', markNotificationsAsRead);



module.exports = router;
