const { Company } = require('../models');
const { Op, where } = require('sequelize');

const createAndUpdateCompany = async (req, res) => {
  try {
    const { name, email, description, logo, icon, phone,
      address,
      terms_and_conditions,
      bank_details } = req.body;

    if (!name || !email || (!req.files || !req.files.logo || !req.files.logo[0])) {
      return res.status(400).json({ message: 'Name , Email and Logo are required' });
    }

    const imageLogo = req.files?.logo?.[0]?.filename || null;
    const imageIcon = req.files?.icon?.[0]?.filename || null;

    const existingCompany = await Company.findOne({ where: { email } });

    // Parse JSON strings if sent as strings (e.g., from Postman or forms)
    const parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;
    const parsedBankDetails = typeof bank_details === 'string' ? JSON.parse(bank_details) : bank_details;

    if (existingCompany) {
      // Update existing record
      existingCompany.name = name;
      existingCompany.phone = phone || existingCompany.phone;
      existingCompany.address = parsedAddress || existingCompany.address;
      existingCompany.terms_and_conditions = terms_and_conditions || existingCompany.terms_and_conditions;
      existingCompany.bank_details = parsedBankDetails || existingCompany.bank_details;
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
        phone,
        address: parsedAddress,
        terms_and_conditions,
        bank_details: parsedBankDetails,
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
