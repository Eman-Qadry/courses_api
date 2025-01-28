const { fetchVideoDetails } = require("./youtubeService");
const Video = require("../models/video");

const validateVideos = async () => {
  try {
    const videos = await Video.find(); // Fetch all videos

    for (const video of videos) {
      const videoDetails = await fetchVideoDetails(video.url);
      
      if (!videoDetails || !videoDetails.thumbnailUrl) {
        // Mark video as invalid
        video.isValid = false;
        video.thumbnailUrl = null;
      } else {
        // Update with valid data
        video.isValid = true;
        video.thumbnailUrl = videoDetails.thumbnailUrl;
      }

      // Save changes to the database
      await video.save();
    }

    console.log("Video validation completed.");
  } catch (error) {
    console.error("Error during video validation:", error);
  }
};

module.exports = validateVideos;
