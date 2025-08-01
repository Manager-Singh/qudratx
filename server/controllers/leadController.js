const { Lead, Client, User , Notification } = require('../models');
const { Op, where } = require('sequelize');
const jwt = require('jsonwebtoken');

// CREATE
const createLeadDetail = async (req, res) => {
  try {
    const { client_id } = req.body;

    // Validate required input
    if (!client_id) {
      return res.status(400).json({ message: 'Client ID is required' });
    }

    // Get client from DB
    const client = await Client.findOne({ where: { id: client_id, deleted_at: null } });

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Get last lead to generate lead_number
    const lastLead = await Lead.findOne({
      order: [['id', 'DESC']]
    });

    const nextNumber = lastLead ? lastLead.id + 1 : 1;
    const lead_number = `LEAD_${nextNumber.toString().padStart(4, '0')}`; // e.g., LEAD_0001

    // Create Lead
    const lead = await Lead.create({
      client_id: client.id,
      lead_number,
      origin: 'CRM',
      created_status: req.user.role,
      approval_status: req.user.role === 'admin' ? 'approved' : 'unapproved',
      created_by: req.user.id,
      last_update: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    },{ userId: req.user.id });

     // Reload the lead with its associated client
    const fullLead = await Lead.findOne({
      where: { id: lead.id },
      include: [
        {
          model: Client,
          as: 'Client', // optional alias, use only if you defined one
          attributes: { exclude: ['deleted_at'] } // filter sensitive fields
        }
      ]
    });

    return res.status(201).json({
      message: 'Lead created successfully',
      success: true,
      data: fullLead
    });

  } catch (error) {
    console.error('Create lead error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const assignLead = async (req, res) => {
  try {
    const { lead_id, assigned_to } = req.body;

    // Validate input
    if (!lead_id || !assigned_to) {
      return res.status(400).json({ message: 'lead id and assigned to are required' });
    }

    // Find the lead
    const lead = await Lead.findOne({ where: { id: lead_id, deleted_at: null } });

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    // Update assignment
    lead.assigned_to = assigned_to;
    lead.assigned_by = req.user.id;
    lead.updated_by = req.user.id;
    lead.updated_at = new Date();
    lead.last_update = new Date();

    await lead.save({ userId: req.user.id });

    // Reload the lead with its associated client
    const fullLead = await Lead.findOne({
      where: { id: lead.id },
      include: [
        {
          model: Client,
          as: 'Client', // optional alias, use only if you defined one
          attributes: { exclude: ['deleted_at'] } // filter sensitive fields
        }
      ]
    });

    //Create notification for assigned employee
    await Notification.create({
      user_id: assigned_to,
      created_by: req.user.id,
      type: 'Lead',
      action: 'Assigned',
      related_id: lead.id,
      title: 'Lead Assigned',
      message: `A new lead has been assigned to you by ${req.user.name || 'Admin'}.`,
      is_read: false,
    });

    return res.status(200).json({
      message: 'Lead assigned successfully',
      success: true,
      data: fullLead
    });

  } catch (error) {
    console.error('Assign lead error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


const getLeadDetail = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const status = req.query.status; // optional: 'active' or 'inactive'

    const leadWhere = {
      deleted_at: null,
    };

    if (status === 'active') {
      leadWhere.status = true;
    } else if (status === 'inactive') {
      leadWhere.status = false;
    }

    const { count, rows } = await Lead.findAndCountAll({
      where: leadWhere,
      limit,
      offset,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: Client,
          as: 'Client', // use the correct alias defined in association
          where: {
            email: { [Op.like]: `%${search}%` },
            deleted_at: null
          },
          required: true, // this is important to apply filtering in JOIN
          attributes: { exclude: ['deleted_at'] }
        },
        {
          model: User,
          as: 'assignedBy',
        },
        {
          model: User,
          as: 'assignedTo',
        },
        {
          model: User,
          as: 'createdBy'
        }
      ]
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      message: 'Lead details fetched successfully',
      page,
      limit,
      totalPages,
      totalRecords: count,
      data: rows
    });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// GET ONE
const getLeadDetailByUUID = async (req, res) => {
  try {
    const { uuid } = req.params;

    const lead = await Lead.findOne({ where: { uuid },include: [
        {
          model: Client,
          as: 'Client', // optional alias, use only if you defined one
          attributes: { exclude: ['deleted_at'] } // filter sensitive fields
        },
        {
          model: User,
          as: 'assignedBy',
        },
        {
          model: User,
          as: 'assignedTo',
        },
        {
          model: User,
          as: 'createdBy',
        }
      ] });
    if (!lead) {
      return res.status(404).json({ message: 'lead not found' });
    }

    res.status(200).json({
      message: 'lead fetched successfully',
      success: true,
      data: lead,
    });
  } catch (error) {
    console.error('Get lead error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// UPDATE
const updateLeadDetail = async (req, res) => {
  try {
    const { uuid } = req.params;
    const { name, email, address, phone, company_name, notes, status } = req.body;

    //Validate required fields
    if (!name || !email || !address) {
      return res.status(400).json({ message: 'Name, Email, and Address are required' });
    }

    //Find the client being updated
    const client = await Client.findOne({ where: { uuid } });

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    //Check if email already exists in another client
    const emailExists = await Client.findOne({
      where: {
        email,
        uuid: { [Op.ne]: uuid }, // Exclude current client
        deleted_at: null         // Optional: skip deleted clients
      }
    });

    if (emailExists) {
      return res.status(400).json({ message: 'Email already in use by another client' });
    }

    //Update fields
    client.name = name;
    client.email = email;
    client.address = address;
    if (phone) client.phone = phone;
    if (company_name) client.company_name = company_name;
    if (notes) client.notes = notes;
    if (typeof status === 'boolean') client.status = status;

    client.updated_by = req.user.id;
    client.updated_at = new Date();
    client.last_update = new Date();

    await client.save({ userId: req.user.id });

    res.status(200).json({
      message: 'Client updated successfully',
      success: true,
      data: client
    });

  } catch (error) {
    console.error('Update client error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



// DELETE
const deleteLeadDetail = async (req, res) => {
  try {
    const { uuid } = req.params;

    const lead = await Lead.findOne({ where: { uuid } });
    if (!lead) {
      return res.status(404).json({ message: 'lead not found' });
    }

    await lead.destroy({ userId: req.user.id }); // Soft delete because `paranoid: true`

    res.status(200).json({
      message: 'lead deleted successfully',
      success: true,
      data: { uuid: lead.uuid},
    });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET DELETED LEADS
const getDeletedLeadDetail = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    const { count, rows } = await Lead.findAndCountAll({
      where: {
        deleted_at: { [Op.not]: null },
        email: { [Op.like]: `%${search}%` },
      },
      paranoid: false,
      limit,
      offset,
      order: [['deleted_at', 'DESC']],
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      message: 'Deleted clients fetched successfully',
      page,
      limit,
      totalPages,
      totalRecords: count,
      data: rows,
    });
  } catch (error) {
    console.error('Get deleted client error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getLeadDetailByEmployeeID = async (req, res) => {
  try {
    const userId = req.user.id; // Logged-in employee's ID

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Lead.findAndCountAll({
      where: {
        deleted_at: null,
        assigned_to: userId, // Only get leads assigned to this user
      },
      limit,
      offset,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: Client,
          as: 'Client',
          attributes: { exclude: ['deleted_at'] },
        },
        {
          model: User,
          as: 'assignedBy',
        },
        {
          model: User,
          as: 'assignedTo',
        },
        {
          model: User,
          as: 'createdBy',
        },
      ],
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      message: 'Lead details fetched successfully',
      page,
      limit,
      totalPages,
      totalRecords: count,
      data: rows,
    });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {
  createLeadDetail,
  assignLead,
  getLeadDetail,
  getLeadDetailByUUID,
  updateLeadDetail,
  deleteLeadDetail,
  getDeletedLeadDetail,
  getLeadDetailByEmployeeID,
};
