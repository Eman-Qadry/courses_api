const express = require("express");
const vidrouter = express.Router();
const authorized = require("../../middlewares/authentication");
const vidcontroller = require("../../controllers/admin/videoController");
const {
  addVideosValidation,
  activateVideosValidation,
  deactivateVideosValidation,
  deleteVideosValidation,
  recommendVideosValidation,
  notRecommendVideosValidation,
  getVideosValidation,
} = require("../../validation/videoValidator");
const { validationResult } = require("express-validator");

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Add videos route
vidrouter.post(
  "/",
  authorized,
  addVideosValidation,
  handleValidationErrors,
  vidcontroller.addVideos
);

// Activate videos route
vidrouter.post(
  "/activate",
  authorized,
  activateVideosValidation,
  handleValidationErrors,
  vidcontroller.activateVideos
);

// Deactivate videos route
vidrouter.post(
  "/deactivate",
  authorized,
  deactivateVideosValidation,
  handleValidationErrors,
  vidcontroller.deactivateVideos
);

// Delete videos route
vidrouter.delete(
  "/",
  authorized,
  deleteVideosValidation,
  handleValidationErrors,
  vidcontroller.deleteVideos
);

// Recommend videos route
vidrouter.post(
  "/recommend",
  authorized,
  recommendVideosValidation,
  handleValidationErrors,
  vidcontroller.recommendVideos
);

// Not recommend videos route
vidrouter.post(
  "/not-recommend",
  authorized,
  notRecommendVideosValidation,
  handleValidationErrors,
  vidcontroller.notRecommendVideos
);

// Get videos route
vidrouter.get(
  "/",
  authorized,
  getVideosValidation,
  handleValidationErrors,
  vidcontroller.getVideos
);

module.exports = vidrouter;
