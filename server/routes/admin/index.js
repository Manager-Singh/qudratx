const express = require('express');
const router = express.Router();
const user = require('./user')
const {isAdmin} = require('../../middlewares/roleCheck')
const authenticateJWT = require('../../middlewares/auth')

router.use('/admin',authenticateJWT,isAdmin,user)

module.exports = router;

