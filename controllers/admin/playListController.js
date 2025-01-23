const express = require("express");
const axios = require("axios");
const bcrypt = require('bcrypt');
const Video=require('../../models/video');
const Topic=require('../../models/topic');
const playlist=require('../../models/playlist');
const { fetchVideoDetails, fetchPlaylistDetails } = require('../../services/youtubeService');



exports.addplaylists=async(req,res,next) =>{
  const { url, topicName } = req.body;

  if (!url  || !topicName) {
    return res.status(400).json({ error: "URL ,topicName and type are required." });
  }
  const list=await playlist.findOne({url:url});
  if (list){
    return res.status(400).json({ error: "list already exits." });
  }
const topic =await Topic.findOne({name:topicName});
if (!topic){
    return res.status(404).json({ error: "the topic not found." });
  }

    const    { title, description, thumbnailUrl, videos,totalDuration} = await fetchPlaylistDetails(url);
    
    const listItem =new playlist({
        title:title,
        description:description,
        thumbnailUrl:thumbnailUrl,
        numberOfVideos:videos.length,
        totalHours:totalDuration,
        url: url

    });
   const savedList= await listItem.save();

    for (const video of videos) {
      var videocheck= await Video.findOne({url:video.videoUrl});
      if (videocheck){
        continue
      }
        var newvideo= new Video({
            title:video.videoTitle,
        url:video.videoUrl,
        description:video.description,
        thumbnailUrl:video.videoThumbnail,
        isActive:true,
        totalHours:video.duration,
        topicId:topic._id,
        listId:savedList._id
        });
        
         await newvideo.save();
         savedList.video.push(newvideo);
    };

   await savedList.save();
   topic.playlist.push(savedList);
   await topic.save();
   return res.status(200).json({ message: "playlist data",savedList });
  
    
};



// Function to check if the playlist is still available on YouTube
exports.checkPlaylistAvailability = async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required." });
  }

  try {
    // Fetch playlist details from YouTube API
    const playlistDetails = await fetchPlaylistDetails(url);

    if (!playlistDetails) {
      return res.status(404).json({ error: "Playlist not found or deleted on YouTube." });
    }

    return res.status(200).json({ message: "Playlist is available", playlist: playlistDetails });
  } catch (error) {
    return res.status(500).json({ error: "Error fetching playlist details from YouTube." });
  }
};



