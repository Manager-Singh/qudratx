const { Category } = require('../models');
const { Op, where } = require('sequelize');

// CREATE
const createCategory = async (req, res) => {
  try {
    const { name , status} = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
const existingCat = await Category.findOne({
  where:{name}
})
if (existingCat) {
  return res.status(400).json({message:"Category already exist"})
}
    const category = await Category.create({
      name,
      status,
      last_update: new Date(),
    },{ userId: req.user.id });

    return res.status(201).json({
      message: 'Category created successfully',
      success: true,
      data: category,
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// READ ALL
const getCategory = async (req, res) => {
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

    const { count, rows } = await Category.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      message: 'Categories fetched successfully',
      page,
      limit,
      totalPages,
      totalRecords: count,
      data: rows
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET ONE
const getCategoryByUUID = async (req, res) => {
  try {
    const { uuid } = req.params;

    const cat = await Category.findOne({ where: { uuid } });
    if (!cat) {
      return res.status(404).json({ message: 'category not found' });
    }

    res.status(200).json({
      message: 'category fetched successfully',
      success: true,
      data: cat,
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// UPDATE
const updateCategory = async (req, res) => {
  try {
    const { uuid } = req.params;
    const { name,status } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Name is required' });
      }

    const cat = await Category.findOne({ where: { uuid } });
    if (!cat) {
      return res.status(404).json({ message: 'Category not found' });
    }

    cat.name = name;
    cat.status = status;
    cat.updated_by = req.user.id;
    cat.updated_at = new Date();
    cat.last_update = new Date();

    await cat.save({ userId: req.user.id });

    res.status(200).json({
      message: 'category updated successfully',
      success: true,
      data: cat
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE
const deleteCategory = async (req, res) => {
  try {
    const { uuid } = req.params;

    const cat = await Category.findOne({ where: { uuid } });
    if (!cat) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await cat.destroy({ userId: req.user.id }); // Soft delete because `paranoid: true`

    res.status(200).json({
      message: 'category deleted successfully',
      success: true,
      data: { uuid: cat.uuid, name: cat.name },
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET DELETED ACTIVITIES
const getDeletedCategory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    const { count, rows } = await Category.findAndCountAll({
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
      message: 'Deleted categories fetched successfully',
      page,
      limit,
      totalPages,
      totalRecords: count,
      data: rows,
    });
  } catch (error) {
    console.error('Get deleted categories error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createCategory,
  getCategory,
  getCategoryByUUID,
  updateCategory,
  deleteCategory,
  getDeletedCategory,
};
