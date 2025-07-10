const express = require('express');
const router = express.Router();
const upload = require('../../middlewares/upload');
const { createBusinessActivity,
  getBusinessActivity,
  getBusinessActivityByUUID,
  updateBusinessActivity,
  deleteBusinessActivity,
  getDeletedBusinessActivity} = require('../../controllers/businessActivityController');

router.post('/create-activity',upload.single('file'),createBusinessActivity)
router.get('/get-activity',getBusinessActivity)
router.get('/get-activity-by-uuid/:uuid',getBusinessActivityByUUID)
router.put('/update-activity/:uuid',updateBusinessActivity)
router.delete('/delete-activity/:uuid',deleteBusinessActivity)
router.get('/get-deleted-activity',getDeletedBusinessActivity)


module.exports = router;
