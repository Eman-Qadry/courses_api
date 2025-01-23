const express=require('express');
const authrouter=express.Router();
const authorized=require('../../middlewares/authentication');
const authcontroller=require('../../controllers/admin/authController');
authrouter.post('/signUp',authcontroller.postsignup);
authrouter.post('/login',authcontroller.postlogin);
authrouter.post('/resetpassword',authorized,authcontroller.resetpassword);
module.exports=authrouter;