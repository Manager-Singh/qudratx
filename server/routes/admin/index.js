const express = require('express');
const router = express.Router();
const user = require('./user')
const BusinessZone = require('./businessZone')
const BusinessZoneAuhtority = require('./businessZoneAuthority')
const BusinessActivity = require('./businessActivity')
const FeeStructure = require('./feeStructure')
const Client = require('./client')
const Lead = require('./lead')
const Package = require('./package')
const {isAdmin} = require('../../middlewares/roleCheck')
const authenticateJWT = require('../../middlewares/auth')

router.use('/admin',authenticateJWT,isAdmin,user)
router.use('/admin',authenticateJWT,isAdmin,BusinessZone)
router.use('/admin',authenticateJWT,isAdmin,BusinessZoneAuhtority)
router.use('/admin',authenticateJWT,isAdmin,BusinessActivity)
router.use('/admin',authenticateJWT,isAdmin,FeeStructure)
router.use('/admin',authenticateJWT,isAdmin,Client)
router.use('/admin',authenticateJWT,isAdmin,Lead)
router.use('/admin',authenticateJWT,isAdmin,Package)

module.exports = router;

