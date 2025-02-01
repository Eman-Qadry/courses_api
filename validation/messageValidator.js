// messageValidators.js
const { body, validationResult } = require('express-validator');

exports.validateMessage = [
  // Validate and sanitize fields.
  body('fullName', 'Full name is required').notEmpty().trim().escape(),
  body('email', 'Please include a valid email').isEmail().normalizeEmail(),
  body('message', 'Message is required').notEmpty().trim().escape(),
];