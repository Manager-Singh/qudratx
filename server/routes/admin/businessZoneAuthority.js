const express = require('express');
const router = express.Router();

const {
  createBusinessZonesAuthority,
  getBusinessZonesAuthorities,
  getBusinessZonesAuthorityByUUID,
  updateBusinessZonesAuthority,
  deleteBusinessZonesAuthority,
  getDeletedBusinessZonesAuthorities
} = require('../../controllers/businessZonesAuthorityController');

// Create authority
router.post('/create-authority', createBusinessZonesAuthority);

// Get all authorities
router.get('/get-authorities', getBusinessZonesAuthorities);

// Get one authority by UUID
router.get('/get-authority-by-uuid/:uuid', getBusinessZonesAuthorityByUUID);

// Update authority by UUID
router.put('/update-authority/:uuid', updateBusinessZonesAuthority);

// Delete (soft delete) authority by UUID
router.delete('/delete-authority/:uuid', deleteBusinessZonesAuthority);

// Get deleted authorities
router.get('/get-deleted-authorities', getDeletedBusinessZonesAuthorities);

module.exports = router;
