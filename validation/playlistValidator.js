const { body, validationResult } = require("express-validator");

exports.validateAddPlaylist = [
 
    body("playlists")
      .isArray({ min: 1 })
      .withMessage("Playlists must be an array with at least one item."),
    
    body("playlists.*.url")
      .isString()
      .notEmpty()
      .withMessage("Each playlist must have a valid URL.")
      .isURL()
      .withMessage("Each URL must be a valid format."),
    
    body("playlists.*.topicName")
      .isString()
      .notEmpty()
      .withMessage("Each playlist must have a topicName.")
  
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
