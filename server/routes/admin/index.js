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
const {isAdmin, isEmployee } = require('../../middlewares/roleCheck')
const authenticateJWT = require('../../middlewares/auth')
const { getBusinessZones, getBusinessZoneByUUID } = require('../../controllers/businessZoneController');
const { 
  getBusinessActivity,
  getBusinessActivityByUUID,} = require('../../controllers/businessActivityController');
const {
  getBusinessZonesAuthorities,
  getBusinessZonesAuthorityByZoneId
} = require('../../controllers/businessZoneAuthorityController');

router.get('/get-zone',authenticateJWT, isEmployee, getBusinessZones);
router.get('/get-zone-by-uuid/:uuid',authenticateJWT, isEmployee,getBusinessZoneByUUID)
router.get('/get-activity',authenticateJWT, isEmployee,getBusinessActivity)
router.get('/get-activity-by-uuid/:uuid',authenticateJWT, isEmployee,getBusinessActivityByUUID)
// Get all authorities
router.get('/get-authorities',authenticateJWT, isEmployee, getBusinessZonesAuthorities);
router.get('/get-authority-by-zone/:id',authenticateJWT, isEmployee, getBusinessZonesAuthorityByZoneId);
router.use('/admin',authenticateJWT,isAdmin,user)
router.use('/admin',authenticateJWT,isAdmin,BusinessZone)
router.use('/admin',authenticateJWT,isAdmin,BusinessZoneAuhtority)
router.use('/admin',authenticateJWT,isAdmin,BusinessActivity)
router.use('/admin',authenticateJWT,isAdmin,FeeStructure)
router.use('/admin',authenticateJWT,isAdmin,Client)
router.use('/admin',authenticateJWT,isAdmin,Lead)
router.use('/admin',authenticateJWT,isAdmin,Package)
router.use('/admin',authenticateJWT,isAdmin,Category)
router.use('/admin',authenticateJWT,isAdmin,SubCategory)

module.exports = router;

