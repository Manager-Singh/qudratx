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
const { 
  getCategory,
  getCategoryByUUID} = require('../../controllers/categoryController');
  const { 
  getClientDetail,
  getClientDetailByUUID} = require('../../controllers/clientController');
  const { 
  getFeeStructure,
  getFeeStructureByUUID} = require('../../controllers/feeStructureController');
  const {
  getLeadDetail,
  getLeadDetailByUUID} = require('../../controllers/leadController');
  const { 
  getPackage,
  getPackageByUUID} = require('../../controllers/packageController');
// const { 
//   getProposalDetail,
//   getProposalDetailByUUID
// } = require('../../controllers/proposalController');
  const {
  getSubCategory,
  getSubCategoryByUUID} = require('../../controllers/subCategoryController');
const {getEmployees,getEmployeeBYuuid} = require('../../controllers/userController');

router.get('/admin/get-zone',authenticateJWT, isEmployee, getBusinessZones);
router.get('/admin/get-zone-by-uuid/:uuid',authenticateJWT, isEmployee,getBusinessZoneByUUID)
router.get('/admin/get-activity',authenticateJWT, isEmployee,getBusinessActivity)
router.get('/admin/get-activity-by-uuid/:uuid',authenticateJWT, isEmployee,getBusinessActivityByUUID)
// Get all authorities
router.get('/admin/get-authorities',authenticateJWT, isEmployee, getBusinessZonesAuthorities);
router.get('/admin/get-authority-by-zone/:id',authenticateJWT, isEmployee, getBusinessZonesAuthorityByZoneId);
router.get('/admin/get-category',authenticateJWT, isEmployee,getCategory)
router.get('/admin/get-category-by-uuid/:uuid',authenticateJWT, isEmployee,getCategoryByUUID)
router.get('/admin/get-client-detail',authenticateJWT, isEmployee,getClientDetail)
router.get('/admin/get-client-detail-by-uuid/:uuid',authenticateJWT, isEmployee,getClientDetailByUUID)
router.get('/admin/get-fee-structure',authenticateJWT, isEmployee,getFeeStructure)
router.get('/admin/get-fee-structure-by-uuid/:uuid',authenticateJWT, isEmployee,getFeeStructureByUUID)
router.get('/admin/get-lead-detail',authenticateJWT, isEmployee,getLeadDetail)
router.get('/admin/get-lead-detail-by-uuid/:uuid',authenticateJWT, isEmployee,getLeadDetailByUUID)
router.get('/admin/get-package',authenticateJWT, isEmployee,getPackage)
router.get('/admin/get-package-by-uuid/:uuid',authenticateJWT, isEmployee,getPackageByUUID)
//router.get('/get-proposal-detail',authenticateJWT, isEmployee,getProposalDetail)
//router.get('/get-proposal-detail-by-uuid/:uuid',authenticateJWT, isEmployee,getProposalDetailByUUID)
router.get('/admin/get-subcategory',authenticateJWT, isEmployee,getSubCategory)
router.get('/admin/get-subcategory-by-uuid/:uuid',authenticateJWT, isEmployee,getSubCategoryByUUID)
router.get('/admin/get-employee',authenticateJWT, isEmployee,getEmployees)
router.get('/admin/get-employee-by-uuid/:uuid',authenticateJWT, isEmployee,getEmployeeBYuuid)


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

