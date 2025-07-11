const { Subcategory, Category } = require('../models');
const { Op, where } = require('sequelize');

// CREATE
const createSubCategory = async (req, res) => {
  try {
    const { name , category_id, status} = req.body;
    if (!name || !category_id) {
      return res.status(400).json({ message: 'Name and Category id are required' });
    }
const existingCat = await Subcategory.findOne({
  where:{name}
})
if (existingCat) {
  return res.status(400).json({message:"Subcategory already exist"})
}
    const subcategory = await Subcategory.create({
      name,
      category_id,
      status,
      last_update: new Date(),
    },{ userId: req.user.id });
    
    const fullSub = await Subcategory.findOne({
      where: { id: subcategory.id },
      include: [
          {
            model: Category,
            as: 'category', // <== required because of the alias
            attributes: ['id', 'name']
          }
        ]
    });
    return res.status(201).json({
      message: 'Subcategory created successfully',
      success: true,
      data: fullSub,
    });
  } catch (error) {
    console.error('Create Subcategory error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// READ ALL
const getSubCategory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const status = req.query.status; // optional: 'active' or 'inactive'
    
    const where = {
      deleted_at: null,
      name: { [Op.like]: `%${search}%` }
    };

    // filter by status if provided
    if (status === 'active') {
      where.status = true;
    } else if (status === 'inactive') {
      where.status = false;
    }

    const { count, rows } = await Subcategory.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']],
      include: [
          {
            model: Category,
            as: 'category', // <== required because of the alias
            attributes: ['id', 'name']
          }
        ]
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      message: 'Subcategories fetched successfully',
      page,
      limit,
      totalPages,
      totalRecords: count,
      data: rows
    });
  } catch (error) {
    console.error('Get subcategories error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getSubCategoryByCategoryId = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    if (!categoryId) {
      return res.status(400).json({ message: 'Category ID is required' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const status = req.query.status; // optional

    const where = {
      category_id: categoryId,
      deleted_at: null,
      name: { [Op.like]: `%${search}%` },
    };

    if (status === 'active') {
      where.status = true;
    } else if (status === 'inactive') {
      where.status = false;
    }

    const { count, rows } = await Subcategory.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']],
      include: [
          {
            model: Category,
            as: 'category', // <== required because of the alias
            attributes: ['id', 'name']
          }
        ]
    });

    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
      message: 'Subcategories fetched successfully',
      page,
      limit,
      totalPages,
      totalRecords: count,
      data: rows,
    });
  } catch (error) {
    console.error('Error fetching subcategories by category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// GET ONE
const getSubCategoryByUUID = async (req, res) => {
  try {
    const { uuid } = req.params;

    const sub = await Subcategory.findOne({ where: { uuid } });
    if (!sub) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    res.status(200).json({
      message: 'Subcategory fetched successfully',
      success: true,
      data: sub,
    });
  } catch (error) {
    console.error('Get subcat error:', error);
    res.status(500).json({ message:error });
  }
};

// UPDATE
const updateSubCategory = async (req, res) => {
  try {
    const { uuid } = req.params;
    const { name,category_id,status } = req.body;

    if (!name || !category_id) {
        return res.status(400).json({ message: 'Name and category id are  required' });
      }

    const subcat = await Subcategory.findOne({ where: { uuid } });
    if (!subcat) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    subcat.name = name;
    subcat.category_id = category_id;
    subcat.status = status;
    subcat.updated_by = req.user.id;
    subcat.updated_at = new Date();
    subcat.last_update = new Date();

    await subcat.save({ userId: req.user.id });

    res.status(200).json({
      message: 'Sucategory updated successfully',
      success: true,
      data: subcat
    });
  } catch (error) {
    console.error('Update subcat error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE
const deleteSubCategory = async (req, res) => {
  try {
    const { uuid } = req.params;

    const subcat = await Subcategory.findOne({ where: { uuid } });
    if (!subcat) {
      return res.status(404).json({ message: 'Sub category not found' });
    }

    await subcat.destroy({ userId: req.user.id }); // Soft delete because `paranoid: true`

    res.status(200).json({
      message: 'subcategory deleted successfully',
      success: true,
      data: { uuid: subcat.uuid, name: subcat.name },
    });
  } catch (error) {
    console.error('Delete subcat error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET DELETED ACTIVITIES
const getDeletedSubCategory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    const { count, rows } = await Subcategory.findAndCountAll({
      where: {
        deleted_at: { [Op.not]: null },
        name: { [Op.like]: `%${search}%` },
      },
      paranoid: false,
      limit,
      offset,
      order: [['deleted_at', 'DESC']],
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      message: 'Deleted subcategories fetched successfully',
      page,
      limit,
      totalPages,
      totalRecords: count,
      data: rows,
    });
  } catch (error) {
    console.error('Get deleted subcat error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createSubCategory,
  getSubCategory,
  getSubCategoryByUUID,
  getSubCategoryByCategoryId,
  updateSubCategory,
  deleteSubCategory,
  getDeletedSubCategory,
};
