const Topic = require('../../models/topic');
const Admin = require('../../models/admin');
const Playlist = require('../../models/playlist');
const Video = require('../../models/video');

const { fetchVideoDetails, fetchPlaylistDetails } = require("../../services/youtubeService");

exports.addPlaylists = async (req, res, next) => {
  try {
    const { playlists } = req.body; // Expecting an array of { url, topicName }

    if (!Array.isArray(playlists) || playlists.length === 0) {
      return res.status(400).json({ error: "Playlists array is required." });
    }

    let addedPlaylists = [];
    let notAddedPlaylists = [];

    for (const { url, topicName } of playlists) {
      try {
        // Check if the topic exists
        const topic = await Topic.findOne({ name: topicName });
        if (!topic) {
          notAddedPlaylists.push({ url, topicName, reason: "Topic not found" });
          continue;
        }

        // Check if the playlist already exists
        const existingList = await Playlist.findOne({ url });
        if (existingList) {
          notAddedPlaylists.push({ url, topicName, reason: "Playlist already exists" });
          continue;
        }

        // Fetch playlist details
        const { title, description, thumbnailUrl, videos, totalDuration } = await fetchPlaylistDetails(url);
        if (!title || !videos.length) {
          notAddedPlaylists.push({ url, topicName, reason: "Invalid playlist details" });
          continue;
        }

        // Create and save the playlist
        const newPlaylist = new Playlist({
          title,
          description,
          thumbnailUrl,
          numberOfVideos: videos.length,
          totalHours: totalDuration,
          url
        });

        const savedList = await newPlaylist.save();

        // Process videos inside the playlist
        for (const video of videos) {
          let videoCheck = await Video.findOne({ url: video.videoUrl });
          if (videoCheck) {
            savedList.video.push(videoCheck);
            continue;
          }

          try {
            const videoDetails = await fetchVideoDetails(video.videoUrl);
            if (!videoDetails || JSON.stringify(videoDetails) === "{}") {
              continue;
            }

            let newVideo = new Video({
              title: videoDetails.title,
              url: video.videoUrl,
              description: videoDetails.description,
              thumbnailUrl: videoDetails.thumbnailUrl,
              isActive: true,
              totalHours: videoDetails.duration,
              topicId: topic._id,
              listId: savedList._id
            });

            await newVideo.save();
            savedList.video.push(newVideo);
          } catch (error) {
            console.error(`Failed to fetch video details for ${video.videoUrl}:`, error);
          }
        }

        await savedList.save();
        topic.playlist.push(savedList._id);

        // Update topic details
        topic.totalHours.hours += savedList.totalHours.hours;
        topic.totalHours.minutes += savedList.totalHours.minutes;
        topic.totalHours.seconds += savedList.totalHours.seconds;

        // Normalize time values
        topic.totalHours.minutes += Math.floor(topic.totalHours.seconds / 60);
        topic.totalHours.seconds %= 60;
        topic.totalHours.hours += Math.floor(topic.totalHours.minutes / 60);
        topic.totalHours.minutes %= 60;

        topic.numberOfVideos += savedList.numberOfVideos;
        topic.markModified("totalHours");
        await topic.save();

        addedPlaylists.push({ url, topicName, title });
      } catch (error) {
        
        notAddedPlaylists.push({ url, topicName, reason: "Failed to process playlist" });
      }
    }

    return res.status(200).json({
      message: "Playlists processing completed",
      addedPlaylists,
      notAddedPlaylists
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

exports.checkPlaylistAvailability = async (req, res) => {
  try {
    const { urls } = req.body;
    
    let availablePlaylists = [];
    let notFoundPlaylists = [];
    
    for (const url of urls) {
      try {
        const playlistDetails = await fetchPlaylistDetails(url);
        if (playlistDetails) {
          availablePlaylists.push({ url, title: playlistDetails.title});
        } else {
          notFoundPlaylists.push({ url, reason: "Not found" });
        }
      } catch (error) {
        notFoundPlaylists.push({ url, reason: "Error fetching details" });
      }
    }

    return res.status(200).json({
      message: "Playlist availability check completed",
      availablePlaylists,
      notFoundPlaylists
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};
