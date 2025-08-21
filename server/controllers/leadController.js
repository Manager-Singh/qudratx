const { Lead, Client, User , Notification } = require('../models');
const { Op, where, col } = require('sequelize');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const transporter = require('../config/emailConfig');
const { sendEmail } = require("../services/emailService");
// CREATE
const createLeadDetail = async (req, res) => {
  try {
    const { client_id, origin } = req.body;

    if (!client_id) {
      return res.status(400).json({ message: "Client ID is required" });
    }

    const client = await Client.findOne({
      where: { id: client_id, deleted_at: null },
    });

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Get last lead to generate lead_number
    const lastLead = await Lead.findOne({ order: [["id", "DESC"]] });
    const nextNumber = lastLead ? lastLead.id + 1 : 1;
    const lead_number = `LEAD_${nextNumber.toString().padStart(4, "0")}`;

    // Create Lead
    const lead = await Lead.create(
      {
        client_id: client.id,
        lead_number,
        origin,
        created_status: req.user.role,
        approval_status: req.user.role === "admin" ? 1 : 2,
        created_by: req.user.id,
        last_update: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      },
      { userId: req.user.id }
    );

    // Reload with client
    const fullLead = await Lead.findOne({
      where: { id: lead.id },
      include: [
        {
          model: Client,
          as: "Client",
          attributes: { exclude: ["deleted_at"] },
        },
      ],
    });

    // Respond immediately ✅
    res.status(201).json({
      message: "Lead created successfully",
      success: true,
      data: fullLead,
    });

    // ---- Async background tasks (don’t block response) ----
    (async () => {
      try {
        if (req.user.role === "employee") {
          const clientEmail = client?.email;
          const clientName = client?.name;

          if (clientEmail) {
            // Welcome email
            sendEmail({
              to: clientEmail,
              subject: "Welcome Mail",
              templateName: "welcome",
              templateData: {
                title: "Welcome!",
                name: clientName,
                company: "FZCS",
                features: ["24/7 Support", "Premium Tools", "Free Training"],
                year: new Date().getFullYear(),
              },
            });

            // New lead email to client
            sendEmail({
              to: clientEmail,
              subject: "New Lead Created",
              templateName: "newlead",
              templateData: {
                title: "New Lead",
                name: clientName,
                lead_number,
                created_by: req.user.name,
                company: "FZCS",
              },
            });
          }

          // Get admins
          const admins = await User.findAll({
            where: { role: "admin", deleted_at: null },
            attributes: ["id", "email", "name"],
          });

          // Send emails + notifications in parallel
          await Promise.all(
            admins.map(async (admin) => {
              if (admin.email) {
                sendEmail({
                  to: admin.email,
                  subject: "New Lead Created",
                  templateName: "admin_newlead",
                  templateData: {
                    title: "New Lead",
                    name: admin.name,
                    lead_number,
                    created_by: req.user.name,
                    company: "FZCS",
                  },
                });
              }

              await Notification.create({
                user_id: admin.id,
                created_by: req.user.id,
                type: "Lead",
                action: "Lead Created",
                title: "New Lead Created",
                related_id: lead.uuid,
                message: `A new lead (${lead.lead_number}) was created by ${req.user.name}`,
                is_read: false,
              });
            })
          );
        }
      } catch (asyncErr) {
        console.error("Background task failed:", asyncErr);
      }
    })();
  } catch (error) {
    console.error("Create lead error:", error);
    return res.status(500).json({ message: "Internal server error" });
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
      await sendEmail({
                  to: assignedUser.email,
                  subject: "Lead Assigned",
                  templateName: "newlead",
                  templateData: {
                    title: "Lead Assigned",
                    name: assignedUser.name,
                    lead_number: fullLead.lead_number,
                    created_by:req.user.name || 'Admin',
                    company:"FZCS"
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

    const search = req.query.search ? req.query.search.trim().toLowerCase() : "";
    const status = req.query.status; // 'active' | 'inactive'
    const assignedTo = req.query.assigned_to; // user ID or partial name
    const origin = req.query.origin; // string
    const leadStatus = req.query.lead_status; // string

    const leadWhere = {
      deleted_at: null,
    };

    // Active / inactive filter
    if (status === "active") {
      leadWhere.status = true;
    } else if (status === "inactive") {
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

    // Handle search query
    if (search) {
      if (search === "unapproved") {
        leadWhere.approval_status = 0;
      } else if (search === "approved") {
        leadWhere.approval_status = 1;
      } else if (search === "pending") {
        leadWhere.approval_status = 2;
      } else {
        // Free-text search across multiple fields
        leadWhere[Op.or] = [
          { lead_number: { [Op.like]: `%${search}%` } },
          { "$Client.name$": { [Op.like]: `%${search}%` } },
           { "$createdBy.name$": { [Op.like]: `%${search}%` } },
        ];
      }
    }

    const include = [
      {
        model: Client,
        as: "Client",
        where: { deleted_at: null },
        required: false, // keep LEFT JOIN so leads without clients still appear
        attributes: { exclude: ["deleted_at"] },
      },
      {
        model: User,
        as: "assignedBy",
      },
      {
        model: User,
        as: "assignedTo",
        where: assignedTo
          ? {
              [Op.or]: [
                { id: assignedTo }, // exact ID match
                { name: { [Op.like]: `%${assignedTo}%` } }, // partial name match
              ],
            }
          : undefined,
      },
      {
        model: User,
        as: "createdBy", // ✅ needed for search on created_by
      },
    ];

    const { count, rows } = await Lead.findAndCountAll({
      where: leadWhere,
      limit,
      offset,
      order: [["created_at", "DESC"]],
      include,
      distinct: true, // avoid duplicates when joins exist
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      message: "Lead details fetched successfully",
      success: true,
      page,
      limit,
      totalPages,
      totalRecords: count,
      data: rows,
    });
  } catch (error) {
    console.error("Get leads error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
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
      return res.status(404).json({ message: 'Lead not found' });
    }

    // Soft delete the lead
    await lead.destroy({ userId: req.user.id });

    // Also soft delete all notifications related to this lead
    await Notification.destroy({
      where: {
        type: 'Lead',
        related_id: lead.uuid 
      },
      individualHooks: true, // so `paranoid: true` works if you have hooks
      userId: req.user.id
    });

    res.status(200).json({
      message: 'Lead and related notifications deleted successfully',
      success: true,
      data: { uuid: lead.uuid },
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

    const search = req.query.search ? req.query.search.trim().toLowerCase() : "";
    const { lead_status, origin } = req.query;

    // Base WHERE conditions
    const leadWhere = {
      deleted_at: null,
      [Op.or]: [
        { assigned_to: userId },
        { created_by: userId }
      ]
    };

    // Lead status filter
    if (lead_status) {
      leadWhere.lead_status = { [Op.like]: `%${lead_status}%` };
    }

    // Origin filter
    if (origin) {
      leadWhere.origin = { [Op.like]: `%${origin}%` };
    }

    // Search filter
    if (search) {
      if (search === "unapproved") {
        leadWhere.approval_status = 0;
      } else if (search === "approved") {
        leadWhere.approval_status = 1;
      } else if (search === "pending") {
        leadWhere.approval_status = 2;
      } else {
        leadWhere[Op.or] = [
          { assigned_to: userId },
          { created_by: userId },
          { lead_number: { [Op.like]: `%${search}%` } },
           { "$Client.name$": { [Op.like]: `%${search}%` } },
        ];
      }
    }

    const { count, rows } = await Lead.findAndCountAll({
      where: leadWhere,
      limit,
      offset,
      order: [["created_at", "DESC"]],
      include: [
        {
          model: Client,
          as: "Client",
          attributes: { exclude: ["deleted_at"] },
        },
        {
          model: User,
          as: "assignedBy",
        },
        {
          model: User,
          as: "assignedTo",
        },
        {
          model: User,
          as: "createdBy",
        },
      ],
      distinct: true, // avoid duplicate rows due to JOIN
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      message: "Lead details fetched successfully",
      page,
      limit,
      totalPages,
      totalRecords: count,
      data: rows,
    });
  } catch (error) {
    console.error("Get leads error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
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
