const express = require('express');
const router = express.Router();
const { getDashboardCounts } = require('../../controllers/dashboardController');

router.get('/get-all-count',getDashboardCounts)

module.exports = router;
