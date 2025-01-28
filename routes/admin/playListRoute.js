const express = require("express");
const listrouter = express.Router();
const authorized = require("../../middlewares/authentication");
const { validateAddPlaylist, validateCheckAvailability } = require("../../validation/playlistValidator");
const listcontroller = require("../../controllers/admin/playListController");

listrouter.post("/", authorized, validateAddPlaylist, listcontroller.addplaylists);
listrouter.post("/isAvailable", authorized, validateCheckAvailability, listcontroller.checkPlaylistAvailability);

module.exports = listrouter;
