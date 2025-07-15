const { Company } = require('../models');
const { Op, where } = require('sequelize');

const createAndUpdateCompany = async (req, res) => {
  try {
    const { name, email, description, logo, icon } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and Email are required' });
    }

    const imageLogo = req.files?.logo?.[0]?.filename || null;
    const imageIcon = req.files?.icon?.[0]?.filename || null;

    const existingCompany = await Company.findOne({ where: { email } });

    if (existingCompany) {
      // Update existing record
      existingCompany.name = name;
      existingCompany.description = description;
      existingCompany.logo = imageLogo || existingCompany.logo;
      existingCompany.icon = imageIcon || existingCompany.icon;
      existingCompany.updated_at = new Date();
      existingCompany.updated_by = req.user?.id || null;

      await existingCompany.save();

      return res.status(200).json({
        message: 'Company updated successfully',
        success: true,
        data: existingCompany
      });
    } else {
      // Create new company
      const newCompany = await Company.create({
        name,
        email,
        description,
        logo: imageLogo,
        icon: imageIcon,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: req.user?.id || null,
        updated_by: req.user?.id || null
      });

      return res.status(201).json({
        message: 'Company created successfully',
        success: true,
        data: newCompany
      });
    }
  } catch (error) {
    console.error('Create/Update company error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {
  createAndUpdateCompany
};
