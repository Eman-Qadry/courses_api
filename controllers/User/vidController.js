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