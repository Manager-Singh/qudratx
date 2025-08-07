const { Lead, Proposal, User, Client, Notification } = require('../models');
const { Op } = require('sequelize');

const getDashboardCountsHelper = async (user) => {
  try {
    let leadWhere = { deleted_at: null };
    let proposalWhere = { deleted_at: null };
    let unapprovedProposalWhere = { deleted_at: null, approval_status: 0 };
    let pendingProposalWhere = { deleted_at: null, approval_status: 2 };
    let newLeadsWhere = null;

    if (user.role === 'employee') {
      // Employee-specific filtering
      leadWhere = {
        deleted_at: null,
        [Op.or]: [
          { created_by: user.id },
          { assigned_to: user.id }
        ]
      };

      proposalWhere = {
        deleted_at: null,
        employee_approval: 1,
        created_by: user.id
      };

      unapprovedProposalWhere = {
        deleted_at: null,
        approval_status: 0,
        employee_approval: 1,
        created_by: user.id
      };

      pendingProposalWhere = {
        deleted_at: null,
        approval_status: 2,
        employee_approval: 1,
        created_by: user.id
      };
    } else if (user.role === 'admin') {
      // Admin will see new leads
      newLeadsWhere = {
        deleted_at: null,
        lead_status: 'Waiting to Send Proposal'
      };
    }

    // Notification filters
    const notificationWhere = {
      user_id: user.id,
    };

    const unreadNotificationWhere = {
      user_id: user.id,
      is_read: 0,
    };

    const [
      totalLeads,
      totalProposals,
      unapprovedProposals,
      pendingProposals,
      totalClients,
      totalEmployees,
      activeEmployees,
      newLeads,
      notifications,
      unreadNotificationCount
    ] = await Promise.all([
      Lead.count({ where: leadWhere }),
      Proposal.count({ where: proposalWhere }),
      Proposal.count({ where: unapprovedProposalWhere }),
      Proposal.count({ where: pendingProposalWhere }),
      Client.count({ where: { deleted_at: null } }),
      User.count({ where: { role: 'employee', deleted_at: null } }),
      User.count({ where: { role: 'employee', login_status: 1, deleted_at: null } }),
      user.role === 'admin'
        ? Lead.count({ where: newLeadsWhere })
        : Promise.resolve(0),
      Notification.findAll({ where: notificationWhere, order: [['created_at', 'DESC']] }),
      Notification.count({ where: unreadNotificationWhere })
    ]);

    return {
      totalLeads,
      totalProposals,
      unapprovedProposals,
      pendingProposals,
      totalClients,
      totalEmployees,
      activeEmployees,
      newLeads,
      notifications,
      unreadNotificationCount
    };
  } catch (error) {
    console.error('Error in getDashboardCountsHelper:', error);
    throw error;
  }
};


module.exports={getDashboardCountsHelper};
