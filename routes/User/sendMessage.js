const express = require('express');
const router = express.Router();

const messageController= require('../../controllers/User/sendMessag')
const messageValidators = require('../../validation/messageValidator');


router.post('/sendMessage',messageValidators.validateMessage,messageController.sendMessages);
module.exports=router;