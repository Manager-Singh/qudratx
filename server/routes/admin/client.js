const express = require('express');
const router = express.Router();
const { createClientDetail,
  getClientDetail,
  getClientDetailByUUID,
  updateClientDetail,
  deleteClientDetail,
  getDeletedClientDetail} = require('../../controllers/clientController');

router.post('/create-client-detail',createClientDetail)
router.get('/get-client-detail',getClientDetail)
router.get('/get-client-detail-by-uuid/:uuid',getClientDetailByUUID)
router.put('/update-client-detail/:uuid',updateClientDetail)
router.delete('/delete-client-detail/:uuid',deleteClientDetail)
router.get('/get-deleted-client-detail',getDeletedClientDetail)


module.exports = router;
