const { FeeStructure } = require('../models');
const { Op, where } = require('sequelize');

// CREATE
const createFeeStructure = async (req, res) => {
  try {
    const { name, amount } = req.body;
    if (!name || !amount) {
      return res.status(400).json({ message: 'Name and Amount is required' });
    }
const existingFee= await FeeStructure.findOne({
  where:{name}
})

if (existingFee) {
  return res.status(400).json({message:"Fee structure  already exist"})
}
    const fee = await FeeStructure.create({
      name,
      amount,
      last_update: new Date(),
    },{ userId: req.user.id });

    return res.status(201).json({
      message: 'Fee structure created successfully',
      success: true,
      data: fee,
    });
  } catch (error) {
    console.error('Create fee error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// READ ALL
const getFeeStructure = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    const where = {
      deleted_at: null,
      name: { [Op.like]: `%${search}%` }
    };

    const { count, rows } = await FeeStructure.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      message: 'fee structures fetched successfully',
      page,
      limit,
      totalPages,
      totalRecords: count,
      data: rows
    });
  } catch (error) {
    console.error('Get fees error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET ONE
const getFeeStructureByUUID = async (req, res) => {
  try {
    const { uuid } = req.params;

    const fee = await FeeStructure.findOne({ where: { uuid } });
    if (!fee) {
      return res.status(404).json({ message: 'fee not found' });
    }

    res.status(200).json({
      message: 'Fee fetched successfully',
      success: true,
      data: fee,
    });
  } catch (error) {
    console.error('Get fee error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// UPDATE
const updateFeeStructure = async (req, res) => {
  try {
    const { uuid } = req.params;
    const { name, amount } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Name is required' });
      }

    const fee = await FeeStructure.findOne({ where: { uuid } });
    if (!fee) {
      return res.status(404).json({ message: 'Fee not found' });
    }

    if (name) fee.name = name;
    if (amount) fee.amount = amount;
    fee.updated_by = req.user.id;
    fee.updated_at = new Date();
    fee.last_update = new Date();

    await fee.save({ userId: req.user.id });

    res.status(200).json({
      message: 'Fee updated successfully',
      success: true,
      data: fee
    });
  } catch (error) {
    console.error('Update fee error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE
const deleteFeeStructure = async (req, res) => {
  try {
    const { uuid } = req.params;

    const fee = await FeeStructure.findOne({ where: { uuid } });
    if (!fee) {
      return res.status(404).json({ message: 'Fee not found' });
    }

    await fee.destroy({ userId: req.user.id }); // Soft delete because `paranoid: true`

    res.status(200).json({
      message: 'Fee deleted successfully',
      success: true,
      data: { uuid: fee.uuid, name: fee.name },
    });
  } catch (error) {
    console.error('Delete fee error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET DELETED ACTIVITIES
const getDeletedFeeStructure = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    const { count, rows } = await FeeStructure.findAndCountAll({
      where: {
        deleted_at: { [Op.not]: null },
        name: { [Op.like]: `%${search}%` },
      },
      paranoid: false,
      limit,
      offset,
      order: [['deleted_at', 'DESC']],
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      message: 'Deleted fee fetched successfully',
      page,
      limit,
      totalPages,
      totalRecords: count,
      data: rows,
    });
  } catch (error) {
    console.error('Get deleted fee error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createFeeStructure,
  getFeeStructure,
  getFeeStructureByUUID,
  updateFeeStructure,
  deleteFeeStructure,
  getDeletedFeeStructure,
};
