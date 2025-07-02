const express = require('express');
const router = express.Router();
const { createFeeStructure,
  getFeeStructure,
  getFeeStructureByUUID,
  updateFeeStructure,
  deleteFeeStructure,
  getDeletedFeeStructure} = require('../../controllers/feeStructureController');

router.post('/create-fee-structure',createFeeStructure)
router.get('/get-fee-structure',getFeeStructure)
router.get('/get-fee-structure-by-uuid/:uuid',getFeeStructureByUUID)
router.put('/update-fee-structure/:uuid',updateFeeStructure)
router.delete('/delete-fee-structure/:uuid',deleteFeeStructure)
router.get('/get-deleted-fee-structure',getDeletedFeeStructure)


module.exports = router;
