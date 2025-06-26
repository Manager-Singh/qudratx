const express = require('express');
const router = express.Router();
const {verfyUser} = require('../../controllers/userController')

router.get('/verify',verfyUser)



module.exports = router;