const express = require('express');
const router = express.Router();
const { getAllLeadsCount,
    getAllProposalsCount,
    getAllUsersCount,
    getEmployeeCount,
    getClientCount
 } = require('../../controllers/dashboardController');

router.get('/get-leads-count',getAllLeadsCount)
router.get('/proposal-count', getAllProposalsCount);
router.get('/user-count', getAllUsersCount);
router.get('/employee-count', getEmployeeCount);
router.get('/client-count', getClientCount);

module.exports = router;
