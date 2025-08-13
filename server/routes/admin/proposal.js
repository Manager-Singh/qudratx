const express = require('express');
const router = express.Router();
const { createProposal,
   getAllProposals,
  getEmployeeProposals,
   updateProposal,
   deleteProposal,
   getUnapprovedProposals,
   approveProposal,
  getProposalByUUID,
  unapproveProposal,
  updateProposalStatus,
  sendProposalEmail,
} = require('../../controllers/proposalController');
const upload = require('../../middlewares/upload');

router.post('/create-proposal',createProposal)
router.get('/get-all-proposals',getAllProposals)
router.get('/get-my-proposals',getEmployeeProposals)
router.get('/get-proposal-by-uuid/:uuid',getProposalByUUID)
router.put('/update-proposal/:uuid', upload.fields([
    { name: 'generated_pdf', maxCount: 1 }
  ]),updateProposal);
router.delete('/delete-proposal/:uuid',deleteProposal);
router.get('/proposals/unapproved', getUnapprovedProposals);
router.put('/proposals/:uuid/approve', approveProposal);
router.put('/proposals/:uuid/unapprove', unapproveProposal);
router.patch('/update-proposal-status/:uuid', updateProposalStatus);
router.post('/send-proposal-email/:uuid', sendProposalEmail);

// router.get('/get-deleted-proposal-detail',getDeletedProposalDetail)


module.exports = router;
