const express = require("express");
const Video = require("../../models/video");
const Topic = require("../../models/topic");
const { fetchVideoDetails } = require("../../services/youtubeService");

exports.addVideos = async function (req, res, next) {
  const { videos } = req.body;

  if (!Array.isArray(videos) || videos.length === 0) {
    return res.status(400).json({ error: "An array of videos is required." });
  }

  const addedVideos = [];
  const errors = [];

  for (const videoData of videos) {
    const { url, topicName } = videoData;

    try {
      // Check if video already exists
      const existedVideo = await Video.findOne({ url });
      if (existedVideo) {
        errors.push({ url, error: "Video already exists." });
        continue;
      }

      // Check if topic exists
      const topic = await Topic.findOne({ name: topicName });
      if (!topic) {
        errors.push({ url, error: `Topic ${topicName} not found.` });
        continue;
      }

      // Fetch video details
      const videoDetails = await fetchVideoDetails(url);
      if (JSON.stringify(videoDetails) === "{}") {
        errors.push({ url, error: "Invalid or non-existent URL." });
        continue;
      }

      // Save video
      const video = new Video({
        title: videoDetails.title,
        url,
        description: videoDetails.description,
        thumbnailUrl: videoDetails.thumbnailUrl,
        isActive: true,
        totalHours: videoDetails.duration,
        topicId: topic._id,
      });

      const newVideo = await video.save();
      topic.video.push(newVideo._id);
      await topic.save();

      addedVideos.push(newVideo);
    } catch (error) {
      errors.push({ url, error: error.message });
    }
  }

  res.status(200).json({ message: "Processing complete.", addedVideos, errors });
};

exports.activateVideos = async function (req, res, next) {
  const { videoIds } = req.body;

  if (!Array.isArray(videoIds) || videoIds.length === 0) {
    return res.status(400).json({ error: "An array of video IDs is required." });
  }

  const updatedVideos = [];
  const errors = [];

  for (const videoId of videoIds) {
    try {
      const video = await Video.findByIdAndUpdate(videoId, { isActive: true }, { new: true });
      if (!video) {
        errors.push({ videoId, error: "Video not found." });
        continue;
      }
      updatedVideos.push(video);
    } catch (error) {
      errors.push({ videoId, error: error.message });
    }
  }

  res.status(200).json({ message: "Processing complete.", updatedVideos, errors });
};

exports.deactivateVideos = async function (req, res, next) {
  const { videoIds } = req.body;

  if (!Array.isArray(videoIds) || videoIds.length === 0) {
    return res.status(400).json({ error: "An array of video IDs is required." });
  }

  const updatedVideos = [];
  const errors = [];

  for (const videoId of videoIds) {
    try {
      const video = await Video.findByIdAndUpdate(videoId, { isActive: false }, { new: true });
      if (!video) {
        errors.push({ videoId, error: "Video not found." });
        continue;
      }
      updatedVideos.push(video);
    } catch (error) {
      errors.push({ videoId, error: error.message });
    }
  }

  res.status(200).json({ message: "Processing complete.", updatedVideos, errors });
};

exports.deleteVideos = async function (req, res, next) {
  const { videoIds } = req.body;

  if (!Array.isArray(videoIds) || videoIds.length === 0) {
    return res.status(400).json({ error: "An array of video IDs is required." });
  }

  const deletedVideos = [];
  const errors = [];

  for (const videoId of videoIds) {
    try {
      const video = await Video.findByIdAndDelete(videoId);
      if (!video) {
        errors.push({ videoId, error: "Video not found." });
        continue;
      }
      deletedVideos.push(videoId);
    } catch (error) {
      errors.push({ videoId, error: error.message });
    }
  }

  res.status(200).json({ message: "Processing complete.", deletedVideos, errors });
};

exports.recommendVideos = async function (req, res, next) {
  const { videoIds } = req.body;

  if (!Array.isArray(videoIds) || videoIds.length === 0) {
    return res.status(400).json({ error: "An array of video IDs is required." });
  }

  const recommendedVideos = [];
  const errors = [];

  for (const videoId of videoIds) {
    try {
      const video = await Video.findByIdAndUpdate(videoId, { isRecommended: true }, { new: true });
      if (!video) {
        errors.push({ videoId, error: "Video not found." });
        continue;
      }
      recommendedVideos.push(video);
    } catch (error) {
      errors.push({ videoId, error: error.message });
    }
  }

  res.status(200).json({ message: "Processing complete.", recommendedVideos, errors });
};

exports.notRecommendVideos = async function (req, res, next) {
  const { videoIds } = req.body;

  if (!Array.isArray(videoIds) || videoIds.length === 0) {
    return res.status(400).json({ error: "An array of video IDs is required." });
  }

  const notRecommendedVideos = [];
  const errors = [];

  for (const videoId of videoIds) {
    try {
      const video = await Video.findByIdAndUpdate(videoId, { isRecommended: false }, { new: true });
      if (!video) {
        errors.push({ videoId, error: "Video not found." });
        continue;
      }
      notRecommendedVideos.push(video);
    } catch (error) {
      errors.push({ videoId, error: error.message });
    }
  }

  res.status(200).json({ message: "Processing complete.", notRecommendedVideos, errors });
};


exports.getVideos = async function (req, res, next) {
  try {
    const { 
      topicId, 
      isActive, 
      isRecommended, 
      hasThumbnail, 
      deactivated, 
      page = 1, 
      limit = 25 
    } = req.query;

    // Build a query object dynamically
    const query = {};

    // Filter by topicId if provided
    if (topicId) {
      query.topicId = topicId;
    }

    // Filter by isActive (true/false)
    if (typeof isActive !== 'undefined') {
      query.isActive = isActive === 'true';
    }

    // Filter by isRecommended (true/false)
    if (typeof isRecommended !== 'undefined') {
      query.isRecommended = isRecommended === 'true';
    }

    // Filter videos with or without thumbnails
    if (typeof hasThumbnail !== 'undefined') {
      if (hasThumbnail === 'true') {
        query.thumbnailUrl = { $exists: true, $ne: null }; // Videos with a thumbnail
      } else if (hasThumbnail === 'false') {
        query.thumbnailUrl = { $exists: false }; // Videos without a thumbnail
      }
    }

    // Special filter for deactivated videos
    if (typeof deactivated !== 'undefined') {
      query.isActive = deactivated === 'true' ? false : true;
    }

   

    // Fetch videos with filtering, pagination, and populate topic & playlist details
    const videos = await Video.find(query)
     
      .populate("topicId", "name") // Include only the topic name
      .populate("listId", "name"); // Include only the playlist name

    // Fetch total count for pagination
    const totalVideos = await Video.countDocuments(query);

    res.status(200).json({
      message: "Videos fetched successfully.",
      data: videos,
      total: totalVideos,
     
    });
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ error: "Error fetching videos.", details: error.message });
  }
};
