const { body } = require("express-validator");

exports.validateAddPlaylist = [
  body("url")
    .notEmpty()
    .withMessage("Playlist URL is required.")
    .isURL()
    .withMessage("Invalid URL format."),
  body("topicName")
    .notEmpty()
    .withMessage("Topic name is required.")
    .isString()
    .withMessage("Topic name must be a string."),
];

exports.validateCheckAvailability = [
  body("url")
    .notEmpty()
    .withMessage("Playlist URL is required.")
    .isURL()
    .withMessage("Invalid URL format."),
];
