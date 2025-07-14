const express = require('express');
const router = express.Router();
const { createPackage,
  getPackage,
  getPackageByAuthorityId,
  getPackageByUUID,
  updatePackage,
  deletePackage,
  getDeletedPackage} = require('../../controllers/packageController');

router.post('/create-package',createPackage)
router.get('/get-package',getPackage)
router.get('/get-package-by-uuid/:uuid',getPackageByUUID)
router.get('/get-package-by-authority-id/:authority_id',getPackageByAuthorityId)
router.put('/update-package/:uuid',updatePackage)
router.delete('/delete-package/:uuid',deletePackage)
router.get('/get-deleted-package',getDeletedPackage)


module.exports = router;
