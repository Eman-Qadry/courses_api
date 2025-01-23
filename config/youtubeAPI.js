const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json()); // Parse incoming JSON requests

// Helper function to extract video or playlist ID
function extractYouTubeId(url) {
  const videoRegex = /(?:v=|\/)([0-9A-Za-z_-]{11})(?:\?|&|$)/;
  const playlistRegex = /[?&]list=([0-9A-Za-z_-]+)/;
  const videoMatch = url.match(videoRegex);
  const playlistMatch = url.match(playlistRegex);

  return {
    videoId: videoMatch ? videoMatch[1] : null,
    playlistId: playlistMatch ? playlistMatch[1] : null,
  };
}

// Helper function to convert ISO 8601 duration to hours
function convertDurationToHours(duration) {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;

  return (hours + minutes / 60 + seconds / 3600).toFixed(2); // Returns hours in decimal format
}

// API Endpoint
app.post("/youtube/details", async (req, res) => {
  const { url, type } = req.body;

  if (!url || !type) {
    return res.status(400).json({ error: "URL and type are required." });
  }

  // Extract video or playlist ID
  const { videoId, playlistId } = extractYouTubeId(url);

  try {
    let data;
    const API_KEY = "YOUR_YOUTUBE_API_KEY"; // Replace with your YouTube Data API Key

    if (type === "Single Video" && videoId) {
      // Fetch video details
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${API_KEY}`
      );
      const video = response.data.items[0];
      data = {
        title: video.snippet.title,
        hours: convertDurationToHours(video.contentDetails.duration),
        image: video.snippet.thumbnails.high.url,
      };
    } else if (type === "Playlist" && playlistId) {
      // Fetch playlist details
      const playlistResponse = await axios.get(
        `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${API_KEY}`
      );
      const playlist = playlistResponse.data.items[0];

      // Fetch playlist items to calculate total hours
      let totalHours = 0;
      let nextPageToken = "";
      let videoCount = 0;

      do {
        const itemsResponse = await axios.get(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=${playlistId}&maxResults=50&pageToken=${nextPageToken}&key=${API_KEY}`
        );

        videoCount += itemsResponse.data.items.length;

        for (const item of itemsResponse.data.items) {
          const videoDetailsResponse = await axios.get(
            `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${item.contentDetails.videoId}&key=${API_KEY}`
          );
          const videoDetails = videoDetailsResponse.data.items[0];
          totalHours += parseFloat(
            convertDurationToHours(videoDetails.contentDetails.duration)
          );
        }

        nextPageToken = itemsResponse.data.nextPageToken || null;
      } while (nextPageToken);

      data = {
        title: playlist.snippet.title,
        image: playlist.snippet.thumbnails.high.url,
        numberOfVideos: videoCount,
        hours: totalHours.toFixed(2), // Total hours in decimal format
      };
    } else {
      return res.status(400).json({ error: "Invalid YouTube URL or type." });
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch YouTube data.", details: error.message });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
