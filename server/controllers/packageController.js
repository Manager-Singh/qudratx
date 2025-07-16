const { Package,BusinessZonesAuthority,BusinessZone } = require('../models');
const { Op, where } = require('sequelize');

// CREATE
const createPackage = async (req, res) => {
  try {
    const { name,description, total_amount, status, subtotal,discount,fee_structure, tax,authority_id, activity } = req.body;
    if (!name || !total_amount || !subtotal || !fee_structure || !authority_id || !activity) {
      return res.status(400).json({ message: 'Name, Fee structure, Subtotal, Authority Id, Activity and Total Amount are required' });
    }
const existingPackage= await Package.findOne({
  where:{name,authority_id}
})

if (existingPackage) {
  return res.status(400).json({message:"Package already exist"})
}
    const package = await Package.create({
      name,
      description,
      total_amount,
      status,
      subtotal,
      discount,
      fee_structure,
      tax,
      authority_id,
      activity,
      last_update: new Date(),
    },{ userId: req.user.id });
     const fullPack = await Package.findOne({
      where: { id: package.id },
     include: [
        {
          model: BusinessZonesAuthority,
          as: 'authority',
          include: [
            {
              model: BusinessZone,
              as: 'zone',
            }
          ]
        }
      ]
    });

    return res.status(201).json({
      message: 'Package created successfully',
      success: true,
      data: fullPack,
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
      order: [['created_at', 'DESC']],
      include: [
        {
          model: BusinessZonesAuthority,
          as: 'authority',
          include: [
            {
              model: BusinessZone,
              as: 'zone',
            }
          ]
        }
      ]
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      message: 'packages fetched successfully',
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

const getPackageByAuthorityId = async (req, res) => {
  try {
    const { authority_id } = req.params;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const status = req.query.status;

    const where = {
      deleted_at: null,
      authority_id,
      name: { [Op.like]: `%${search}%` }
    };

    if (status === 'active') {
      where.status = true;
    } else if (status === 'inactive') {
      where.status = false;
    }

    const { count, rows } = await Package.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: BusinessZonesAuthority,
          as: 'authority',
          include: [
            {
              model: BusinessZone,
              as: 'zone',
            }
          ]
        }
      ]
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      message: 'Packages fetched successfully by authority ID',
      page,
      limit,
      totalPages,
      totalRecords: count,
      data: rows
    });
  } catch (error) {
    console.error('Get Packages by authority error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// GET ONE
const getPackageByUUID = async (req, res) => {
  try {
    const { uuid } = req.params;

    const package = await Package.findOne({ where: { uuid },include: [
        {
          model: BusinessZonesAuthority,
          as: 'authority',
          include: [
            {
              model: BusinessZone,
              as: 'zone',
            }
          ]
        }
      ] });
    if (!package) {
      return res.status(404).json({ message: 'fee not found' });
    }

    res.status(200).json({
      message: 'Package fetched successfully',
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
     const { name,description, total_amount, status, subtotal,discount,fee_structure, tax, authority_id, activity } = req.body;

    if (!name || !total_amount || !subtotal || !fee_structure || !authority_id || !activity) {
      return res.status(400).json({ message: 'Name, Fee structure, Subtotal, Authority Id, Activity and Total Amount are required' });
    }

    const package = await Package.findOne({ where: { uuid } });
    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }

    package.name = name;
    package.dscription = description;
    package.total_amount = total_amount;
    package.status = status;
    package.subtotal = subtotal;
    package.fee_structure = fee_structure;
    package.authority_id = authority_id;
    package.activity = activity;
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
      return res.status(404).json({ message: 'Package not found' });
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
  getPackageByAuthorityId,
  updatePackage,
  deletePackage,
  getDeletedPackage,
};
