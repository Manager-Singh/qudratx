const express = require('express');
const router = express.Router();
const user = require('./user')
const authenticateJWT = require('../../middlewares/auth')

router.use('/common',authenticateJWT,user)

module.exports = router;