const express=require('express');
const authrouter=express.Router();
const validators = require('../../validation/authValidator');
const authorized=require('../../middlewares/authentication');
const authcontroller=require('../../controllers/admin/authController');
const { validationResult } = require("express-validator");

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
// Admin signup route
authrouter.post('/signUp', validators.signupValidator,handleValidationErrors,authcontroller.postsignup);

// Admin login route
authrouter.post('/login',validators.loginValidator,handleValidationErrors,authcontroller.postlogin);

authrouter.post('/change-password',authorized,validators.changePasswordValidator,handleValidationErrors,authcontroller.changepassword);

// Forgot password route
authrouter.post('/forgot-password', validators.forgotPasswordValidator,handleValidationErrors, authcontroller.forgotPassword);

// Reset password with token route
authrouter.post('/reset-password', validators.resetPasswordValidator,handleValidationErrors, authcontroller.resetPasswordWithToken);

module.exports=authrouter;



