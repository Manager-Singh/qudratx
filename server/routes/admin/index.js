const express = require('express');
const router = express.Router();


router.get('/you',async (req,res) => {
    try {
        console.log(req.user,"req")
        res.json({message:"pahuch gyi yha"})
    } catch (error) {
        console.log(error,"admin error")
       return res.json({message:"pahuch gyi yha"})
    }
})

module.exports = router;


// example how to use

// const express = require('express');
// const router = express.Router();

// // Combine admin route files
// router.use('/employee', require('./employee'));   // /api/admin/employee
// router.use('/proposal', require('./proposal'));   // /api/admin/proposal

// module.exports = router;