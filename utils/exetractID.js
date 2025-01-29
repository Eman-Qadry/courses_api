 
      function  extractVideoId(url) {
    const videoIdRegex = /(?:v=|\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(videoIdRegex);
    return match ? match[1] : null; // Returns the video ID or null if not found
  }
  
  

function  extractPlaylistId (url) {
    const playlistIdRegex = /[?&]list=([a-zA-Z0-9_-]+)/;
    const match = url.match(playlistIdRegex);
  
    return match ? match[1] : null; // Returns the playlist ID or null if not found
  }
  
 
  module.exports={extractVideoId,extractPlaylistId}