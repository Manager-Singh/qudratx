const express = require('express');
const router = express.Router();
const { createBusinessZone,
  getBusinessZones,
  getBusinessZoneByUUID,
  updateBusinessZone,
  deleteBusinessZone,
  getDeletedBusinessZones} = require('../../controllers/businessZoneController');

router.post('/create-zone',createBusinessZone)
router.get('/get-zone',getBusinessZones)
router.get('/get-zone-by-uuid',getBusinessZoneByUUID)
router.put('/update-zone/:uuid',updateBusinessZone)
router.delete('/delete-zone/:uuid',deleteBusinessZone)
router.get('/get-deleted-zone',getDeletedBusinessZones)


module.exports = router;
