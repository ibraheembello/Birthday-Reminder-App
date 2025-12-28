const { validationResult } = require('express-validator');
const User = require('../models/user');

// Create a new user
exports.createUser = (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { username, email, dateOfBirth } = req.body;

  // Check if email already exists
  User.findByEmail(email, (err, existingUser) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Database error',
        error: err.message
      });
    }

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Create new user
    User.create({ username, email, dateOfBirth }, (err, user) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Failed to create user',
          error: err.message
        });
      }

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: user
      });
    });
  });
};

// Get all users
exports.getAllUsers = (req, res) => {
  User.getAll((err, users) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve users',
        error: err.message
      });
    }

    res.status(200).json({
      success: true,
      count: users.length,
      users: users
    });
  });
};
