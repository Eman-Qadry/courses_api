const { body } = require('express-validator');

const loginValidator = [
  body('email').isEmail().withMessage('Please enter a valid email.'),
  body('password').notEmpty().withMessage('Password is required.'),
];

const signupValidator = [
  body('email').isEmail().withMessage('Please enter a valid email.'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.')
    .notEmpty()
    .withMessage('Password is required.'),
];

const forgotPasswordValidator = [
  body('email').isEmail().withMessage('Please enter a valid email.'),
];

const resetPasswordValidator = [
  body('token').notEmpty().withMessage('Reset token is required.'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.')
    .notEmpty()
    .withMessage('New password is required.'),
];

const changePasswordValidator = [
  body('password').notEmpty().withMessage('Current password is required.'),
  body('newpassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long.')
    .notEmpty()
    .withMessage('New password is required.'),
  body('confirmNewPass')
  .notEmpty()
  .withMessage('confirmation password is required.')
    .custom((value, { req }) => value === req.body.newpassword)
    .withMessage('New password and confirmation do not match.'),
];

module.exports = {
  loginValidator,
  signupValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  changePasswordValidator,
};
