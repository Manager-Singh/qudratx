const express = require('express');
const router = express.Router();
const { createProposal,
  // getProposalDetail,
  // getProposalDetailByUUID,
  // updateProposalDetail,
  // deleteProposalDetail,
  // getDeletedProposalDetail
} = require('../../controllers/proposalController');

router.post('/create-proposal',createProposal)
// router.get('/get-proposal-detail',getProposalDetail)
// router.get('/get-proposal-detail-by-uuid/:uuid',getProposalDetailByUUID)
// router.put('/update-proposal-detail/:uuid',updateProposalDetail)
// router.delete('/delete-proposal-detail/:uuid',deleteProposalDetail)
// router.get('/get-deleted-proposal-detail',getDeletedProposalDetail)


module.exports = router;
