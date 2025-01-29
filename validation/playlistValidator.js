const { body, validationResult } = require("express-validator");

exports.validateAddPlaylist = [
  body("urls")
    .isArray({ min: 1 })
    .withMessage("URLs must be a non-empty array."),
  body("topicName")
    .notEmpty()
    .withMessage("Topic name is required."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

exports.validateCheckAvailability = [
  body("urls")
    .isArray({ min: 1 })
    .withMessage("URLs must be a non-empty array."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
