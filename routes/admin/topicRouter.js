const express = require('express');
const router = express.Router();
const authorized = require('../../middlewares/authentication');
const topicController = require('../../controllers/admin/topicController');
const topicValidators = require('../../validation/topicValidator'); // Import validators
const { validationResult } = require("express-validator");

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Create a new topic
router.post('/', authorized, topicValidators.createTopicValidator,handleValidationErrors, topicController.createTopic);

// Get all topics
router.get('/', authorized, topicController.getTopics);

// Rename a topic
router.put('/', authorized, topicValidators.renameTopicValidator, handleValidationErrors,topicController.renameTopic);

// Delete a topic
router.delete('/', authorized, topicValidators.deleteTopicValidator,handleValidationErrors, topicController.deleteTopic);

module.exports = router;
