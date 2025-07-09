const express = require('express');
const router = express.Router();
const upload = require('../../middlewares/upload');
const { createBusinessZone,
  getBusinessZones,
  getBusinessZoneByUUID,
  updateBusinessZone,
  deleteBusinessZone,
  getDeletedBusinessZones} = require('../../controllers/businessZoneController');

router.post('/create-zone',upload.single('image'),createBusinessZone)
router.get('/get-zone',getBusinessZones)
router.get('/get-zone-by-uuid/:uuid',getBusinessZoneByUUID)
router.put('/update-zone/:uuid',upload.single('image'),updateBusinessZone)
router.delete('/delete-zone/:uuid',deleteBusinessZone)
router.get('/get-deleted-zone',getDeletedBusinessZones)


module.exports = router;
