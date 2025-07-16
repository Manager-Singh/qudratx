const express = require('express');
const router = express.Router();
const upload = require('../../middlewares/upload');
const { createAndUpdateCompany } = require('../../controllers/companyController');

router.all('/web-setting-info',upload.fields([{ name: 'logo' }, { name: 'icon' }]),createAndUpdateCompany)



module.exports = router;
