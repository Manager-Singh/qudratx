const { Package } = require('../models');
const { Op, where } = require('sequelize');

// CREATE
const createPackage = async (req, res) => {
  try {
    const { name,description, total_amount, status } = req.body;
    if (!name || !total_amount) {
      return res.status(400).json({ message: 'Name and Total Amount are required' });
    }
const existingPackage= await Package.findOne({
  where:{name}
})

if (existingPackage) {
  return res.status(400).json({message:"Package  already exist"})
}
    const package = await Package.create({
      name,
      description,
      total_amount,
      status,
      last_update: new Date(),
    },{ userId: req.user.id });

    return res.status(201).json({
      message: 'Package created successfully',
      success: true,
      data: package,
    });
  } catch (error) {
    console.error('Create package error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// READ ALL
const getPackage = async (req, res) => {
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
    const { count, rows } = await Package.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      message: 'fee structures fetched successfully',
      page,
      limit,
      totalPages,
      totalRecords: count,
      data: rows
    });
  } catch (error) {
    console.error('Get Packages error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET ONE
const getPackageByUUID = async (req, res) => {
  try {
    const { uuid } = req.params;

    const package = await Package.findOne({ where: { uuid } });
    if (!package) {
      return res.status(404).json({ message: 'fee not found' });
    }

    res.status(200).json({
      message: 'Fee fetched successfully',
      success: true,
      data: package,
    });
  } catch (error) {
    console.error('Get package error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// UPDATE
const updatePackage = async (req, res) => {
  try {
    const { uuid } = req.params;
    const { name, description, total_amount, status } = req.body;

    if (!name || !total_amount) {
        return res.status(400).json({ message: 'Name and Total Amount are required' });
      }

    const package = await Package.findOne({ where: { uuid } });
    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }

    package.name = name;
    package.dscription = description;
    package.total_amount = total_amount;
    package.status = status;
    package.updated_by = req.user.id;
    package.updated_at = new Date();
    package.last_update = new Date();

    await package.save({ userId: req.user.id });

    res.status(200).json({
      message: 'Package updated successfully',
      success: true,
      data: package
    });
  } catch (error) {
    console.error('Update package error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE
const deletePackage = async (req, res) => {
  try {
    const { uuid } = req.params;

    const package = await Package.findOne({ where: { uuid } });
    if (!package) {
      return res.status(404).json({ message: 'Fee not found' });
    }

    await package.destroy({ userId: req.user.id }); // Soft delete because `paranoid: true`

    res.status(200).json({
      message: 'Package deleted successfully',
      success: true,
      data: { uuid: package.uuid, name: package.name },
    });
  } catch (error) {
    console.error('Delete package error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET DELETED Package
const getDeletedPackage = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    const { count, rows } = await Package.findAndCountAll({
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
      message: 'Deleted package fetched successfully',
      page,
      limit,
      totalPages,
      totalRecords: count,
      data: rows,
    });
  } catch (error) {
    console.error('Get deleted package error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createPackage,
  getPackage,
  getPackageByUUID,
  updatePackage,
  deletePackage,
  getDeletedPackage,
};
