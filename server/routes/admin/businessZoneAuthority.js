const express = require('express');
const router = express.Router();
const upload = require('../../middlewares/upload');
const {
  createBusinessZonesAuthority,
  getBusinessZonesAuthorities,
  getBusinessZonesAuthorityByZoneId,
  getBusinessZonesAuthorityById,
  updateBusinessZonesAuthority,
  deleteBusinessZonesAuthority,
  getDeletedBusinessZonesAuthorities,
  getBusinessZonesAuthorityByUUID
} = require('../../controllers/businessZoneAuthorityController');

// Create authority
router.post('/create-authority',upload.single('image'), createBusinessZonesAuthority);

// Get all authorities
router.get('/get-authorities', getBusinessZonesAuthorities);

// Get one authority by UUID
router.get('/get-authority-by-zone/:id', getBusinessZonesAuthorityByZoneId);
router.get('/get-authority-by-id/:authority_id', getBusinessZonesAuthorityById);
router.get('/get-authority-by-uuid/:uuid', getBusinessZonesAuthorityByUUID);
// Update authority by UUID
router.put('/update-authority/:uuid',upload.single('image'), updateBusinessZonesAuthority);

// Delete (soft delete) authority by UUID
router.delete('/delete-authority/:uuid', deleteBusinessZonesAuthority);

// Get deleted authorities
router.get('/get-deleted-authorities', getDeletedBusinessZonesAuthorities);

module.exports = router;
