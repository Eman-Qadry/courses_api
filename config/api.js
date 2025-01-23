


// else if (type === "Playlist" && playlistId) {
//   // Fetch playlist details
//   const playlistResponse = await axios.get(
//     `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${API_KEY}`
//   );
//   const playlist = playlistResponse.data.items[0];

//   // Fetch playlist items to calculate total hours
//   let totalHours = 0;
//   let nextPageToken = "";
//   let videoCount = 0;

//   do {
//     const itemsResponse = await axios.get(
//       `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=${playlistId}&maxResults=50&pageToken=${nextPageToken}&key=${API_KEY}`
//     );

//     videoCount += itemsResponse.data.items.length;

//     for (const item of itemsResponse.data.items) {
//       const videoDetailsResponse = await axios.get(
//         `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${item.contentDetails.videoId}&key=${API_KEY}`
//       );
//       const videoDetails = videoDetailsResponse.data.items[0];
//       totalHours += parseFloat(
//         convertDurationToHours(videoDetails.contentDetails.duration)
//       );
//     }

//     nextPageToken = itemsResponse.data.nextPageToken || null;
//   } while (nextPageToken);

//   data = {
//     title: playlist.snippet.title,
//     image: playlist.snippet.thumbnails.high.url,
//     numberOfVideos: videoCount,
//     hours: totalHours.toFixed(2), // Total hours in decimal format
//   };
// } else {
//   return res.status(400).json({ error: "Invalid YouTube URL or type." });
// }

// res.json({ success: true, data });
// } catch (error) {
// res.status(500).json({ error: "Failed to fetch YouTube data.", details: error.message });
// }