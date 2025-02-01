const express = require("express");
const listrouter = express.Router();
const authorized = require("../../middlewares/authentication");

const { validationResult } = require("express-validator");
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
const listcontroller = require("../../controllers/admin/playListController");
const {
  validateAddPlaylist,
  validateCheckAvailability
} = require("../../validation/playlistValidator");

listrouter.post("/", authorized, validateAddPlaylist,handleValidationErrors, listcontroller.addPlaylists);
listrouter.post("/isAvailable", authorized, validateCheckAvailability,handleValidationErrors, listcontroller.checkPlaylistAvailability);

module.exports = listrouter;
