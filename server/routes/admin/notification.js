const express = require('express');
const router = express.Router();
const { getNotifications } = require('../../controllers/notificationController');

router.all('/get-notifications',getNotifications)



module.exports = router;
