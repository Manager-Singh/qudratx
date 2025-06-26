const express = require('express');
const router = express.Router();
const {createEmployee,getEmployees,deleteEmployee,getDeletedEmployees} = require('../../controllers/userController');



router.post('/create-employee',createEmployee)
router.get('/get-employee',getEmployees)
router.delete('/delete-employee/:id',deleteEmployee)
router.get('/deleted-employee',getDeletedEmployees)

module.exports = router;
