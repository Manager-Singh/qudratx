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
const Category = require('./category')
const SubCategory = require('./subcategory')
const Company = require('./company')
const {isAdmin, isEmployee } = require('../../middlewares/roleCheck')
const authenticateJWT = require('../../middlewares/auth')

router.use('/admin',authenticateJWT,BusinessZone)
router.use('/admin',authenticateJWT,BusinessZoneAuhtority)
router.use('/admin',authenticateJWT,user)

router.use('/admin',authenticateJWT,BusinessActivity)
router.use('/admin',authenticateJWT,FeeStructure)
router.use('/admin',authenticateJWT,Client)
router.use('/admin',authenticateJWT,Lead)
router.use('/admin',authenticateJWT,Package)
router.use('/admin',authenticateJWT,Category)
router.use('/admin',authenticateJWT,SubCategory)
router.use('/admin',authenticateJWT,Company)

module.exports = router;

