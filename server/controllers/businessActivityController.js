const { BusinessActivity } = require('../models');
const { Op, where } = require('sequelize');

// CREATE
const createBusinessActivity = async (req, res) => {
  try {
    const {
      zone,
      activity_name,
      activity_name_arabic,
      status,
      minimum_share_capital,
      license_type,
      is_not_allowed_for_coworking_esr,
      is_special,
      activity_price,
      activity_group,
      description,
      qualification_requirement,
      documents_required,
      category,
      additional_approval,
      sub_category,
      group_id,
      third_party,
      when,
      esr,
      notes
    } = req.body;

    // Validate required field
    if (!activity_name) {
      return res.status(400).json({ message: 'Activity Name is required' });
    }

    // Check if activity already exists
    const existingActivity = await BusinessActivity.findOne({
      where: { activity_name }
    });

    if (existingActivity) {
      return res.status(400).json({ message: 'Business Activity already exists' });
    }
    const activity_master_number = await generateActivityNumber(); 
    const activity_code = await generateActivityCode(); 
    // Create activity
    const activity = await BusinessActivity.create({
      activity_master_number,
      zone,
      activity_code,
      activity_name,
      activity_name_arabic,
      status: status !== undefined ? status : true,
      minimum_share_capital,
      license_type,
      is_not_allowed_for_coworking_esr,
      is_special,
      activity_price,
      activity_group,
      description,
      qualification_requirement,
      documents_required,
      category,
      additional_approval,
      sub_category,
      group_id,
      third_party,
      when,
      esr,
      notes,
      last_update: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
      created_by: req.user?.id || null,
      updated_by: req.user?.id || null
    });

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

const generateActivityCode = async () => {
  const lastRecord = await BusinessActivity.findOne({
    order: [['createdAt', 'DESC']]
  });

  let lastNumber = 0;

  if (lastRecord && lastRecord.activity_code) {
    lastNumber = parseInt(lastRecord.activity_code, 10);
  }

  const newCode = String(lastNumber + 1).padStart(5, '0'); // e.g., "00001"
  return newCode;
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

const generateActivityNumber = async () => {
  const prefix = "AM-";
  let unique = false;
  let activityNumber;

  while (!unique) {
    const randomNum = Math.floor(10000 + Math.random() * 90000); // 5-digit number
    activityNumber = `${prefix}${randomNum}`;

    const exists = await BusinessActivity.findOne({
      where: { activity_number: activityNumber }
    });

    if (!exists) unique = true;
  }

  return activityNumber;
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
    activity.status = status;
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
