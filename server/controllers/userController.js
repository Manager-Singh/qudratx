const { User } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');

const createEmployee = async (req, res) => {
  try {
    const { name, email, password, status } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists in this email ' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'employee',
      login_status: false,
      status
    }, {
      userId: req.user.id , 
    });

    res.status(201).json({
      message: 'Employee created successfully',
      success:true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const getEmployees = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const search = req.query.search || '';
    const status = req.query.status; // optional: 'active' or 'inactive'

    const where = {
      role: 'employee',
      [Op.or]: [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ]
    };

    // filter by status if provided
    if (status === 'active') {
      where.status = true;
    } else if (status === 'inactive') {
      where.status = false;
    }

    const { count, rows: employees } = await User.findAndCountAll({
      where,
      
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      message: 'Employees fetched successfully',
      page,
      limit,
      totalPages,
      totalRecords: count,
      search,
      data: employees
    });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { uuid } = req.params

    const employee = await User.findOne({
      where: { uuid, role: 'employee' }
    })

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' })
    }

    await employee.destroy({ userId: req.user.id })

    res.status(200).json({
      message: 'Employee deleted successfully',
      success: true,
      employee: {
        uuid: employee.uuid,
        name: employee.name,
        email: employee.email,
      },
    })
  } catch (error) {
    console.error('Delete employee error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}


const getDeletedEmployees = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    const where = {
      role: 'employee',
      deleted_at: { [Op.not]: null }, // only soft-deleted
      [Op.or]: [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ]
    };

    const { count, rows: employees } = await User.findAndCountAll({
      where,
      attributes: ['id', 'name', 'email', 'role', 'deleted_at'],
      paranoid: false, // include soft-deleted
      limit,
      offset,
      order: [['deleted_at', 'DESC']]
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      message: 'Deleted employees fetched successfully',
      page,
      limit,
      totalPages,
      totalRecords: count,
      search,
      data: employees
    });
  } catch (error) {
    console.error('Get deleted employees error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// updated Employees
const updateEmployee = async (req, res) => {
  try {
    const { uuid } = req.params
    const { name, email, password , status } = req.body

    if (!name && !email && !password) {
      return res.status(400).json({ message: 'At least one field must be provided' })
    }

    const employee = await User.findOne({
      where: { uuid, role: 'employee' }
    })

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' })
    }

    if (email && email !== employee.email) {
      const existing = await User.findOne({
        where: {
          email,
          uuid: { [Op.ne]: uuid },
        },
      })
      if (existing) {
        return res.status(409).json({ message: 'Email already in use' })
      }
    }

    if (name) employee.name = name
    if (email) employee.email = email
    if (status) employee.status = status
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10)
      employee.password = hashedPassword
    }

    await employee.save({ userId: req.user.id })

    res.status(200).json({
      message: 'Employee updated successfully',
      success: true,
      user:employee,
    })
  } catch (error) {
    console.error('Update employee error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}




const verfyUser = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({ message: 'Token is not exist please log in' });
    }

    res.status(200).json({ message: 'User fetch successfully', user });
  } catch (error) {
    console.error('Verify user error:', error);
    res.status(500).json({ message: error.message });
  }
};

const getEmployeeBYuuid= async (req,res) => {
  try {
   const { uuid } = req.params
    const employee = await User.findOne({
      where: { uuid}
    })
   console.log(employee,"employee not exist")
   if (!employee) {
    return res.status(400).json("id can not match")
   }

   res.status(200).json({success:true, message:"user fetch successfully", employee})
  } catch (error) {
    console.log(error,"error")
    res.status(500).json({message:error.message || "something went wrong"})
  }
}

module.exports = {
  createEmployee,
  getEmployees,
  deleteEmployee,
  getDeletedEmployees,
  verfyUser,
  updateEmployee,
  getEmployeeBYuuid
};
