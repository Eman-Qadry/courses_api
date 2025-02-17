const Topic = require("../../models/topic");
const Playlist=require("../../models/playlist");
const Video=require("../../models/video")
exports.getAllTopics = async (req, res) => {
  try {
    const topics = await Topic.find().select(" _id name numberOfVideos totalHours");
    res.status(200).json({ message:"topics information "
        ,topics });
  } catch (error) {
    res.status(500).json({ error: "Error fetching topics.", details: error.message });
  }
};


exports.getTopicById = async (req, res) => {
    try {
      const topic = await Topic.findById(req.params.id)
      .select(" _id name numberOfVideos totalHours")// Select only necessary fields from Topic
        .populate({
          path: "video",
          match: { isActive: true, isValid: true },
          
        
        })
        .populate({
          path: "playlist",
          match: {  isValid: true },
          select: "_id title thumbnailUrl numberOfVideos totalHours", // Fetch required fields (videos to calculate count)
        });
  
      if (!topic) {
        return res.status(404).json({ error: "Topic not found." });
      }
  
      // Format the playlist data with video count
      
      res.status(200).json({
        topic
      });
    } catch (error) {
      res.status(500).json({ error: "Error fetching topic.", details: error.message });
    }
  };
  

  
  exports.getPlaylistById = async (req, res) => {
    try {
      const playlist = await Playlist.findById(req.params.listID)
        .populate({
          path: "video",
          match: { isActive: true, isValid: true}, // Fetch only active and valid videos
        });
  
      if (!playlist) {
        return res.status(404).json({ error: "Playlist not found." });
      }
  
      res.status(200).json({ playlist });
    } catch (error) {
      res.status(500).json({ error: "Error fetching playlist.", details: error.message });
    }
  };
  



  exports.getvideoById = async (req, res) => {
    try {
      const video = await Video.findById(req.params.videoID);
      if (!video) {
        return res.status(404).json({ error: "video not found." });
      }
  
      res.status(200).json({ video });

    }
    catch (error) {
      res.status(500).json({ error: "Error fetching video.", details: error.message });
    }
  };