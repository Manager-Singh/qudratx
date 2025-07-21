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
    } = req.body;

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
const getProposal = async (req, res) => {
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
// const updateProposal = async (req, res) => {
//   try {
//     const { uuid } = req.params;
//      const { name,description, total_amount, status, subtotal,discount,fee_structure, tax, authority_id, activity } = req.body;

//     if (!name || !total_amount || !subtotal || !fee_structure || !authority_id || !activity) {
//       return res.status(400).json({ message: 'Name, Fee structure, Subtotal, Authority Id, Activity and Total Amount are required' });
//     }

//     const proposal = await Proposal.findOne({ where: { uuid } });
//     if (!package) {
//       return res.status(404).json({ message: 'Package not found' });
//     }

//     // proposal.name = name;
//     // proposal.dscription = description;
//     // proposal.total_amount = total_amount;
//     // package.status = status;
//     // package.subtotal = subtotal;
//     // package.fee_structure = fee_structure;
//     // package.authority_id = authority_id;
//     // package.activity = activity;
//     // package.updated_by = req.user.id;
//     // package.updated_at = new Date();
//     // package.last_update = new Date();

//     await proposal.save({ userId: req.user.id });

//     res.status(200).json({
//       message: 'Proposal updated successfully',
//       success: true,
//       data: proposal
//     });
//   } catch (error) {
//     console.error('Update proposal error:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// // DELETE
// const deleteProposal = async (req, res) => {
//   try {
//     const { uuid } = req.params;

//     const proposal = await Proposal.findOne({ where: { uuid } });
//     if (!proposal) {
//       return res.status(404).json({ message: 'proposal not found' });
//     }

//     await proposal.destroy({ userId: req.user.id }); // Soft delete because `paranoid: true`

//     res.status(200).json({
//       message: 'Proposal deleted successfully',
//       success: true,
//       data: { uuid: proposal.uuid, name: proposal.name },
//     });
//   } catch (error) {
//     console.error('Delete proposal error:', error);
//     res.status(500).json({ message: 'Internal server error' });
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

module.exports = {
  createProposal,
   getProposal,
//   getProposalByUUID,
//   getProposalByAuthorityId,
//   updateProposal,
//   deleteProposal,
//   getDeletedProposal,
};
