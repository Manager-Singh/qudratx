const { BusinessActivity,BusinessZone, BusinessZonesAuthority } = require('../models');
const { Op, where } = require('sequelize');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const xlsx = require('xlsx');
// CREATE
const createBusinessActivity = async (req, res) => {
  try {

    if (req.file) {
      const results = [];
      const errors = [];
      const filePath = path.resolve(req.file.path);

      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => results.push(row))
        .on('end', async () => {
          for (const [index, row] of results.entries()) {
            try {
              const existing = await BusinessActivity.findOne({ where: { activity_name: row["Activity Name"]  } });
              if (existing) {
                errors.push({ row: index + 1, message: 'Duplicate activity name' });
                continue;
              }

            const existingZone = await BusinessZone.findOne({ where: { name : row["Zone"]  } });
              if (!existingZone) {
               return res.status(400).json({ message: 'Zone does not exist' });
              }

              const activity = await BusinessActivity.create({
                authority_id: req.body.authority_id,
                activity_master_number: row["Activity Master: Activity Master Number"],
                activity_code: row["Activity Code"],
                zone: existingZone.id,
                activity_name: row["Activity Name"] ,
                activity_name_arabic: row["Activity Name (Arabic)"] ,
                status: row["Status"]  !== undefined ? row["Status"]  : true,
                minimum_share_capital: row["Minimum Share Capital"] ,
                license_type: row["License Type"] ,
                is_not_allowed_for_coworking_esr: row["Is Not Allowed for Coworking(ESR)"] ,
                is_special: row["Is Special"] ,
                activity_price: row["Activity Price"] ,
                activity_group: row["Activity Group"] ,
                description: row["Description"] ,
                qualification_requirement: row["Qualification Requirement"] ,
                documents_required: row["Documents Required"] ,
                category: row["Category"] || row["Price Category"]  ,
                additional_approval: row["Additional Approval"] ,
                sub_category: row["Sub Category"],
                group_id: row["Group"] ,
                third_party: row["Third Party"] ,
                when: row["When"] ,
                esr: row["ESR"] ,
                notes: row["Notes"] ,
                updated_by: req.user?.id || null,
                created_at: new Date(),
                updated_at: new Date(),
                last_update: new Date()
              });
            } catch (err) {
              errors.push({ row: index + 1, message: err.message });
            }
          }

          return res.status(200).json({
            message: 'CSV import completed',
            success: true,
            imported: results.length - errors.length,
            failed: errors.length,
            errors
          });
        });
    }

    else {
      const {
        authority_id,
        activity_master_number,
        activity_code,
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

      if (!activity_name) {
        return res.status(400).json({ message: 'Activity Name is required' });
      }

      const existingActivity = await BusinessActivity.findOne({ where: { activity_name } });
      if (existingActivity) {
        return res.status(400).json({ message: 'Business Activity already exists' });
      }

      const activity = await BusinessActivity.create({
        authority_id,
        activity_master_number,
        activity_code,
        zone,
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
        updated_by: req.user?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
        last_update: new Date()
      });

       const fullActivity = await BusinessActivity.findOne({
      where: { id: activity.id },
      include: [
        {
          model: BusinessZonesAuthority,
          as: 'authority',
          attributes: ['id', 'name', 'uuid'],
          include: [
            {
              model: BusinessZone,
              as: 'zone',
              attributes: ['id', 'name', 'uuid'],
            }
          ]
        }
      ]
    });

      return res.status(201).json({
        message: 'Business activity created successfully',
        success: true,
        data: fullActivity
      });
    }
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
      activity_name: { [Op.like]: `%${search}%` }
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
      order: [['created_at', 'DESC']],
       include: [
        {
          model: BusinessZonesAuthority,
          as: 'authority',
          attributes: ['id', 'name', 'uuid'],
          include: [
            {
              model: BusinessZone,
              as: 'zone',
              attributes: ['id', 'name', 'uuid'],
            }
          ]
        }
      ]
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

    const activity = await BusinessActivity.findOne({ where: { uuid },
    include: [
        {
          model: BusinessZonesAuthority,
          as: 'authority',
          attributes: ['id', 'name', 'uuid'],
          include: [
            {
              model: BusinessZone,
              as: 'zone',
              attributes: ['id', 'name', 'uuid'],
            }
          ]
        }
      ]
     });
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
const getBusinessActivityByAuthorityId = async (req, res) => {
  try {
    const { authority_id } = req.params;

    const activity = await BusinessActivity.findAll({ where: { authority_id },
    include: [
        {
          model: BusinessZonesAuthority,
          as: 'authority',
          attributes: ['id', 'name', 'uuid'],
          include: [
            {
              model: BusinessZone,
              as: 'zone',
              attributes: ['id', 'name', 'uuid'],
            }
          ]
        }
      ]
     });
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
  getBusinessActivityByAuthorityId,
};
