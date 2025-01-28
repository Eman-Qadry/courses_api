
const Video=require('../models/video');
const playlist=require('../models/playlist');
exports.syncPlaylistVideos = async (req, res) => {
    try {
      // Fetch all playlists from the database
      const playlists = await playlist.find().populate("video");
  
      if (playlists.length === 0) {
     return ;
      }
  
      const syncResults = [];
  
      // Loop through all playlists to check for updates
      for (const savedPlaylist of playlists) {
        // Fetch updated playlist details from YouTube
        const { videos: youtubeVideos } = await fetchPlaylistDetails(savedPlaylist.url);
  
        if (!youtubeVideos) {
          syncResults.push({
            playlistId: savedPlaylist._id,
            isValid:false
          });
          continue;
        }
  
        // Compare videos
        const youtubeVideoUrls = youtubeVideos.map((video) => video.videoUrl);
        const dbVideoUrls = savedPlaylist.video.map((video) => video.url);
  
        // Find new videos
        const newVideos = youtubeVideos.filter((video) => !dbVideoUrls.includes(video.videoUrl));
  
        // Find missing videos
        const missingVideos = savedPlaylist.video.filter((video) => !youtubeVideoUrls.includes(video.url));
  
        // Add new videos to the database
        for (const video of newVideos) {
          const newVideo = new Video({
            title: video.videoTitle,
            url: video.videoUrl,
            description: video.description,
            thumbnailUrl: video.videoThumbnail,
            isActive: true,
            totalHours: video.duration,
            topicId: savedPlaylist.topicId,
            listId: savedPlaylist._id,
          });
  
          await newVideo.save();
          savedPlaylist.video.push(newVideo);
        }
  
        // Remove missing videos from the database
        for (const missingVideo of missingVideos) {
          await Video.deleteOne({ _id: missingVideo._id });
          savedPlaylist.video = savedPlaylist.video.filter(
            (video) => video._id.toString() !== missingVideo._id.toString()
          );
        }
  
        // Save the updated playlist
        await savedPlaylist.save();
  
        // Add sync result for the playlist
        syncResults.push({
          playlistId: savedPlaylist._id,
          playlistTitle: savedPlaylist.title,
          newVideos: newVideos.length,
          missingVideos: missingVideos.length,
        });
      }
  
      return res.status(200).json({
        message: "All playlists synced successfully.",
        syncResults,
      });
    } catch (error) {
      console.error("Error syncing playlists:", error);
      return res.status(500).json({ error: "Error syncing playlists." });
    }
  };
  