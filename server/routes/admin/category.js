const express = require('express');
const router = express.Router();
const { createCategory,
  getCategory,
  getCategoryByUUID,
  updateCategory,
  deleteCategory,
  getDeletedCategory} = require('../../controllers/categoryController');

router.post('/create-category',createCategory)
router.get('/get-category',getCategory)
router.get('/get-category-by-uuid/:uuid',getCategoryByUUID)
router.put('/update-category/:uuid',updateCategory)
router.delete('/delete-category/:uuid',deleteCategory)
router.get('/get-deleted-category',getDeletedCategory)


module.exports = router;
