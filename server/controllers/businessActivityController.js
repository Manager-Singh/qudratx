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
              const existing = await BusinessActivity.findOne({ where: { authority_id: req.body.authority_id,activity_name: row["Activity Name"]  } });
              if (existing) {
                errors.push({ row: index + 1, message: 'Duplicate activity name' });
                continue;
              }

            // const existingZone = await BusinessZone.findOne({ where: { name : row["Zone"]  } });
            //   if (!existingZone) {
            //    return res.status(400).json({ message: 'Zone does not exist' });
            //   }

              const activity = await BusinessActivity.create({
                authority_id: req.body.authority_id,
                activity_master_number: row["Activity Master: Activity Master Number"],
                activity_code: row["Activity Code"],
                // zone: existingZone.id,
                activity_name: row["Activity Name"] ,
                activity_name_arabic: row["Activity Name (Arabic)"] ,
                // status: row["Status"]  !== undefined ? row["Status"]  : 1,
                minimum_share_capital: row["Minimum Share Capital"] ,
                license_type: row["License Type"] ,
                is_not_allowed_for_coworking_esr: row["Is Not Allowed for Coworking(ESR)"] ,
                is_special: parseInt(row["Is Special"]),
                activity_price: row["Activity Price"] ,
                activity_group: row["Activity Group"] ,
                description: row["Descri)ption"] ,
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
        // zone,
        activity_name,
        activity_name_arabic,
        // status,
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

      if (!activity_name || !authority_id || !activity_code ) {
        return res.status(400).json({ message: 'Activity Name, Authority Id and Activity code are required' });
      }

      const existingActivity = await BusinessActivity.findOne({
                                      where: {
                                        deleted_at: null,
                                        [Op.or]: [
                                          {
                                            activity_name,
                                            activity_code,
                                            authority_id
                                          },
                                          {
                                            activity_master_number
                                          }
                                        ]
                                      }
                                    });
      if (existingActivity) {
        return res.status(400).json({ message: 'Business Activity already exists' });
      }

      const activity = await BusinessActivity.create({
        authority_id,
        activity_master_number,
        activity_code,
        // zone,
        activity_name,
        activity_name_arabic,
        // status: status !== undefined ? status : 1,
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
          include: [
            {
              model: BusinessZone,
              as: 'zone',
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

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const status = req.query.status; // optional

    const where = {
      authority_id,
      deleted_at: null,
    };

    // Add search on activity_name
    if (search) {
      where.activity_name = { [Op.like]: `%${search}%` };
    }

    // Filter by status
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

    if (!rows.length) {
      return res.status(404).json({ message: 'No business activities found' });
    }

    return res.status(200).json({
      message: 'Business activities fetched successfully',
      page,
      limit,
      totalPages,
      totalRecords: count,
      data: rows,
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
    const {
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
      return res.status(400).json({ message: 'Activity name is required' });
    }

    const activity = await BusinessActivity.findOne({ where: { uuid } });

    if (!activity) {
      return res.status(404).json({ message: 'Business activity not found' });
    }

    // Optional: check for duplicate activity_name within the same authority
    const duplicate = await BusinessActivity.findOne({
      where: {
        uuid: { [Op.ne]: uuid },
        activity_name,
        authority_id: activity.authority_id,
        deleted_at: null
      }
    });

    if (duplicate) {
      return res.status(400).json({ message: 'Another activity with this name already exists' });
    }

    // Update fields
    activity.activity_name = activity_name;
    activity.activity_name_arabic = activity_name_arabic;
    activity.status = status;
    activity.minimum_share_capital = minimum_share_capital;
    activity.license_type = license_type;
    activity.is_not_allowed_for_coworking_esr = is_not_allowed_for_coworking_esr;
    activity.is_special = is_special;
    activity.activity_price = activity_price;
    activity.activity_group = activity_group;
    activity.description = description;
    activity.qualification_requirement = qualification_requirement;
    activity.documents_required = documents_required;
    activity.category = category;
    activity.additional_approval = additional_approval;
    activity.sub_category = sub_category;
    activity.group_id = group_id;
    activity.third_party = third_party;
    activity.when = when;
    activity.esr = esr;
    activity.notes = notes;

    // Audit fields
    activity.updated_by = req.user.id;
    activity.updated_at = new Date();
    activity.last_update = new Date();

    await activity.save();

    return res.status(200).json({
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

const searchBusinessActivities = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const search = req.query.search || '';
    const status = req.query.status; // 'active' | 'inactive'
    const authority_id = req.query.authority_id;
    const zone_id = req.query.zone_id;

    const where = {
      deleted_at: null,
      [Op.or]: [
        { activity_name: { [Op.like]: `%${search}%` } },
        { activity_name_arabic: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { activity_code: { [Op.like]: `%${search}%` } },
        { activity_master_number: { [Op.like]: `%${search}%` } }
      ]
    };

    if (status === 'active') {
      where.status = true;
    } else if (status === 'inactive') {
      where.status = false;
    }

    if (authority_id) {
      where.authority_id = authority_id;
    }

    if (zone_id) {
      where.zone = zone_id;
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
              attributes: ['id', 'name', 'uuid']
            }
          ]
        }
      ]
    });

    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
      message: 'Business activities fetched successfully',
      page,
      limit,
      totalPages,
      totalRecords: count,
      data: rows
    });
  } catch (error) {
    console.error('Search BusinessActivity error:', error);
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
  searchBusinessActivities
};
