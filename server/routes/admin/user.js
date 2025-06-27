const express = require('express');
const router = express.Router();
const {createEmployee,getEmployees,deleteEmployee,getDeletedEmployees,updateEmployee,getEmployeeBYuuid} = require('../../controllers/userController');



router.post('/create-employee',createEmployee)
router.get('/get-employee',getEmployees)
router.delete('/delete-employee/:uuid',deleteEmployee)
router.get('/deleted-employee',getDeletedEmployees)
router.put('/update-employee/:uuid',updateEmployee)
router.get('/get-employee-by-uuid/:uuid',getEmployeeBYuuid)
module.exports = router;
