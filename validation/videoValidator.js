const { body, query } = require("express-validator");

module.exports = {
  addVideosValidation: [
    body("videos")
    .isArray({ min: 1 })
    .withMessage("Videos must be an array and contain at least one URL."),
  
  body("videos.*")
    .isString()
    .withMessage("Each video URL must be a string.")
    .matches(/^https:\/\/youtu\.be\/[a-zA-Z0-9_-]+(\?.*)?$/)
    .withMessage("Each video must be a valid YouTube short URL (https://youtu.be/...)."),

    body("topicName").isString().notEmpty().withMessage("Each video must have a topic name."),
  ],

  activateVideosValidation: [
    body("videoIds").isArray({ min: 1 }).withMessage("Video IDs must be a non-empty array."),
    body("videoIds.*").isMongoId().withMessage("Each video ID must be a valid MongoDB ID."),
  ],

  deactivateVideosValidation: [
    body("videoIds").isArray({ min: 1 }).withMessage("Video IDs must be a non-empty array."),
    body("videoIds.*").isMongoId().withMessage("Each video ID must be a valid MongoDB ID."),
  ],

  deleteVideosValidation: [
    body("videoIds").isArray({ min: 1 }).withMessage("Video IDs must be a non-empty array."),
    body("videoIds.*").isMongoId().withMessage("Each video ID must be a valid MongoDB ID."),
  ],

  recommendVideosValidation: [
    body("videoIds").isArray({ min: 1 }).withMessage("Video IDs must be a non-empty array."),
    body("videoIds.*").isMongoId().withMessage("Each video ID must be a valid MongoDB ID."),
  ],

  notRecommendVideosValidation: [
    body("videoIds").isArray({ min: 1 }).withMessage("Video IDs must be a non-empty array."),
    body("videoIds.*").isMongoId().withMessage("Each video ID must be a valid MongoDB ID."),
  ],

  getVideosValidation: [
    query("topicId").optional().isMongoId().withMessage("Topic ID must be a valid MongoDB ID."),
    query("isActive").optional().isBoolean().withMessage("isActive must be true or false."),
    query("isRecommended").optional().isBoolean().withMessage("isRecommended must be true or false."),
    query("hasThumbnail").optional().isBoolean().withMessage("hasThumbnail must be true or false."),
    query("deactivated").optional().isBoolean().withMessage("deactivated must be true or false."),
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer."),
    query("limit").optional().isInt({ min: 1 }).withMessage("Limit must be a positive integer."),
  ],
  availableVideosValidation:[
    body("videos")
    .isArray({ min: 1 })
    .withMessage("Videos must be an array and contain at least one URL."),
  
  body("videos.*")
    .isString()
    .withMessage("Each video URL must be a string.")
    .matches(/^https:\/\/youtu\.be\/[a-zA-Z0-9_-]+(\?.*)?$/)
    .withMessage("Each video must be a valid YouTube short URL (https://youtu.be/...)."),

  ]
};
