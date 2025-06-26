const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



const login = async (req, res) => {
  const { email, password } = req.body;

  try {
   
    // 1. Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 2. Validate password
    const isValid = await user.validatePassword(password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // 3. Update last_login & login_status
    user.login_status = true;
    await user.save();

    // 4. Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    // 5. Send response
    res.json({
      success:true,
      message: 'Login successful',
      token,
      user: {
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        role: user.role,
        last_login: user.last_login,
        login_status: user.login_status
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const logout = async (req, res) => {
  try {
    const user = req.user;

    if (!user || !user.uuid) {
      return res.status(400).json({ message: 'You are not authorized' });
    }

    // Find the user from DB using UUID
    const dbUser = await User.findOne({ where: { uuid: user.uuid } });

    if (!dbUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update login_status to false
    db.user.last_login = new Date();
    dbUser.login_status = false;
    await dbUser.save();

    return res.status(200).json({ message: 'Logged out successfully', success:true});
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports= {login,logout}
