const express = require('express');
const router = express.Router();
const { createBusinessActivity,
  getBusinessActivity,
  getBusinessActivityByUUID,
  updateBusinessActivity,
  deleteBusinessActivity,
  getDeletedBusinessActivity} = require('../../controllers/businessActivityController');

router.post('/create-activity',createBusinessActivity)
router.get('/get-activity',getBusinessActivity)
router.get('/get-activity-by-uuid/:uuid',getBusinessActivityByUUID)
router.put('/update-activity/:uuid',updateBusinessActivity)
router.delete('/delete-activity/:uuid',deleteBusinessActivity)
router.get('/get-deleted-activity',getDeletedBusinessActivity)


module.exports = router;
