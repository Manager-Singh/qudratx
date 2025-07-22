const express = require('express');
const router = express.Router();
const { createProposal,
   getAllProposals,
  getEmployeeProposals,
   updateProposal,
   deleteProposal,
   getUnapprovedProposals,
  // getDeletedProposalDetail
} = require('../../controllers/proposalController');

router.post('/create-proposal',createProposal)
router.get('/get-all-proposals',getAllProposals)
router.get('/get-my-proposals',getEmployeeProposals)
// router.get('/get-proposal-detail-by-uuid/:uuid',getProposalDetailByUUID)
router.put('/update-proposal/:uuid',updateProposal)
router.delete('/delete-proposal/:uuid',deleteProposal)
router.get('/proposals/unapproved', getUnapprovedProposals);
// router.get('/get-deleted-proposal-detail',getDeletedProposalDetail)


module.exports = router;
