const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const { checkAndSendBirthdayEmails } = require('../services/birthdayService');

const router = express.Router();

// Validation rules
const userValidation = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Username must be between 2 and 50 characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),

  body('dateOfBirth')
    .notEmpty()
    .withMessage('Date of birth is required')
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Date of birth must be in YYYY-MM-DD format')
    .custom((value) => {
      const date = new Date(value);
      const today = new Date();
      if (date >= today) {
        throw new Error('Date of birth must be in the past');
      }
      return true;
    })
];

// Routes
router.post('/users', userValidation, userController.createUser);
router.get('/users', userController.getAllUsers);

// Test endpoint - manually trigger birthday check
router.get('/test-birthday-emails', async (req, res) => {
  try {
    console.log('Manual birthday check triggered via API');
    const result = await checkAndSendBirthdayEmails();
    res.status(200).json({
      success: true,
      message: 'Birthday check completed',
      result: result
    });
  } catch (error) {
    console.error('Birthday check failed:', error);
    res.status(500).json({
      success: false,
      message: 'Birthday check failed',
      error: error.message
    });
  }
});

module.exports = router;
