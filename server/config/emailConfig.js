const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // or use SMTP
  auth: {
    user: process.env.EMAIL_USER,      // set in .env
    pass: process.env.EMAIL_PASS       // set in .env
  }
});

module.exports = transporter;
