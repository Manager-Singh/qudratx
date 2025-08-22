const express = require('express');
const router = express.Router();
const { getUserReasons } = require('../../controllers/reasonController');

router.all('/get-reasons',getUserReasons)


module.exports = router;
