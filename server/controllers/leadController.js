const { Lead, Client, User , Notification } = require('../models');
const { Op, where } = require('sequelize');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const transporter = require('../config/emailConfig');
const { sendEmail } = require("../services/emailService");
// CREATE
const createLeadDetail = async (req, res) => {
  try {
    const { client_id , origin } = req.body;

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
      origin: origin,
      created_status: req.user.role,
      approval_status: req.user.role === 'admin' ? 1 : 2,
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

   

         // If employee created the lead → also send to admin
    if (req.user.role === 'employee') {

       const clientEmail = client?.email;
    const clientName = client?.name;

       await sendEmail({
      to: clientEmail,
      subject: "Welcome Mail",
      templateName: "welcome",
      templateData: {
        title: "Welcome!",
        name: clientName,
        company: "FZCS",
        features: ["24/7 Support", "Premium Tools", "Free Training"],
        year: new Date().getFullYear()
      }
    });
          // const mailOptions = {
          //   from: 'testwebtrack954@gmail.com',
          //   to: clientEmail,
          //   subject: `Welcome Mail`,
          //   text: `Hi ${clientName},\n\nWelcome aboard! We’re excited to have you with us.\n\nRegards,\nYour Company`,
          // };
    
          // transporter.sendMail(mailOptions, (error, info) => {
          //   if (error) {
          //     console.error('Error sending lead email:', error);
          //   } else {
          //     console.log('Lead email sent:', info.response);
          //   }
          // });
      // Get all admin emails
      const admins = await User.findAll({
        where: { role: 'admin', deleted_at: null },
        attributes: ['email', 'name']
      });

      for (const admin of admins) {
        const adminMailOptions = {
          from: 'testwebtrack954@gmail.com',
          to: admin.email,
          subject: `New Lead Created`,
          text: `Hi ${admin.name},\n\nA new lead (${lead_number}) has been created by ${req.user.name}.\n\nRegards,\nYour Company`
        };

        transporter.sendMail(adminMailOptions, (error, info) => {
          if (error) {
            console.error(`Error sending admin email to ${admin.email}:`, error);
          } else {
            console.log(`Admin email sent to ${admin.email}:`, info.response);
          }
        });
      }

         const clientMailOptions = {
          from: 'testwebtrack954@gmail.com',
          to: clientEmail,
          subject: `New Lead Created`,
          text: `Hi ${clientName},\n\nA new lead (${lead_number}) has been created by ${req.user.name}.\n\nRegards,\nYour Company`
        };

        transporter.sendMail(clientMailOptions, (error, info) => {
          if (error) {
            console.error(`Error sending admin email to ${clientEmail}:`, error);
          } else {
            console.log(`Client email sent to ${clientEmail}:`, info.response);
          }
        });
    }

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
      related_id: lead.uuid,
      title: 'Lead Assigned',
      message: `A new lead has been assigned to you by ${req.user.name || 'Admin'}.`,
      is_read: false,
    });

    //Send email to the assigned user
    const assignedUser = await User.findOne({
      where: { id: assigned_to, deleted_at: null },
      attributes: ['name', 'email']
    });

    if (assignedUser && assignedUser.email) {
      const mailOptions = {
        from: 'testwebtrack954@gmail.com',
        to: assignedUser.email,
        subject: `Lead Assigned`,
        text: `Hi ${assignedUser.name},\n\nA lead (${fullLead.lead_number}) has been assigned to you by ${req.user.name || 'Admin'}.\n\nPlease check your dashboard for details.\n\nRegards,\nYour Company`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending assignment email:', error);
        } else {
          console.log('Assignment email sent:', info.response);
        }
      });
    }

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
    const assignedTo = req.query.assigned_to; // user ID or partial name
    const origin = req.query.origin; // exact or partial match
    const leadStatus = req.query.lead_status; // exact or partial match

    const leadWhere = {
      deleted_at: null,
    };

    // Active / inactive filter
    if (status === 'active') {
      leadWhere.status = true;
    } else if (status === 'inactive') {
      leadWhere.status = false;
    }

    // Origin filter
    if (origin) {
      leadWhere.origin = { [Op.like]: `%${origin}%` };
    }

    // Lead status filter
    if (leadStatus) {
      leadWhere.lead_status = { [Op.like]: `%${leadStatus}%` };
    }

    const include = [
      {
        model: Client,
        as: 'Client',
        where: {
          email: { [Op.like]: `%${search}%` },
          deleted_at: null
        },
        required: true,
        attributes: { exclude: ['deleted_at'] }
      },
      {
        model: User,
        as: 'assignedBy',
      },
      {
        model: User,
        as: 'assignedTo',
        where: assignedTo
          ? {
              [Op.or]: [
                { id: assignedTo }, // match exact ID
                { name: { [Op.like]: `%${assignedTo}%` } } // match partial name
              ]
            }
          : undefined
      },
      {
        model: User,
        as: 'createdBy'
      }
    ];

    const { count, rows } = await Lead.findAndCountAll({
      where: leadWhere,
      limit,
      offset,
      order: [['created_at', 'DESC']],
      include
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
    const {
      client_id,
      origin,
      created_status,
      lead_status,
      assigned_to,
      approval_status,
      status
    } = req.body;

    // Find the lead
    const lead = await Lead.findOne({ where: { uuid } });
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    // If client_id provided, check if client exists
    if (client_id) {
      const clientExists = await Client.findOne({ where: { id: client_id, deleted_at: null } });
      if (!clientExists) {
        return res.status(400).json({ message: 'Invalid client ID' });
      }
      lead.client_id = client_id;
    }

    // Update lead fields
    if (origin) lead.origin = origin;
    if (created_status) lead.created_status = created_status;
    if (lead_status) lead.lead_status = lead_status;
    if (typeof assigned_to !== 'undefined') lead.assigned_to = assigned_to;
    if (typeof approval_status !== 'undefined') lead.approval_status = approval_status;
    if (typeof status === 'boolean') lead.status = status;

    // Audit fields
    lead.updated_by = req.user.id;
    lead.updated_at = new Date();
    lead.last_update = new Date();

    await lead.save();

    res.status(200).json({
      message: 'Lead updated successfully',
      success: true,
      data: lead
    });

  } catch (error) {
    console.error('Update lead error:', error);
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

    const { lead_status, origin } = req.query;

    // Build WHERE conditions
    const leadWhere = {
      deleted_at: null,
      [Op.or]: [
        { assigned_to: userId },
        { created_by: userId }
      ]
    };

    if (lead_status) {
      leadWhere.lead_status = { [Op.like]: `%${lead_status}%` };
    }

    if (origin) {
      leadWhere.origin = { [Op.like]: `%${origin}%` };
    }

    const { count, rows } = await Lead.findAndCountAll({
      where: leadWhere,
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

const updateLeadApprovalStatus = async (req, res) => {
  try {
    const { uuid } = req.params;
    const { action, reason } = req.body; // action = 'approve' or 'unapprove'

    // Only admin should be allowed
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admins can update lead approval status.' });
    }

    const lead = await Lead.findOne({ where: { uuid } });

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    if (action === 'approve') {
      if (lead.approval_status === 1) {
        return res.status(400).json({ message: 'Lead is already approved' });
      }

      lead.approval_status = 1; // approved
      lead.reason = null;
      lead.approved_by = req.user.id;
      lead.updated_by = req.user.id;
      lead.updated_at = new Date();
      lead.last_update = new Date();
      await lead.save({ userId: req.user.id });

      if (lead.created_by !== req.user.id) {
        await Notification.create({
          user_id: lead.created_by,
          created_by: req.user.id,
          type: 'Lead',
          action: 'Approved',
          title: 'Lead Approved',
          message: `Your lead (${lead.lead_number}) has been approved by admin.`,
          related_id: uuid,
        });
      }

      return res.status(200).json({
        message: 'Lead approved successfully',
        success: true,
        data: lead
      });

    } else if (action === 'unapprove') {
      if (lead.approval_status === 0) {
        return res.status(400).json({ message: 'Lead is already unapproved' });
      }

      lead.approval_status = 0; // unapproved
      lead.reason = reason || null;
      lead.approved_by = null;
      lead.updated_by = req.user.id;
      lead.updated_at = new Date();
      lead.last_update = new Date();
      await lead.save({ userId: req.user.id });

      if (lead.created_by !== req.user.id) {
        await Notification.create({
          user_id: lead.created_by,
          created_by: req.user.id,
          type: 'Lead',
          action: 'Unapproved',
          title: 'Lead Unapproved',
          message: `Your lead (${lead.lead_number}) has been unapproved by admin.`,
          related_id: uuid,
        });
      }

      return res.status(200).json({
        message: 'Lead unapproved successfully',
        success: true,
        data: lead
      });

    } else {
      return res.status(400).json({ message: 'Invalid action. Use "approve" or "unapprove".' });
    }

  } catch (error) {
    console.error('Error updating lead approval status:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
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
  updateLeadApprovalStatus
};
