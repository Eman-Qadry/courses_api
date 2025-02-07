const express = require("express");
const Video = require("../../models/video");
const Topic = require("../../models/topic");
const Playlist=require("../../models/playlist");
const { fetchVideoDetails } = require("../../services/youtubeService");

exports.addVideos = async function (req, res, next) {
  const { videos } = req.body;

  if (!Array.isArray(videos) || videos.length === 0) {
    return res.status(400).json({ error: "An array of videos with { url, topicName } is required." });
  }

  const addedVideos = [];
  const errors = [];

  for (const { url, topicName } of videos) {
    try {
      if (!url || !topicName) {
        errors.push({ url, error: "Both URL and topicName are required." });
        continue;
      }

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
      if (!videoDetails || JSON.stringify(videoDetails) === "{}") {
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
      topic.numberOfVideos += 1;
       topic.actualNumberOfVideos+=1
      // Apply the updates
      topic.totalHours.hours += newVideo.totalHours.hours;
      topic.totalHours.minutes += newVideo.totalHours.minutes;
      topic.totalHours.seconds += newVideo.totalHours.seconds;

      // Normalize values
      topic.totalHours.minutes += Math.floor(topic.totalHours.seconds / 60);
      topic.totalHours.seconds %= 60;
      topic.totalHours.hours += Math.floor(topic.totalHours.minutes / 60);
      topic.totalHours.minutes %= 60;

      topic.markModified("totalHours");

      topic.actualHours.hours=topic.totalHours.hours;
      topic.actualHours.minutes=topic.totalHours.minutes;
      topic.actualHours.seconds= topic.totalHours.seconds;

      // Save
      await topic.save();

      addedVideos.push({ title: newVideo.title, videoId: newVideo._id });
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
      const video = await Video.findOne({_id:videoId})
     
      if (!video) {
        errors.push({ videoId, error: "Video not found." });
        continue;
      }
      if (video.isActive === true)

      {
        errors.push({ videoId, error: "Video is already active" });
        continue;
      }
     
      if (video.listId) {
        updatePlaylistTime(video.listId, video.totalHours, "add")
        
      }
      await updateTopicTime(video.topicId, video.totalHours, 'add');
      video.isActive=true;
      await video.save();
      updatedVideos.push(videoId);
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
      const video = await Video.findOne( { _id: videoId });
     
      
      if (!video) {
        errors.push({ videoId, error: "Video not found." });
        continue;
      }
      if (video.isActive === false)

        {
          errors.push({ videoId, error: "Video is already deactived" });
          continue;
        }
       
          
        if (video.listId) {
          updatePlaylistTime(video.listId, video.totalHours, 'subtract')
          
        }
        await updateTopicTime(video.topicId, video.totalHours, 'subtract');
        video.isActive=false;
        await video.save();
      updatedVideos.push(videoId);
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
      const video = await Video.findOne( { _id: videoId });
     
      
      if (!video) {
        errors.push({ videoId, error: "Video not found." });
        continue;
      }
      
      const playlist = await Playlist.findById(video.listId);
      if (playlist) {
        playlist.totalHours.hours -=video.totalHours.hours;
        playlist.totalHours.minutes -= video.totalHours.minutes;
        playlist.totalHours.seconds -= video.totalHours.seconds;

        // Normalize values
        playlist.totalHours.minutes += Math.floor(playlist.totalHours.seconds / 60);
        playlist.totalHours.seconds %= 60;
        playlist.totalHours.hours += Math.floor(playlist.totalHours.minutes / 60);
        playlist.totalHours.minutes %= 60;
playlist.numberOfVideos-=1;
        await playlist.save();
        
      }
      await updateTopicTime(video.topicId, video.totalHours, 'subtract');
      const topic = await Topic.findById(video.topicId);
      topic.actualHours.hours=topic.totalHours.hours;
      topic.actualHours.minutes=topic.totalHours.minutes;
      topic.actualHours.seconds= topic.totalHours.seconds;
      topic.actualNumberOfVideos-=1;
      await Video.deleteOne(video);
      await topic.save();
     
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


exports.videoAvailability = async (req, res) => {
  try {
    const { videos } = req.body;
    
    if (!Array.isArray(videos) || videos.length === 0) {
      return res.status(400).json({ error: "An array of video URLs is required." });
    }

    let availableVideos = [];
    let notAvailableVideos = [];

    for (const url of videos) {
      try {
          // Check if video already exists
      const existedVideo = await Video.findOne({ url });
      if (existedVideo) {
       
        notAvailableVideos.push({ url, reason: "Video already exists." });
        continue;
      }
        // Fetch video details
        const videoDetails = await fetchVideoDetails(url);
        
        if (videoDetails && Object.keys(videoDetails).length > 0) {
          availableVideos.push({ url, title: videoDetails.title });
        } else {
          notAvailableVideos.push({ url, reason: "Invalid or non-existent video." });
        }
      } catch (error) {
        notAvailableVideos.push({ url, reason: "Error fetching details." });
      }
    }

    return res.status(200).json({
      message: "Video availability check completed.",
      availableVideos,
      notAvailableVideos,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};


const updateTopicTime = async (topicId, videoTime, operation) => {
  try {
      const topic = await Topic.findById(topicId);
      if (!topic) return;

      let totalSeconds = 
          topic.totalHours.hours * 3600 + 
          topic.totalHours.minutes * 60 + 
          topic.totalHours.seconds;

      let videoSeconds = 
          videoTime.hours * 3600 + 
          videoTime.minutes * 60 + 
          videoTime.seconds;

      if (operation === 'add') {
          totalSeconds += videoSeconds;
          topic.numberOfVideos+=1;
      } else if (operation === 'subtract') {
          totalSeconds -= videoSeconds;
          totalSeconds = Math.max(0, totalSeconds); // Prevent negative time
          topic.numberOfVideos--;
      }

      topic.totalHours.hours = Math.floor(totalSeconds / 3600);
      totalSeconds %= 3600;
      topic.totalHours.minutes = Math.floor(totalSeconds / 60);
      topic.totalHours.seconds = totalSeconds % 60;
 
      await topic.save();
  } catch (err) {
      console.error('Error updating topic time:', err);
  }
};

async function updatePlaylistTime(playlistId, videoTime, operation){
  try {
    const list = await Playlist.findById(playlistId);
    if (!list) return;

    let totalSeconds = 
    list.totalHours.hours * 3600 + 
    list.totalHours.minutes * 60 + 
    list.totalHours.seconds;

    let videoSeconds = 
        videoTime.hours * 3600 + 
        videoTime.minutes * 60 + 
        videoTime.seconds;

    if (operation === 'add') {
        totalSeconds += videoSeconds;
        list.numberOfVideos+=1;
    } else if (operation === 'subtract') {
        totalSeconds -= videoSeconds;
        totalSeconds = Math.max(0, totalSeconds); // Prevent negative time
        list.numberOfVideos--;
    }

    list.totalHours.hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    list.totalHours.minutes = Math.floor(totalSeconds / 60);
    list.totalHours.seconds = totalSeconds % 60;

    await list.save();
} catch (err) {
    console.error('Error updating topic time:', err);
}
}