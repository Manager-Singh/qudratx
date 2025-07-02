const { BusinessActivity } = require('../models');
const { Op, where } = require('sequelize');

// CREATE
const createBusinessActivity = async (req, res) => {
  try {
    const { name,status } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
const existingActivity= await BusinessActivity.findOne({
  where:{name}
})

if (existingActivity) {
  return res.status(400).json({message:"Business Activity already exist"})
}
    const activity = await BusinessActivity.create({
      name,
      status,
      last_update: new Date(),
    },{ userId: req.user.id });

    return res.status(201).json({
      message: 'Business activity created successfully',
      success: true,
      data: activity,
    });
  } catch (error) {
    console.error('Create activity error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// READ ALL
const getBusinessActivity = async (req, res) => {
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

    const { count, rows } = await BusinessActivity.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      message: 'Business activities fetched successfully',
      page,
      limit,
      totalPages,
      totalRecords: count,
      data: rows
    });
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET ONE
const getBusinessActivityByUUID = async (req, res) => {
  try {
    const { uuid } = req.params;

    const activity = await BusinessActivity.findOne({ where: { uuid } });
    if (!activity) {
      return res.status(404).json({ message: 'Business activity not found' });
    }

    res.status(200).json({
      message: 'Business activity fetched successfully',
      success: true,
      data: activity,
    });
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// UPDATE
const updateBusinessActivity = async (req, res) => {
  try {
    const { uuid } = req.params;
    const { name,status } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Name is required' });
      }

    const activity = await BusinessActivity.findOne({ where: { uuid } });
    if (!activity) {
      return res.status(404).json({ message: 'Business activity not found' });
    }

    activity.name = name;
    if (status) activity.status = status;
    activity.updated_by = req.user.id;
    activity.updated_at = new Date();
    activity.last_update = new Date();

    await activity.save({ userId: req.user.id });

    res.status(200).json({
      message: 'Business activity updated successfully',
      success: true,
      data: activity
    });
  } catch (error) {
    console.error('Update activity error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE
const deleteBusinessActivity = async (req, res) => {
  try {
    const { uuid } = req.params;

    const activity = await BusinessActivity.findOne({ where: { uuid } });
    if (!activity) {
      return res.status(404).json({ message: 'Business activity not found' });
    }

    await activity.destroy({ userId: req.user.id }); // Soft delete because `paranoid: true`

    res.status(200).json({
      message: 'Business activity deleted successfully',
      success: true,
      data: { uuid: activity.uuid, name: activity.name },
    });
  } catch (error) {
    console.error('Delete activity error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET DELETED ACTIVITIES
const getDeletedBusinessActivity = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    const { count, rows } = await BusinessActivity.findAndCountAll({
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
      message: 'Deleted business activities fetched successfully',
      page,
      limit,
      totalPages,
      totalRecords: count,
      data: rows,
    });
  } catch (error) {
    console.error('Get deleted activity error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createBusinessActivity,
  getBusinessActivity,
  getBusinessActivityByUUID,
  updateBusinessActivity,
  deleteBusinessActivity,
  getDeletedBusinessActivity,
};
