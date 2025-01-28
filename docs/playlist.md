# Playlist Management Module Documentation

## Overview
This module provides functionalities to manage playlists in the course management system. It includes adding playlists, checking their availability, and associating them with topics and videos.

---

## Models

### Playlist Model (`Playlist`)
The `Playlist` model represents a playlist entity with metadata and associated videos.

#### Fields:
- `title`: (String) - Title of the playlist (required).
- `url`: (String) - Unique URL of the playlist (required).
- `description`: (String, optional) - Description of the playlist.
- `thumbnailUrl`: (String, optional) - URL of the playlist thumbnail.
- `numberOfVideos`: (Number) - Number of videos in the playlist (default: `0`).
- `totalHours`: (Object) - Total duration of the playlist (default: `{}`).
- `isRecommended`: (Boolean) - Indicates if the playlist is recommended (default: `false`).
- `video`: (Array) - List of associated video IDs (references `Video` model).
- `lastChecked`: (Date) - Timestamp of the last availability check (default: `Date.now`).
- `isValid`: (Boolean) - Indicates if the playlist is still valid (default: `true`).
- `topicId`: (ObjectId) - Reference to the associated topic (`Topic` model).

---

## API Endpoints (Swagger Documentation)

### Playlist Management Endpoints

#### **1. Add Playlist**
`POST /api/admin/playlists`

Adds a new playlist and associates its videos with a topic.

**Request Body:**
```json
{
  "url": "https://playlist.url",
  "topicName": "JavaScript Basics"
}
```

**Responses:**
- `200 OK` - Playlist added successfully.
- `400 Bad Request` - Missing or invalid `url` or `topicName`.
- `404 Not Found` - Specified topic not found.
- `500 Internal Server Error` - Error while saving playlist or associated videos.

---

#### **2. Check Playlist Availability**
`POST /api/admin/playlists/isAvailable`

Checks if a playlist is still available on YouTube.

**Request Body:**
```json
{
  "url": "https://playlist.url"
}
```

**Responses:**
- `200 OK` - Playlist is available and returns details.
- `400 Bad Request` - Missing or invalid `url`.
- `404 Not Found` - Playlist not found or deleted on YouTube.
- `500 Internal Server Error` - Error while checking playlist availability.

---

## Dependencies
This module relies on:
- **Mongoose** - For MongoDB interactions.
- **axios** - For API requests to fetch playlist details.
- **bcrypt** - For security in related operations.
- **YouTube API** - For fetching playlist and video details.
- **express-validator** - For input validation in API requests.

---

## Security Considerations
- **Input Validation:** Ensures that `url` and `topicName` are valid and sanitized before processing.
- **Error Handling:** Provides descriptive error messages for all edge cases.
- **YouTube API Interaction:** Validates data fetched from external services to avoid inconsistencies.

---

## Future Enhancements
- Add bulk playlist addition functionality.
- Implement advanced playlist filters (e.g., duration, number of videos, etc.).
- Integrate user-specific playlist recommendations.
- Add functionality to handle private playlists with authentication.

---

