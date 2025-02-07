const { extractVideoId, extractPlaylistId } = require('../utils/exetractID');
const axios = require("axios");
const Playlist = require("../models/playlist"); // Mongoose model for playlists
const Video = require("../models/video"); // Mongoose model for videos
const {rapidapiOptions}=require('../utils/rapidOptions');
const {convertDurationToHour}=require('../utils/helpers')
const Topic=require('../models/topic')
const RAPID_API_KEY = process.env.RAPID_API_KEY
const RAPID_API_HOST = process.env.RAPID_API_HOST  // Host for YouTube API via RapidAPI


const checkPlaylists=async function () {
    try {
        const playlists = await Playlist.find(); // Fetch all playlists from DB

        for (const playlist of playlists) {
           const playlistId=extractPlaylistId(playlist.url);
           console.log(playlistId)
           const playlistData = await getPlaylistAndVideos(playlistId);
console.log(playlistData)
            if (!playlistData) {
                // Playlist is deleted, deactivate it and its videos
                await Playlist.updateOne({ _id: playlist._id }, { isActive: false });
                await Video.updateMany({  listId: playlist._id }, { isActive: false });
                console.log(`Playlist ${playlist._id} and its videos have been deactivated.`);
                continue;
            }

            const externalVideos = playlistData.videos; // Videos from YouTube API
            const storedVideos = await Video.find({  listId: playlist._id });

            const storedVideoIds = new Set(storedVideos.map(video => extractVideoId(video.url)));

            for (const video of externalVideos) {
                if (!storedVideoIds.has(video.videoId)) {
                    // New video found, fetch its full details before storing
                    const videoDetails = await getVideoDetails(video.videoId);
                    if (videoDetails) {
                      
                
                    
                      // Save video
                      const video = new Video({
                        title: videoDetails.title,
                        url,
                        description: videoDetails.description,
                        thumbnailUrl: videoDetails.thumbnailUrl,
                        isActive: true,
                        totalHours: videoDetails.duration,
                        listId:playlist
                      });
                
                      const newVideo = await video.save();
                      playlist.video.push(newVideo._id);
                      // Apply the updates
                      playlist.totalHours.hours += newVideo.totalHours.hours;
                      playlist.totalHours.minutes += newVideo.totalHours.minutes;
                      playlist.totalHours.seconds += newVideo.totalHours.seconds;
                
                      // Normalize values
                      playlist.totalHours.minutes += Math.floor(playlist.totalHours.seconds / 60);
                      playlist.totalHours.seconds %= 60;
                      playlist.totalHours.hours += Math.floor(playlist.totalHours.minutes / 60);
                      playlist.totalHours.minutes %= 60;
                
              
                
                      // Save
                      await playlist.save();
                    }
                }
            }
        }
    } catch (error) {
        console.error("Error checking playlists:", error);
    }
}

// Function to get playlist details and its videos in ONE call
async function getPlaylistAndVideos(playlistId) {
    try {

    const options = {
        method: 'GET',
        url: 'https://youtube-data-api-v33.p.rapidapi.com/playlistItems',
        params: {
          playlistId: playlistId,
          key: process.env.x_rapidapi_key,
          part: 'snippet,contentDetails',
          maxResults: 50,
    
        },
        headers: {
          'x-rapidapi-host': process.env.x_rapidapi_host,
          'x-rapidapi-key': process.env.x_rapidapi_key,
        },
      };


        const response =  await axios.request(options);

        if (!response.data.items.length) return null; // Playlist is deleted

        return {
            videos: response.data.items.map(item => ({
                videoId: item.snippet.resourceId.videoId
            }))
        };
    } catch (error) {
        console.error(`Error fetching playlist ${playlistId}:`, error.response?.data || error.message);
        return null; // Assume deleted if error occurs
    }
}

// Function to fetch video details (only when new video is found)
async function getVideoDetails(videoId) {
    try {
       const options =  rapidapiOptions(process.env.rapidapi_VIDEOURL,videoId);
          const response = await axios.request(options);
     

        if (!response.data.items.length) return null;

        const video = response.data.items[0].snippet;
        const isoDuration =  response.data.items[0].contentDetails.duration;
        return {
            title: video.title,
            description: video.description,
            thumbnail: video.thumbnails.high.url,
           
            duration :convertDurationToHour(isoDuration)
        };
         
    } catch (error) {
        console.error(`Error fetching video ${videoId}:`, error.response?.data || error.message);
        return null;
    }
}


module.exports={checkPlaylists}