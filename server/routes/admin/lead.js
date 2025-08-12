const express = require('express');
const router = express.Router();
const { createLeadDetail,
  assignLead,
  getLeadDetail,
  getLeadDetailByUUID,
  updateLeadDetail,
  deleteLeadDetail,
  getDeletedLeadDetail,
getLeadDetailByEmployeeID,
approveLead,
unapproveLead} = require('../../controllers/leadController');

router.post('/create-lead',createLeadDetail)
router.put('/assign-lead',assignLead)
router.get('/get-lead-detail',getLeadDetail)
router.get('/get-lead-detail-by-uuid/:uuid',getLeadDetailByUUID)
router.get('/get-lead-detail-by-employeeId',getLeadDetailByEmployeeID)
router.put('/update-lead-detail/:uuid',updateLeadDetail)
router.delete('/delete-lead-detail/:uuid',deleteLeadDetail)
router.get('/get-deleted-lead-detail',getDeletedLeadDetail)
router.put('/leads/:uuid/approve', approveLead);
router.put('/leads/:uuid/unapprove', unapproveLead);


module.exports = router;
