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
  body('urls')
  .isArray().withMessage('URLs must be an array')
  .notEmpty().withMessage('URLs array cannot be empty')
  .custom((urls) => {
      if (! urls.every(url =>  url.startsWith('https://www.youtube.com/')|| url.startsWith('https://youtube.com' )) ){
          throw new Error('Each URL must be a valid YouTube link');
      }
      return true;
  }),
  
];
