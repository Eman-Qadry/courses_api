const axios = require('axios');
const { extractVideoId, extractPlaylistId } = require('../utils/exetractID');
const {convertDurationToHour,isoDurationToSeconds} = require('../utils/helpers');

// Fetch video details
const fetchVideoDetails = async function (url) {
  const videoId = extractVideoId(url);

  if (!videoId) throw new Error("Invalid video URL");

  const options = {
    method: 'GET',
    url: process.env.rapidapi_VIDEOURL,
    params: {
      id: videoId,
      key: process.env.x_rapidapi_key,
      part: 'snippet,contentDetails',
    },
    headers: {
      'x-rapidapi-host': process.env.x_rapidapi_host,
      'x-rapidapi-key': process.env.x_rapidapi_key,
    },
  };

  try {
    const response = await axios.request(options);
    const videoDetails = response.data.items[0];
    if (!videoDetails) {
      return {};
    }

    const title = videoDetails.snippet.title;
    const description = videoDetails.snippet.description;
    const thumbnailUrl = videoDetails.snippet.thumbnails.high.url;
    const isoDuration = videoDetails.contentDetails.duration;
    const duration = convertDurationToHour(isoDuration);

    return { title, description, thumbnailUrl, duration };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Fetch playlist details
const fetchPlaylistDetails = async function (url) {
  const playlistId = extractPlaylistId(url);
  if (!playlistId) throw new Error("Invalid playlist URL");

  const playlistOptions = {
    method: 'GET',
    url: process.env.rapidapi_LISTURL,
    params: {
      id: playlistId,
      key: process.env.x_rapidapi_key,
      part: 'snippet,contentDetails',
    },
    headers: {
      'x-rapidapi-host': process.env.x_rapidapi_host,
      'x-rapidapi-key': process.env.x_rapidapi_key,
    },
  };

  try {
    // Fetch playlist metadata
    const playlistResponse = await axios.request(playlistOptions);
    const playlistDetails = playlistResponse.data.items[0];
    if (!playlistDetails){
      return {};
    }

    const title = playlistDetails.snippet.title;
    const description = playlistDetails.snippet.description;
    const thumbnailUrl = playlistDetails.snippet.thumbnails.high.url;

    // Fetch all videos in the playlist
    const videos = [];
    let totalDuration= {
      hours:0,minutes:0,seconds:0
    };
    let nextPageToken = null;

    do {
      const videoOptions = {
        method: 'GET',
        url: 'https://youtube-data-api-v33.p.rapidapi.com/playlistItems',
        params: {
          playlistId: playlistId,
          key: process.env.x_rapidapi_key,
          part: 'snippet,contentDetails',
          maxResults: 50,
          pageToken: nextPageToken,
        },
        headers: {
          'x-rapidapi-host': process.env.x_rapidapi_host,
          'x-rapidapi-key': process.env.x_rapidapi_key,
        },
      };

      const videoResponse = await axios.request(videoOptions);
      const items = videoResponse.data.items;

      for(const item of items) {
        const videoId = item.contentDetails.videoId;
        
        const videoDetails = await fetchVideoDetails(`https://www.youtube.com/watch?v=${videoId}`);
       
        if (JSON.stringify(videoDetails) === '{}'){
          continue
        }
        
        videos.push({
          videoId,
          description: videoDetails.description,
          videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
          videoTitle: videoDetails.title,
          videoThumbnail: videoDetails.thumbnailUrl,
          duration: videoDetails.duration,
        });
       
        totalDuration.hours+=videoDetails.duration.hours;
        totalDuration.minutes+=videoDetails.duration.minutes;
        totalDuration.seconds+=videoDetails.duration.seconds
      };

      nextPageToken = videoResponse.data.nextPageToken;
    } while (nextPageToken);

  // Normalize totalDuration object
totalDuration.minutes += Math.floor(totalDuration.seconds / 60); // Add extra minutes from seconds
totalDuration.seconds = totalDuration.seconds % 60; // Keep remaining seconds within 0-59

totalDuration.hours += Math.floor(totalDuration.minutes / 60); // Add extra hours from minutes
totalDuration.minutes = totalDuration.minutes % 60; // Keep remaining minutes within 0-59


    return {
      title,
      description,
      thumbnailUrl,
      videos,
      totalDuration,
    };
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};



const checklistAvailability = async function (url) {
  const playlistId = extractPlaylistId(url);
  if (!playlistId) throw new Error("Invalid playlist URL");

  const playlistOptions = {
    method: 'GET',
    url: process.env.rapidapi_LISTURL,
    params: {
      id: playlistId,
      key: process.env.x_rapidapi_key,
      part: 'snippet,contentDetails',
    },
    headers: {
      'x-rapidapi-host': process.env.x_rapidapi_host,
      'x-rapidapi-key': process.env.x_rapidapi_key,
    },
  };

  try {
    // Fetch playlist metadata
    const playlistResponse = await axios.request(playlistOptions);
    const playlistDetails = playlistResponse.data.items[0];
    if (!playlistDetails) {
      return {};
    }

    const title = playlistDetails.snippet.title;
    const description = playlistDetails.snippet.description;
    const thumbnailUrl = playlistDetails.snippet.thumbnails.high.url;

  

    return {
      title,
      description,
      thumbnailUrl
    };
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};


module.exports = { fetchVideoDetails, fetchPlaylistDetails ,checklistAvailability};
