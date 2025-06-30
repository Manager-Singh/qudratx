const { BusinessZonesAuthority, BusinessZone } = require('../models');
const { Op } = require('sequelize');

// CREATE
const createBusinessZonesAuthority = async (req, res) => {
  try {
    const { name, zone_id } = req.body;
    if (!name || !zone_id) {
      return res.status(400).json({ message: 'Name and zone_id are required' });
    }

    // Check if zone exists
    const zone = await BusinessZone.findOne({ where: { id: zone_id, deleted_at: null } });
    if (!zone) {
      return res.status(400).json({ message: 'Business zone not found' });
    }

    // Check if authority with same name exists under the same zone
    const existingAuthority = await BusinessZonesAuthority.findOne({
      where: { name, zone_id }
    });
    if (existingAuthority) {
      return res.status(400).json({ message: 'Authority with this name already exists in the specified zone' });
    }

    const authority = await BusinessZonesAuthority.create({
      name,
      zone_id,
      last_update: new Date()
    }, { userId: req.user.id });

    return res.status(201).json({
      message: 'Business zone authority created successfully',
      success: true,
      data: authority,
    });
  } catch (error) {
    console.error('Create authority error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// READ ALL
const getBusinessZonesAuthorities = async (req, res) => {
  try {
    const search = req.query.search || '';

    const where = {
      deleted_at: null,
      name: { [Op.like]: `%${search}%` }
    };

    if (req.query.zone_id) {
      where.zone_id = req.query.zone_id;
    }

    const authorities = await BusinessZonesAuthority.findAll({
      where,
      order: [['created_at', 'DESC']],
      include: [{ model: BusinessZone, as: 'zone', attributes: ['id', 'name', 'uuid'] }]
    });

    res.status(200).json({
      message: 'Business zone authorities fetched successfully',
      totalRecords: authorities.length,
      data: authorities
    });
  } catch (error) {
    console.error('Get authorities error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET ONE by UUID
const getBusinessZonesAuthorityByUUID = async (req, res) => {
  try {
    const { uuid } = req.params;

    const authority = await BusinessZonesAuthority.findOne({
      where: { uuid, deleted_at: null },
      include: [{ model: BusinessZone, as: 'zone', attributes: ['id', 'name', 'uuid'] }]
    });
    if (!authority) {
      return res.status(404).json({ message: 'Business zone authority not found' });
    }

    res.status(200).json({
      message: 'Business zone authority fetched successfully',
      success: true,
      data: authority,
    });
  } catch (error) {
    console.error('Get authority error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// UPDATE
const updateBusinessZonesAuthority = async (req, res) => {
  try {
    const { uuid } = req.params;
    const { name, zone_id } = req.body;

    const authority = await BusinessZonesAuthority.findOne({ where: { uuid, deleted_at: null } });
    if (!authority) {
      return res.status(404).json({ message: 'Business zone authority not found' });
    }

    if (zone_id) {
      const zone = await BusinessZone.findOne({ where: { id: zone_id, deleted_at: null } });
      if (!zone) {
        return res.status(400).json({ message: 'Business zone not found' });
      }
      authority.zone_id = zone_id;
    }

    if (name) authority.name = name;

    authority.updated_at = new Date();
    authority.last_update = new Date();

    await authority.save({ userId: req.user.id });

    res.status(200).json({
      message: 'Business zone authority updated successfully',
      success: true,
      data: authority
    });
  } catch (error) {
    console.error('Update authority error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE (soft delete)
const deleteBusinessZonesAuthority = async (req, res) => {
  try {
    const { uuid } = req.params;

    const authority = await BusinessZonesAuthority.findOne({ where: { uuid, deleted_at: null } });
    if (!authority) {
      return res.status(404).json({ message: 'Business zone authority not found' });
    }

    await authority.destroy({ userId: req.user.id }); // soft delete

    res.status(200).json({
      message: 'Business zone authority deleted successfully',
      success: true,
      data: { uuid: authority.uuid, name: authority.name },
    });
  } catch (error) {
    console.error('Delete authority error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET DELETED 
const getDeletedBusinessZonesAuthorities = async (req, res) => {
  try {
    const search = req.query.search || '';

    const authorities = await BusinessZonesAuthority.findAll({
      where: {
        deleted_at: { [Op.not]: null },
        name: { [Op.like]: `%${search}%` },
      },
      paranoid: false,
      order: [['deleted_at', 'DESC']],
      include: [{ model: BusinessZone, as: 'zone', attributes: ['id', 'name', 'uuid'] }]
    });

    res.status(200).json({
      message: 'Deleted business zone authorities fetched successfully',
      totalRecords: authorities.length,
      data: authorities,
    });
  } catch (error) {
    console.error('Get deleted authorities error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createBusinessZonesAuthority,
  getBusinessZonesAuthorities,
  getBusinessZonesAuthorityByUUID,
  updateBusinessZonesAuthority,
  deleteBusinessZonesAuthority,
  getDeletedBusinessZonesAuthorities,
};
