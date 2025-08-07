const { Client } = require('../models');
const { Op, where } = require('sequelize');

// CREATE
const createClientDetail = async (req, res) => {
  try {
    const { name, email, address, phone, company_name, notes, status } = req.body;

    //Validate required fields
    if (!name || !email || !address) {
      return res.status(400).json({ message: 'Name, Email, and Address are required' });
    }

    //Check if client with same email exists
    const existingClient = await Client.findOne({
      where: { email }
    });

    if (existingClient) {
      return res.status(400).json({ message: 'Client already exists with this email' });
    }

    //Create the client
    const client = await Client.create({
      name,
      email,
      address,
      phone,
      company_name,
      notes,
      status,
      userId: req.user.id, // Make sure this column exists in your table
      last_update: new Date(),
    },{ userId: req.user.id });

    return res.status(201).json({
      message: 'Client created successfully',
      success: true,
      data: client,
    });

  } catch (error) {
    console.error('Create client error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// READ ALL
const getClientDetail = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const status = req.query.status; // optional: 'active' or 'inactive'

    const where = {
      deleted_at: null,
      email: { [Op.like]: `%${search}%` }
    };

    // filter by status if provided
    if (status === 'active') {
      where.status = true;
    } else if (status === 'inactive') {
      where.status = false;
    }

    const { count, rows } = await Client.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      message: 'Client details fetched successfully',
      page,
      limit,
      totalPages,
      totalRecords: count,
      data: rows
    });
  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET ONE
const getClientDetailByUUID = async (req, res) => {
  try {
    const { uuid } = req.params;

    const client = await Client.findOne({ where: { uuid } });
    if (!client) {
      return res.status(404).json({ message: 'client not found' });
    }

    res.status(200).json({
      message: 'client fetched successfully',
      success: true,
      data: client,
    });
  } catch (error) {
    console.error('Get client error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// UPDATE
const updateClientDetail = async (req, res) => {
  try {
    const { uuid } = req.params;
    const { name, email, address, phone, company_name, notes, status } = req.body;

    // Validate required fields
    if (!name || !email || !address) {
      return res.status(400).json({ message: 'Name, Email, and Address are required' });
    }

    // Find the client being updated
    const client = await Client.findOne({ where: { uuid } });

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Check if email already exists in another client
    const emailExists = await Client.findOne({
      where: {
        email,
        uuid: { [Op.ne]: uuid }, // Exclude current client
        deleted_at: null,
      },
    });

    if (emailExists) {
      return res.status(400).json({ message: 'Email already in use by another client' });
    }

    // Update required fields
    client.name = name;
    client.email = email;
    client.address = address;

    // Update optional fields, even if empty string
    client.phone = phone !== undefined ? phone : client.phone;
    client.company_name = company_name !== undefined ? company_name : client.company_name;
    client.notes = notes !== undefined ? notes : client.notes;

    // Update status if boolean value is passed
    if (typeof status === 'boolean') {
      client.status = status;
    }

    client.updated_by = req.user.id;
    client.updated_at = new Date();
    client.last_update = new Date();

    await client.save({ userId: req.user.id });

    res.status(200).json({
      message: 'Client updated successfully',
      success: true,
      data: client,
    });

  } catch (error) {
    console.error('Update client error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



// DELETE
const deleteClientDetail = async (req, res) => {
  try {
    const { uuid } = req.params;

    const client = await Client.findOne({ where: { uuid } });
    if (!client) {
      return res.status(404).json({ message: 'client not found' });
    }

    await client.destroy({ userId: req.user.id }); // Soft delete because `paranoid: true`

    res.status(200).json({
      message: 'Client deleted successfully',
      success: true,
      data: { uuid: client.uuid, name: client.email },
    });
  } catch (error) {
    console.error('Delete Client error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET DELETED CLIENTS
const getDeletedClientDetail = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    const { count, rows } = await Client.findAndCountAll({
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

module.exports = {
  createClientDetail,
  getClientDetail,
  getClientDetailByUUID,
  updateClientDetail,
  deleteClientDetail,
  getDeletedClientDetail,
};
