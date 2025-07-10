const express = require('express');
const router = express.Router();
const { createSubCategory,
  getSubCategory,
  getSubCategoryByUUID,
  getSubCategoryByCategoryId,
  updateSubCategory,
  deleteSubCategory,
  getDeletedSubCategory} = require('../../controllers/subCategoryController');

router.post('/create-subcategory',createSubCategory)
router.get('/get-subcategory',getSubCategory)
router.get('/get-subcategory-by-categoryid/:categoryId',getSubCategoryByCategoryId)
router.get('/get-subcategory-by-uuid/:uuid',getSubCategoryByUUID)
router.put('/update-subcategory/:uuid',updateSubCategory)
router.delete('/delete-subcategory/:uuid',deleteSubCategory)
router.get('/get-deleted-subcategory',getDeletedSubCategory)


module.exports = router;
