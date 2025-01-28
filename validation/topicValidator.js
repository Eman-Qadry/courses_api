const { body, query } = require('express-validator');

// Create Topic Validator 
const createTopicValidator = [
  body('name')
    .isString().withMessage('Topic name must be a string.')
    .notEmpty().withMessage('Topic name is required.')
    .trim().withMessage('Topic name cannot be empty after trimming.')
];

// Rename Topic Validator 
const renameTopicValidator = [
  body('newname')
    .isString().withMessage('New topic name must be a string.')
    .notEmpty().withMessage('New topic name is required.')
    .trim().withMessage('New topic name cannot be empty after trimming.'),
  body('topicId')
    .isMongoId().withMessage('Invalid topic ID format. Must be a valid MongoDB ObjectId.')
    .notEmpty().withMessage('Topic ID is required.')
];

// Delete Topic Validator 
const deleteTopicValidator = [
  query('topicId')
    .isMongoId().withMessage('Invalid topic ID format. Must be a valid MongoDB ObjectId.')
    .notEmpty().withMessage('Topic ID is required.')
];

module.exports = {
  createTopicValidator,
  renameTopicValidator,
  deleteTopicValidator
};
