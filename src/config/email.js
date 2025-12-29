const nodemailer = require('nodemailer');

// Debug: Check if environment variables are loaded
console.log('Email config - USER:', process.env.EMAIL_USER ? 'SET' : 'NOT SET');
console.log('Email config - PASS:', process.env.EMAIL_PASS ? 'SET' : 'NOT SET');

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Email configuration error:', error.message);
  } else {
    console.log('Email service is ready to send messages');
  }
});

module.exports = transporter;
