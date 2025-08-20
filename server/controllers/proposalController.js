const { Proposal, User, Notification, Lead, Client } = require('../models');
const { Op, where } = require('sequelize');
const fs = require('fs');
const path = require('path');
const transporter = require('../config/emailConfig');

// CREATE
const createProposal = async (req, res) => {
  try {
    const {
      lead_id,
      zone_id,
      zone_name,
      zone_info,
      authority_id,
      authority_name,
      authority_info,
      step,
    } = req.body;

    const created_by = req.user.id;
    const isAdmin = req.user.role === 'admin';
    const approval_status = isAdmin ? 1 : 2;

    // Determine prefix based on zone_name
    let prefix = 'GEN'; // Default fallback
    if (zone_name?.toLowerCase() === 'free zone') {
      prefix = 'FZ';
    } else if (zone_name?.toLowerCase() === 'mainland') {
      prefix = 'ML';
    }

    // Get the last proposal with the same prefix
    const lastProposal = await Proposal.findOne({
      where: {
        proposal_number: {
          [Op.like]: `${prefix}_PRO_%`
        }
      },
      order: [['id', 'DESC']]
    });

    const nextNumber = lastProposal
      ? parseInt(lastProposal.proposal_number.split('_').pop()) + 1
      : 1;
    const paddedNumber = nextNumber.toString().padStart(4, '0');
    const proposal_number = `${prefix}_PRO_${paddedNumber}`;

    // Create proposal
    const proposal = await Proposal.create({
      lead_id,
      zone_id,
      zone_name,
      zone_info,
      authority_id,
      authority_name,
      authority_info,
      proposal_number,
      step,
      created_by,
      approval_status,
    }, { userId: req.user.id });
    
    // ✅ Update lead status
  if (lead_id) {
  await Lead.update(
    { lead_status: 'Proposal Created' },
    { where: { id: lead_id } }
  );
}

    return res.status(201).json({
      message: 'Proposal created successfully',
      proposal,
    });
  } catch (error) {
    console.error('Error creating proposal:', error);
    return res.status(500).json({
      message: 'Failed to create proposal',
      error: error.message,
    });
  }
};



// READ ALL
const getAllProposals = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const status = req.query.status; // optional: 'active' or 'inactive'

    const where = {
      deleted_at: null,
      employee_approval: 1, //Only proposals approved by employee
      [Op.or]: [
        { zone_name: { [Op.like]: `%${search}%` } },
        { authority_name: { [Op.like]: `%${search}%` } },
        { package_name: { [Op.like]: `%${search}%` } },
      ]
    };

    // ✅ Filter by status if provided
    if (status === 'active') {
      where.status = true;
    } else if (status === 'inactive') {
      where.status = false;
    }

    const { count, rows } = await Proposal.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: User,
          as: 'creator',
        },
      ],
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      message: 'Proposals fetched successfully',
      success: true,
      page,
      limit,
      totalPages,
      totalRecords: count,
      data: rows,
    });
  } catch (error) {
    console.error('Get proposals error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// const getProposalByAuthorityId = async (req, res) => {
//   try {
//     const { authority_id } = req.params;

//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const offset = (page - 1) * limit;
//     const search = req.query.search || '';
//     const status = req.query.status;

//     const where = {
//       deleted_at: null,
//       authority_id,
//       name: { [Op.like]: `%${search}%` }
//     };

//     if (status === 'active') {
//       where.status = true;
//     } else if (status === 'inactive') {
//       where.status = false;
//     }

//     const { count, rows } = await Proposal.findAndCountAll({
//       where,
//       limit,
//       offset,
//       order: [['created_at', 'DESC']],
//       include: [
//         {
//           model: BusinessZonesAuthority,
//           as: 'authority',
//           include: [
//             {
//               model: BusinessZone,
//               as: 'zone',
//             }
//           ]
//         }
//       ]
//     });

//     const totalPages = Math.ceil(count / limit);

//     res.status(200).json({
//       message: 'Proposals fetched successfully by authority ID',
//       page,
//       limit,
//       totalPages,
//       totalRecords: count,
//       data: rows
//     });
//   } catch (error) {
//     console.error('Get Proposals by authority error:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };


// // GET ONE
// const getProposalByUUID = async (req, res) => {
//   try {
//     const { uuid } = req.params;

//     const package = await Proposal.findOne({ where: { uuid },include: [
//         {
//           model: BusinessZonesAuthority,
//           as: 'authority',
//           include: [
//             {
//               model: BusinessZone,
//               as: 'zone',
//             }
//           ]
//         }
//       ] });
//     if (!package) {
//       return res.status(404).json({ message: 'fee not found' });
//     }

//     res.status(200).json({
//       message: 'Proposal fetched successfully',
//       success: true,
//       data: package,
//     });
//   } catch (error) {
//     console.error('Get Proposal error:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// // UPDATE
const updateProposal = async (req, res) => {
  try {
    const { uuid } = req.params;
    const {
      client_id,
      client_info,
      zone_id,
      zone_name,
      zone_info,
      authority_id,
      authority_name,
      authority_info,
      package_id,
      package_name,
      package_info,
      business_activities,
      total_amount,
      business_questions,
      what_to_include,
      required_documents,
      benefits,
      other_benefits,
      scope_of_work,
      notes,
      status,
      proposal_status,
      step,
      approved_by: bodyApprovedBy,
      employee_approval,
      approval_status,
    } = req.body;

    const isAdmin = req.user.role === 'admin';

    if (!uuid) {
      return res.status(400).json({ message: 'Proposal UUID is required' });
    }

    const proposal = await Proposal.findOne({ where: { uuid } });

    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    // ❌ Block update if proposal_status is already finalized (1)
    if (proposal.proposal_status === 1) {
      return res.status(403).json({ message: 'Proposal has already been finalized and cannot be updated.' });
    }

    // ✅ Proceed with update
    proposal.client_id = client_id || proposal.client_id;
    proposal.client_info = client_info || proposal.client_info;
    proposal.zone_id = zone_id || proposal.zone_id;
    proposal.zone_name = zone_name || proposal.zone_name;
    proposal.zone_info = zone_info || proposal.zone_info;
    proposal.authority_id = authority_id || proposal.authority_id;
    proposal.authority_name = authority_name || proposal.authority_name;
    proposal.authority_info = authority_info || proposal.authority_info;
    proposal.package_id = package_id || proposal.package_id;
    proposal.package_name = package_name || proposal.package_name;
    proposal.package_info = package_info || proposal.package_info;
    proposal.business_activities = business_activities || proposal.business_activities;
    proposal.total_amount = total_amount || proposal.total_amount;
    proposal.business_questions = business_questions || proposal.business_questions;
    proposal.what_to_include = what_to_include || proposal.what_to_include;
    proposal.required_documents = required_documents || proposal.required_documents;
    proposal.benefits = benefits || proposal.benefits;
    proposal.other_benefits = other_benefits || proposal.other_benefits;
    proposal.scope_of_work = scope_of_work || proposal.scope_of_work;
    proposal.notes = notes || proposal.notes;
     if (req.user.role === 'admin') {
      proposal.employee_approval = 1;
    } else {
      // Use provided value or keep existing
      proposal.employee_approval = employee_approval ?? proposal.employee_approval;
    }

    if (proposal.step !== 'last_step') {
      proposal.step = step || proposal.step;
    }

    proposal.status = typeof status === 'boolean' ? status : proposal.status;
    proposal.proposal_status = typeof proposal_status === 'boolean' ? proposal_status : proposal.proposal_status;
  if (step === 'last_step') {
  const isAdmin = req.user.role === 'admin';

  if (!isAdmin) {
    const admins = await User.findAll({ where: { role: 'admin' } });

    for (const admin of admins) {
      await Notification.create({
        user_id: admin.id,
        created_by: req.user.id, // the one who triggered the action
        type: 'Proposal',
        title: 'Proposal for Approval',
        action: 'proposal_for_approval',
        message: `${req.user.name} sent a proposal (${proposal.proposal_number}) for approval.`,
        related_id: uuid,
      });
    }
  }
}

    // Handle generated PDF if any
    if (req.files && req.files.generated_pdf && proposal.proposal_number) {
      const file = req.files.generated_pdf[0];
      const ext = path.extname(file.originalname) || '.pdf';
      const newFilename = `${proposal.proposal_number}${ext}`;
      const newPath = path.join('uploads/proposals', newFilename);

      fs.renameSync(file.path, newPath);
      proposal.generated_pdf = newFilename;
      proposal.pdf_path = newPath;
    }

    proposal.updated_by = req.user.id;
    proposal.updated_at = new Date();
    proposal.last_update = new Date();

    // Approval logic
    // if (req.user.role === 'admin') {
    //   proposal.approval_status = 1;
    //   proposal.approved_by = req.user.id;
    // } else {
      proposal.approval_status = approval_status || proposal.approval_status;
      proposal.approved_by = bodyApprovedBy || proposal.approved_by;
    //}

    await proposal.save({ userId: req.user.id });

    // Send email if proposal PDF was updated
    // if (proposal.generated_pdf && proposal.pdf_path) {
    //   const clientEmail = client_info?.email || proposal.client_info?.email;

    //   const mailOptions = {
    //     from: 'testwebtrack954@gmail.com',
    //     to: clientEmail,
    //     subject: `Proposal ${proposal.proposal_number} Updated`,
    //     text: `Dear client,\n\nPlease find the updated proposal attached.\n\nRegards,\nYour Company`,
    //     attachments: [
    //       {
    //         filename: proposal.generated_pdf,
    //         path: proposal.pdf_path
    //       }
    //     ]
    //   };

    //   transporter.sendMail(mailOptions, (error, info) => {
    //     if (error) {
    //       console.error('Error sending proposal email:', error);
    //     } else {
    //       console.log('Proposal email sent:', info.response);
    //     }
    //   });
    // }

    return res.status(200).json({
      message: 'Proposal updated successfully',
      success: true,
      data: proposal
    });
  } catch (error) {
    console.error('Update proposal error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};




// // DELETE
const deleteProposal = async (req, res) => {
  try {
    const { uuid } = req.params;

    const proposal = await Proposal.findOne({ where: { uuid } });
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    // Soft delete the proposal
    await proposal.destroy({ userId: req.user.id }); // paranoid: true

    // Also soft delete all notifications related to this proposal
    await Notification.destroy({
      where: {
        type: 'Proposal',
        related_id: proposal.uuid // assuming notifications store proposal.id
      },
      individualHooks: true, // so paranoid works if enabled
      userId: req.user.id
    });

    res.status(200).json({
      message: 'Proposal and related notifications deleted successfully',
      success: true,
      data: { uuid: proposal.uuid },
    });
  } catch (error) {
    console.error('Delete proposal error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getEmployeeProposals = async (req, res) => {
  try {
    const employeeId = req.user.id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const search = req.query.search ? req.query.search.trim().toLowerCase() : "";

    // Base filter: proposals created by this employee
    const whereClause = { created_by: employeeId };

    // Build includes
    const include = [
      {
        model: User,
        as: "creator",
        attributes: ["id", "name", "email"],
      },
      {
        model: Client,
        as: "client",
        attributes: ["id", "name"],
        required: false, // LEFT JOIN so proposals without clients are still returned
      },
    ];

    if (search) {
      if (search === "draft") {
        whereClause.employee_approval = 0;
      } else if (search === "unapproved") {
        whereClause.approval_status = 0;
      } else if (search === "approved") {
        whereClause.approval_status = 1;
      } else if (search === "pending") {
        whereClause.approval_status = 2;
      } else {
        // Normal text search across Proposal + Client
        whereClause[Op.or] = [
          { zone_name: { [Op.like]: `%${search}%` } },
          { authority_name: { [Op.like]: `%${search}%` } },
          { package_name: { [Op.like]: `%${search}%` } },
          { proposal_number: { [Op.like]: `%${search}%` } },
          { "$client.name$": { [Op.like]: `%${search}%` } }, // 👈 works with include alias
        ];
      }
    }

    const { rows: proposals, count: totalRecords } =
      await Proposal.findAndCountAll({
        where: whereClause,
        include,
        limit,
        offset,
        order: [["created_at", "DESC"]],
        distinct: true, // needed to fix count with JOINs
      });

    const totalPages = Math.ceil(totalRecords / limit);

    return res.status(200).json({
      message: "Proposals fetched successfully",
      success: true,
      page,
      limit,
      totalPages,
      totalRecords,
      data: proposals,
    });
  } catch (error) {
    console.error("Error fetching employee proposals:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};


// const getEmployeeProposals = async (req, res) => {
//   try {
//     const employeeId = req.user.id;

//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const offset = (page - 1) * limit;

//     const search = req.query.search ? req.query.search.trim().toLowerCase() : "";

//     // Base filter: proposals created by this employee
//     const whereClause = { created_by: employeeId };

//     // Build includes
//     const include = [
//       {
//         model: User,
//         as: "creator",
//         attributes: ["id", "name", "email"], // adjust as needed
//       },
//       {
//         model: Client,
//         as: "client", // matches Proposal.belongsTo(Client, { as: "client" })
//         attributes: ["id", "name"],
//         required: false,
//       },
//     ];

//     if (search) {
//       if (search === "draft") {
//         // Special case: drafts
//         whereClause.employee_approval = 0;
//       } else if (search === "unapproved") {
//         whereClause.approval_status = 0;
//       } else if (search === "approved") {
//         whereClause.approval_status = 1;
//       } else if (search === "pending") {
//         whereClause.approval_status = 2;
//       } else {
//         // Normal text search
//         whereClause[Op.or] = [
//           { zone_name: { [Op.like]: `%${search}%` } },
//           { authority_name: { [Op.like]: `%${search}%` } },
//           { package_name: { [Op.like]: `%${search}%` } },
//           { proposal_number: { [Op.like]: `%${search}%` } },
//         ];

//         // Add search on client name
//         include[1].where = {
//           name: { [Op.like]: `%${search}%` },
//         };
//         include[1].required = false;
//       }
//     }

//     const { rows: proposals, count: totalRecords } =
//       await Proposal.findAndCountAll({
//         where: whereClause,
//         include,
//         limit,
//         offset,
//         order: [["created_at", "DESC"]],
//         distinct: true,
//       });

//     const totalPages = Math.ceil(totalRecords / limit);

//     return res.status(200).json({
//       message: "Proposals fetched successfully",
//       success: true,
//       page,
//       limit,
//       totalPages,
//       totalRecords,
//       data: proposals,
//     });
//   } catch (error) {
//     console.error("Error fetching employee proposals:", error);
//     return res.status(500).json({
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };


// // GET DELETED Package
// const getDeletedProposal = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const offset = (page - 1) * limit;
//     const search = req.query.search || '';

//     const { count, rows } = await Proposal.findAndCountAll({
//       where: {
//         deleted_at: { [Op.not]: null },
//         name: { [Op.like]: `%${search}%` },
//       },
//       paranoid: false,
//       limit,
//       offset,
//       order: [['deleted_at', 'DESC']],
//     });

//     const totalPages = Math.ceil(count / limit);

//     res.status(200).json({
//       message: 'Deleted proposal fetched successfully',
//       page,
//       limit,
//       totalPages,
//       totalRecords: count,
//       data: rows,
//     });
//   } catch (error) {
//     console.error('Get deleted proposal error:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

const getUnapprovedProposals = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    const whereClause = {
      approval_status: 0 // unapproved
    };

    // Optional search by fields like client name, zone name, etc.
    if (search) {
      whereClause[Op.or] = [
        { client_name: { [Op.like]: `%${search}%` } },
        { zone_name: { [Op.like]: `%${search}%` } },
        { authority_name: { [Op.like]: `%${search}%` } },
        { package_name: { [Op.like]: `%${search}%` } }
      ];
    }

    const { rows: proposals, count: totalRecords } = await Proposal.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });

    const totalPages = Math.ceil(totalRecords / limit);

    return res.status(200).json({
      message: 'Unapproved proposals fetched successfully',
      success: true,
      page,
      limit,
      totalPages,
      totalRecords,
      data: proposals,
    });
  } catch (error) {
    console.error('Error fetching unapproved proposals:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

const approveProposal = async (req, res) => {
  try {
    const { uuid } = req.params;

    // Only admin should be allowed to approve
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admins can approve proposals.' });
    }

    const proposal = await Proposal.findOne({ where: { uuid }, include: [{ model: User, as: 'creator', attributes: ['id', 'name', 'email'] }] });

    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    // Already approved
    if (proposal.approval_status === 1) {
      return res.status(400).json({ message: 'Proposal is already approved' });
    }

    proposal.approval_status = 1; // 1 means approved
    proposal.approved_by = req.user.id;
    proposal.updated_by = req.user.id;
    proposal.updated_at = new Date();
    proposal.last_update = new Date();

    await proposal.save({ userId: req.user.id });

    if (proposal.created_by !== req.user.id) {
      await Notification.create({
        user_id: proposal.created_by,
        created_by: req.user.id,
        type: 'Proposal',
         action: 'Approved',
         title: 'Proposal Approved',
        message: `Your proposal (${proposal.proposal_number}) has been approved by admin.`,
        related_id: uuid,
      });

      // Send email to the creator
      if (proposal.creator?.email) {
             const mailOptions = {
            from: 'testwebtrack954@gmail.com',
            to: proposal.creator.email,
            subject: `Your Proposal Has Been Approved`,
            text: `Hi ${proposal.creator.name || 'User'},\n\nYour proposal (${proposal.proposal_number}) has been approved by admin.\n\nRegards,\nYour Company`,
          };
    
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error('Error sending lead email:', error);
            } else {
              console.log('Lead email sent:', info.response);
            }
          });
      }
    }

    return res.status(200).json({
      message: 'Proposal approved successfully',
      success: true,
      data: proposal
    });
  } catch (error) {
    console.error('Error approving proposal:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

const unapproveProposal = async (req, res) => {
  try {
    const { uuid } = req.params;
      const {
      reason,
    } = req.body;

    // Only admin should be allowed to unapprove
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admins can unapprove proposals.' });
    }

    const proposal = await Proposal.findOne({ where: { uuid }, include: [{ model: User, as: 'creator', attributes: ['id', 'name', 'email'] }] });

    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    // Already unapproved
    if (proposal.approval_status === 0) {
      return res.status(400).json({ message: 'Proposal is already unapproved' });
    }

    proposal.approval_status = 0; // 0 means unapproved
    proposal.reason = reason;
    proposal.approved_by = null; // Reset approved_by
    proposal.updated_by = req.user.id;
    proposal.updated_at = new Date();
    proposal.last_update = new Date();

    await proposal.save({ userId: req.user.id });

      if (proposal.created_by !== req.user.id) {
      await Notification.create({
        user_id: proposal.created_by,
        created_by: req.user.id,
        type: 'Proposal',
        title: 'Proposal Unapproved',
        action:'Unapproved',
        message: `Your proposal (${proposal.proposal_number}) has been unapproved by admin.`,
        related_id: uuid,
      });

            // Send email to the creator
      if (proposal.creator?.email) {
             const mailOptions = {
            from: 'testwebtrack954@gmail.com',
            to: proposal.creator.email,
            subject: `Your Proposal Has Been Unapproved`,
            text: `Hi ${proposal.creator.name || 'User'},\n\nYour proposal (${proposal.proposal_number}) has been unapproved by admin.\n\nRegards,\nYour Company`,
          };
    
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error('Error sending lead email:', error);
            } else {
              console.log('Lead email sent:', info.response);
            }
          });
      }
    }
    return res.status(200).json({
      message: 'Proposal unapproved successfully',
      success: true,
      data: proposal
    });
  } catch (error) {
    console.error('Error unapproving proposal:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};


// GET ONE
const getProposalByUUID = async (req, res) => {
  try {
    const { uuid } = req.params;

    const proposal = await Proposal.findOne({ where: { uuid },include: [
        {
          model: User,
          as: 'creator',
        },
        {
          model: Lead,
          as: 'lead', // ensure you have association Proposal.belongsTo(Lead, { as: 'lead', foreignKey: 'lead_id' })
          include: [
            {
              model: Client,
              as: 'Client',
              attributes: { exclude: ['deleted_at'] }
            }
          ]
        }
  ], });
    if (!proposal) {
      return res.status(404).json({ message: 'proposal not found' });
    }

    res.status(200).json({
      message: 'Proposal fetched successfully',
      success: true,
      data: proposal,
    });
  } catch (error) {
    console.error('Get proposal error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateProposalStatus = async (req, res) => {
  try {
    const { uuid } = req.params;
    const { proposal_status } = req.body;

    // Ensure admin only can update
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Only admins can update the proposal status.',
        success: false
      });
    }

    if (!uuid || !proposal_status) {
      return res.status(400).json({
        message: 'Proposal UUID and new status are required.',
        success: false
      });
    }

    const proposal = await Proposal.findOne({ where: { uuid } });

    if (!proposal) {
      return res.status(404).json({
        message: 'Proposal not found.',
        success: false
      });
    }

    proposal.proposal_status = proposal_status;
    proposal.updated_at = new Date();
    proposal.updated_by = req.user.id;

    await proposal.save({ userId: req.user.id });

    // Notify created_by if it's not an admin (assuming you can check role)
    if (proposal.created_by !== req.user.id) {
      const creator = await User.findOne({ where: { id: proposal.created_by } });
      if (creator?.role !== 'admin') {
        await Notification.create({
          user_id: proposal.created_by,
          created_by: req.user.id,
          type: 'Proposal',
           title: 'Proposal Status Update',
           action: 'Status Updated',
          message: `Proposal status updated to "${proposal_status}" by admin.`,
          related_id: uuid,
        });
      }
    }

    return res.status(200).json({
      message: 'Proposal status updated successfully.',
      success: true,
      data: proposal
    });
  } catch (error) {
    console.error('Error updating proposal status:', error);
    return res.status(500).json({
      message: 'Internal server error.',
      success: false
    });
  }
};

const sendProposalEmail = async (req, res) => {
  try {
    const { uuid } = req.params; // Proposal UUID from params
   const client_email = req.body?.client_email || req.query?.client_email;

    // Fetch proposal with client details
    const proposal = await Proposal.findOne({
      where: { uuid: uuid }
    });

    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }
const clientInfo = typeof proposal.client_info === 'string'
  ? JSON.parse(proposal.client_info)
  : proposal.client_info;
    // Decide recipient email
    const recipientEmail = client_email || clientInfo?.email;

    if (!recipientEmail) {
      return res.status(400).json({ message: 'No email provided and no client email found in proposal' });
    }

     const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipientEmail,
        subject: `Proposal ${proposal.proposal_number}`,
        text: `Hello,\n\nHere is your proposal (${proposal.proposal_number}).\n\nRegards,\nYour Company`,
        attachments: [
          {
            filename: proposal.generated_pdf,
            path: proposal.pdf_path
          }
        ]
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending lead email:', error);
        } else {
          console.log('Lead email sent:', info.response);
        }
      });

    return res.status(200).json({
      message: `Email sent successfully to ${recipientEmail}`,
      success: true
    });

  } catch (error) {
    console.error('Error sending proposal email:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {
  createProposal,
   getAllProposals,
   getEmployeeProposals,
   getUnapprovedProposals,
   approveProposal,
   getProposalByUUID,
//   getProposalByAuthorityId,
 updateProposal,
  deleteProposal,
  unapproveProposal,
  updateProposalStatus,
  sendProposalEmail,
//   getDeletedProposal,
};
