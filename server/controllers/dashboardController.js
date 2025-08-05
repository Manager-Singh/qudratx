const { Lead , Proposal, User, Client  } = require('../models');
const { Op, where } = require('sequelize');

const getAllLeadsCount = async (req, res) => {
  try {
    const { id: userId, role } = req.user;

    let whereClause = {
      deleted_at: null,
    };

    // If employee, show leads created by or assigned to them
    if (role === 'employee') {
      whereClause = {
        ...whereClause,
        [Op.or]: [
          { created_by: userId },
          { assigned_to: userId }
        ],
      };
    }

    const count = await Lead.count({
      where: whereClause,
    });

    res.status(200).json({
      message: 'Total lead count fetched successfully',
      totalLeads: count,
    });
  } catch (error) {
    console.error('Error getting lead count:', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};


const getAllProposalsCount = async (req, res) => {
  try {
    const { id: userId, role } = req.user;

    let whereClause = {
      deleted_at: null,
    };

    if (role === 'employee') {
      whereClause = {
        ...whereClause,
        [Op.or]: [
          { created_by: userId },
        ],
      };
    }

    const count = await Proposal.count({ where: whereClause });

    res.status(200).json({
      message: 'Total proposal count fetched successfully',
      totalProposals: count,
    });
  } catch (error) {
    console.error('Error getting proposal count:', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};

const getAllUsersCount = async (req, res) => {
  try {
    const count = await User.count({
      where: {
        deleted_at: null,
      },
    });

    res.status(200).json({
      message: 'Total users count fetched successfully',
      totalUsers: count,
    });
  } catch (error) {
    console.error('Error getting users count:', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};

const getEmployeeCount = async (req, res) => {
  try {
    const count = await User.count({
      where: {
        role: 'employee',         // Count only employees
        deleted_at: null,         // Exclude soft-deleted users
      },
    });

    res.status(200).json({
      message: 'Employee count fetched successfully',
      employeeCount: count,
    });
  } catch (error) {
    console.error('Error fetching employee count:', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};

const getClientCount = async (req, res) => {
  try {
    const count = await Client.count({
      where: {
        deleted_at: null, // Only count non-deleted clients (if soft delete is used)
      },
    });

    res.status(200).json({
      message: 'Client count fetched successfully',
      clientCount: count,
    });
  } catch (error) {
    console.error('Error fetching client count:', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};




module.exports = {
  getAllLeadsCount,
  getAllProposalsCount,
  getAllUsersCount,
  getEmployeeCount,
  getClientCount,
};
