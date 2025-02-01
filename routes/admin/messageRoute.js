
const express = require('express');
const router = express.Router();
const authorized=require('../../middlewares/authentication');
const messageController = require('../../controllers/admin/messages');

// Route to fetch messages for admin
router.get('/', authorized, messageController.getMessages);

module.exports = router;