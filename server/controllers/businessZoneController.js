const { BusinessZone } = require('../models');
const { Op, where } = require('sequelize');

// CREATE
const createBusinessZone = async (req, res) => {
  try {
    const { name , status} = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
const existingZone= await BusinessZone.findOne({
  where:{name}
})
if (existingZone) {
  return res.status(400).json({message:"Business zone already exist"})
}
    const zone = await BusinessZone.create({
      name,
      status,
      last_update: new Date(),
    },{ userId: req.user.id });

    return res.status(201).json({
      message: 'Business zone created successfully',
      success: true,
      data: zone,
    });
  } catch (error) {
    console.error('Create zone error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// READ ALL
const getBusinessZones = async (req, res) => {
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
    const { count, rows } = await BusinessZone.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      message: 'Business zones fetched successfully',
      page,
      limit,
      totalPages,
      totalRecords: count,
      data: rows
    });
  } catch (error) {
    console.error('Get zones error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET ONE
const getBusinessZoneByUUID = async (req, res) => {
  try {
    const { uuid } = req.params;

    const zone = await BusinessZone.findOne({ where: { uuid } });
    if (!zone) {
      return res.status(404).json({ message: 'Business zone not found' });
    }

    res.status(200).json({
      message: 'Business zone fetched successfully',
      success: true,
      data: zone,
    });
  } catch (error) {
    console.error('Get zone error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// UPDATE
const updateBusinessZone = async (req, res) => {
  try {
    const { uuid } = req.params;
    const { name,status } = req.body;
    

    if (!name) {
        return res.status(400).json({ message: 'Name is required' });
      }

    const zone = await BusinessZone.findOne({ where: { uuid } });
    if (!zone) {
      return res.status(404).json({ message: 'Business zone not found' });
    }

    zone.name = name;
    if (status) zone.status = status;
    zone.updated_by = req.user.id;
    zone.updated_at = new Date();
    zone.last_update = new Date();

    await zone.save({ userId: req.user.id });

    res.status(200).json({
      message: 'Business zone updated successfully',
      success: true,
      data: zone
    });
  } catch (error) {
    console.error('Update zone error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE
const deleteBusinessZone = async (req, res) => {
  try {
    const { uuid } = req.params;

    const zone = await BusinessZone.findOne({ where: { uuid } });
    if (!zone) {
      return res.status(404).json({ message: 'Business zone not found' });
    }

    await zone.destroy({ userId: req.user.id }); // Soft delete because `paranoid: true`

    res.status(200).json({
      message: 'Business zone deleted successfully',
      success: true,
      data: { uuid: zone.uuid, name: zone.name },
    });
  } catch (error) {
    console.error('Delete zone error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET DELETED ZONES
const getDeletedBusinessZones = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    const { count, rows } = await BusinessZone.findAndCountAll({
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
      message: 'Deleted business zones fetched successfully',
      page,
      limit,
      totalPages,
      totalRecords: count,
      data: rows,
    });
  } catch (error) {
    console.error('Get deleted zones error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createBusinessZone,
  getBusinessZones,
  getBusinessZoneByUUID,
  updateBusinessZone,
  deleteBusinessZone,
  getDeletedBusinessZones,
};
