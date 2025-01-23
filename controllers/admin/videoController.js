const express = require("express");
const axios = require("axios");
const bcrypt = require('bcrypt');
const Video=require('../../models/video');
const Topic=require('../../models/topic');
const playlist=require('../../models/playlist');
const { fetchVideoDetails, fetchPlaylistDetails } = require('../../services/youtubeService');

exports.addvideo=async function (req,res,next) {
  const { url, topicName } = req.body;
const existedVideo=await Video.findOne({url:url});
if (existedVideo)
  return res.status(400).json({ error: "video is existed already" });

  if (!url  || !topicName) {
    return res.status(400).json({ error: "URL ,topicName and type are required." });
  }
const topic =await Topic.findOne({name:topicName});
if (!topic){
    return res.status(404).json({ error: "the topic not found." });
  }

  
    const videoDetails= await fetchVideoDetails(url);
    if (JSON.stringify(videoDetails) === '{}'){
      res.status("404").json("Not existed url yet");
    }
    const video= new Video({
        title:videoDetails.title,
        url:url,
        description:videoDetails.description,
        thumbnailUrl:videoDetails.thumbnailUrl,
        isActive:true,
        totalHours:videoDetails.duration,
        topicId:topic._id

    });
    const newvideo= await video.save();
    if (!newvideo){
        return res.status(500).json({ error: "can not save the video" });
      }
    topic.video.push(newvideo._id);
    const savedTopic= await topic.save();
    if (!savedTopic){
        return res.status(500).json({ error: "can not save the topic" });
      }
      return res.status(200).json({ message: "video data",newvideo });
  }



// Function to check if the video is still available on YouTube
exports.checkVideoAvailability = async function (req, res,next)  {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required." });
  }

  try {
    // Fetch video details from YouTube API
    const videoDetails = await fetchVideoDetails(url);

    if (!videoDetails) {
      return res.status(404).json({ error: "Video not found or deleted on YouTube." });
    }

    return res.status(200).json({ message: "Video is available", video: videoDetails });
  } catch (error) {
    return res.status(500).json({ error: "Error fetching video details from YouTube." });
  }
};




exports.activateVideo = async function(req, res,next)  {
  const { videoId } = req.query;

  if (!videoId) {
    return res.status(400).json({ error: "Video ID is required." });
  }

  try {
    const video = await Video.findByIdAndUpdate(
      videoId,
      { isActive: true },
      { new: true }
    );

    if (!video) {
      return res.status(404).json({ error: "Video not found." });
    }

    return res.status(200).json({ message: "Video activated successfully.", video });
  } catch (error) {
    return res.status(500).json({ error: "Error activating video.", details: error.message });
  }
};
exports.deactivateVideo = async function(req, res,next)  {
  const { videoId } = req.query;

  if (!videoId) {
    return res.status(400).json({ error: "Video ID is required." });
  }

  try {
    const video = await Video.findByIdAndUpdate(
      videoId,
      { isActive: false },
      { new: true }
    );

    if (!video) {
      return res.status(404).json({ error: "Video not found." });
    }

    return res.status(200).json({ message: "Video deactivated successfully.", video });
  } catch (error) {
    return res.status(500).json({ error: "Error deactivating video.", details: error.message });
  }
};

exports.deleteVideo = async function (req, res,next)  {
  const { videoId } = req.query;

  if (!videoId) {
    return res.status(400).json({ error: "Video ID is required." });
  }

  try {
    const video = await Video.findByIdAndDelete(videoId);

    if (!video) {
      return res.status(404).json({ error: "Video not found." });
    }

    return res.status(200).json({ message: "Video deleted successfully." });
  } catch (error) {
    return res.status(500).json({ error: "Error deleting video.", details: error.message });
  }
};
exports.recommendVideo = async function (req, res,next)  {
  const { videoId } = req.query;

  if (!videoId) {
    return res.status(400).json({ error: "Video ID is required." });
  }

  try {
    const video = await Video.findByIdAndUpdate(
      videoId,
      { isRecommended: true },
      { new: true }
    );

    if (!video) {
      return res.status(404).json({ error: "Video not found." });
    }

    return res.status(200).json({ message: "Video marked as recommended successfully.", video });
  } catch (error) {
    return res.status(500).json({ error: "Error marking video as recommended.", details: error.message });
  }
};

exports.notRecommendVideo = async function (req, res,next)  {
  const { videoId } = req.query;

  if (!videoId) {
    return res.status(400).json({ error: "Video ID is required." });
  }

  try {
    const video = await Video.findByIdAndUpdate(
      videoId,
      { isRecommended: false },
      { new: true }
    );

    if (!video) {
      return res.status(404).json({ error: "Video not found." });
    }

    return res.status(200).json({ message: "Video marked as Not recommended successfully.", video });
  } catch (error) {
    return res.status(500).json({ error: "Error marking video as recommended.", details: error.message });
  }
};

exports.favouriteVideo = async function (req, res,next)  {
  const { videoId } = req.query;

  if (!videoId) {
    return res.status(400).json({ error: "Video ID is required." });
  }

  try {
    const video = await Video.findByIdAndUpdate(
      videoId,
      { favourite: true},
      { new: true }
    );

    if (!video) {
      return res.status(404).json({ error: "Video not found." });
    }

    return res.status(200).json({ message: "Video added to favourite list successfully.", video });
  } catch (error) {
    return res.status(500).json({ error: "Error marking video favourite.", details: error.message });
  }
};
  exports.getVideos=async function (req,res,next){
const videos=await Video.find();
return res.status(200).json({ message: "all Videos are.", videos });

  }