const nodemailer = require('nodemailer');

// Debug: Check if environment variables are loaded
console.log('Email config - USER:', process.env.EMAIL_USER ? 'SET' : 'NOT SET');
console.log('Email config - PASS:', process.env.EMAIL_PASS ? 'SET' : 'NOT SET');

// Create email transporter with explicit SMTP configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000
});

// Verify transporter configuration (non-blocking)
transporter.verify((error, success) => {
  if (error) {
    console.warn('⚠️  Email service warning:', error.message);
    console.warn('⚠️  App will continue running. Emails may fail to send.');
    console.warn('⚠️  This is usually caused by Gmail security blocking the connection.');
  } else {
    console.log('✅ Email service is ready to send messages');
  }
});

// Note: We don't throw errors here so the app can start even if email is unreachable

module.exports = transporter;
