const express = require('express');
const router = express.Router();
const user = require('./user')
const BusinessZone = require('./businessZone')
const {isAdmin} = require('../../middlewares/roleCheck')
const authenticateJWT = require('../../middlewares/auth')

router.use('/admin',authenticateJWT,isAdmin,user)
router.use('/admin',authenticateJWT,isAdmin,BusinessZone)

module.exports = router;

