const Topic = require('../../models/topic');
const Admin = require('../../models/admin');
const Playlist = require('../../models/playlist');
const Video = require('../../models/video');

const { fetchVideoDetails, fetchPlaylistDetails } = require("../../services/youtubeService");

exports.addplaylists = async (req, res, next) => {
  try {
    const { urls, topicName } = req.body;
    
    const topic = await Topic.findOne({ name: topicName });
    if (!topic) {
      return res.status(404).json({ error: "The topic was not found." });
    }

    let addedPlaylists = [];
    let notAddedPlaylists = [];

    for (const url of urls) {
      const existingList = await Playlist.findOne({ url: url });
      if (existingList) {
        notAddedPlaylists.push({ url, reason: "Already exists" });
        continue;
      }

      try {
        const { title, description, thumbnailUrl, videos, totalDuration } = await fetchPlaylistDetails(url);
        
        const listItem = new Playlist({
          title,
          description,
          thumbnailUrl,
          numberOfVideos: videos.length,
          totalHours: totalDuration,
          url
        });
        
        const savedList = await listItem.save();

        for (const video of videos) {
          let videoCheck = await Video.findOne({ url: video.videoUrl });
          if (videoCheck) {
            savedList.video.push(videoCheck);
            continue;
          }

          try {
            const videoDetails = await fetchVideoDetails(video.videoUrl);
            if (JSON.stringify(videoDetails) === "{}") {
       
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
        topic.playlist.push(savedList);

        topic.totalHours.hours+=savedList.totalHours.hours;
        topic.totalHours.minutes+=savedList.totalHours.minutes;
        topic.totalHours.seconds+=savedList.totalHours.seconds
    

        topic.totalHours.minutes += Math.floor(topic.totalHours.seconds / 60);
        topic.totalHours.seconds %= 60;
        
        topic.totalHours.hours += Math.floor(topic.totalHours.minutes / 60);
        topic.totalHours.minutes %= 60;
    
        
        topic.markModified("totalHours");
        
    

  topic.numberOfVideos+=savedList.numberOfVideos;

        addedPlaylists.push({ url, title });
      } catch (error) {
        notAddedPlaylists.push({ url, reason: "Failed to fetch playlist details" });
      }
    }
    
    await topic.save();
    return res.status(200).json({ message: "Playlists processing completed", addedPlaylists, notAddedPlaylists });
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
