const { Proposal } = require('../models');
const { Op, where } = require('sequelize');

// CREATE
const createProposal = async (req, res) => {
  try {
    const {
      client_id,
      client_info,
      lead_id,
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
      updated_by,
      last_update,
      approved_by, // comes from body
    } = req.body;

    const created_by = req.user.id;
    const approval_status = req.user.role === 'admin' ? 1 : 0;

    const proposal = await Proposal.create({
      client_id,
      client_info,
      lead_id,
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
      updated_by,
      last_update,
      created_by,
      approval_status,
      approved_by: approval_status === 1 ? created_by : approved_by || null,
    });

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
      client_name: { [Op.like]: `%${search}%` } ,
      zone_name: { [Op.like]: `%${search}%` } ,
      authority_name: { [Op.like]: `%${search}%` },
      package_name: { [Op.like]: `%${search}%` }
    };
// filter by status if provided
    if (status === 'active') {
      where.status = true;
    } else if (status === 'inactive') {
      where.status = false;
    }
    const { count, rows } = await Proposal.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      message: 'proposals fetched successfully',
      page,
      limit,
      totalPages,
      totalRecords: count,
      data: rows
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
      approved_by: bodyApprovedBy
    } = req.body;

    if (!uuid) {
      return res.status(400).json({ message: 'Proposal UUID is required' });
    }

    const proposal = await Proposal.findOne({ where: { uuid } });

    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    // Update fields based on your model
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

    proposal.status = typeof status === 'boolean' ? status : proposal.status;
    proposal.proposal_status = typeof proposal_status === 'boolean' ? proposal_status : proposal.proposal_status;

    proposal.updated_by = req.user.id;
    proposal.updated_at = new Date();
    proposal.last_update = new Date();

    // Approval logic
    if (req.user.role === 'admin') {
      proposal.approval_status = 1;
      proposal.approved_by = req.user.id;
    } else {
      // Keep existing values unless provided
      proposal.approval_status = proposal.approval_status ?? 0;
      proposal.approved_by = bodyApprovedBy || proposal.approved_by;
    }

    await proposal.save();

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
      return res.status(404).json({ message: 'proposal not found' });
    }

    await proposal.destroy({ userId: req.user.id }); // Soft delete because `paranoid: true`

    res.status(200).json({
      message: 'Proposal deleted successfully',
      success: true,
      data: { uuid: proposal.uuid 


      },
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

    const search = req.query.search || '';

    const whereClause = {
      created_by: employeeId
    };

    // Optional search by client name or proposal name, etc.
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
      include: [
        {
          model: Client,
          as: 'client', // if you've set up associations
        },
        // Add more associations as needed
      ],
    });

    const totalPages = Math.ceil(totalRecords / limit);

    return res.status(200).json({
      message: 'Proposals fetched successfully',
      success: true,
      page,
      limit,
      totalPages,
      totalRecords,
      data: proposals,
    });
  } catch (error) {
    console.error('Error fetching employee proposals:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};
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

module.exports = {
  createProposal,
   getAllProposals,
   getEmployeeProposals,
   getUnapprovedProposals,
//   getProposalByUUID,
//   getProposalByAuthorityId,
 updateProposal,
  deleteProposal,
//   getDeletedProposal,
};
