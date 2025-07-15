const express = require('express');
const router = express.Router();
const upload = require('../../middlewares/upload');
const { createAndUpdateCompany } = require('../../controllers/companyController');

router.post('/create-or-update-company-info',upload.fields([{ name: 'logo' }, { name: 'icon' }]),createAndUpdateCompany)


module.exports = router;
