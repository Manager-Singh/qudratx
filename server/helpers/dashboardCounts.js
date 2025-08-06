const { Op } = require('sequelize');
const { Lead, Proposal, Client, User } = require('../models'); // Adjust path if needed

const getDashboardCountsHelper = async (user) => {
  const isAdmin = user.role === 'admin';

  // LEAD COUNT
  const leadWhere = {
    deleted_at: null,
  };
  if (!isAdmin) {
    leadWhere[Op.or] = [
      { created_by: user.id },
      { assigned_to: user.id },
    ];
  }
  const leadCount = await Lead.count({ where: leadWhere });

  // PROPOSAL COUNT
  const proposalWhere = {
    deleted_at: null,
  };
  if (!isAdmin) {
    proposalWhere[Op.or] = [
      { created_by: user.id },
      { updated_by: user.id },
    ];
  }
  const proposalCount = await Proposal.count({ where: proposalWhere });

  // CLIENT COUNT
  const clientCount = await Client.count({
    where: { deleted_at: null },
  });

  // USER COUNT
  const userCount = await User.count({
    where: { deleted_at: null },
  });

  // EMPLOYEE COUNT
  const employeeCount = await User.count({
    where: {
      role: 'employee',
      deleted_at: null,
    },
  });

  return {
    totalLeads: leadCount,
    totalProposals: proposalCount,
    totalClients: clientCount,
    totalUsers: userCount,
    totalEmployees: employeeCount,
  };
};

module.exports = {
  getDashboardCountsHelper,
};
