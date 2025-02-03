Sure! Here's your answer following the same style and format:

---

# Video Management Module Documentation

## Overview
This module handles video-related functionalities in the course management system. It includes adding, activating, deactivating, deleting, recommending, and retrieving video content.

## Models

### Video Model (`Video`)
The `Video` model represents a video entity with associated metadata and functionality.

#### Fields:
- `title`: (String) - Title of the video (required).
- `url`: (String) - Unique URL of the video (required, unique).
- `thumbnailUrl`: (String, optional) - URL of the video thumbnail.
- `isActive`: (Boolean) - Indicates if the video is active (default: `true`).
- `favourite`: (Boolean) - Indicates if the video is marked as favorite (default: `false`).
- `totalHours`: (Object) - Duration of the video.
- `description`: (String, optional) - Description of the video.
- `isRecommended`: (Boolean) - Indicates if the video is recommended (default: `false`).
- `topicId`: (ObjectId) - Reference to the related topic (`Topic` model).
- `listId`: (ObjectId) - Reference to the related playlist (`Playlist` model).
- `lastChecked`: (Date) - Timestamp of the last validity check (default: `Date.now`).
- `isValid`: (Boolean) - Indicates if the video is valid (default: `true`).

---

## API Endpoints (Swagger Documentation)

### Video Management Endpoints

#### **1. Add Videos**
`POST /api/v1/admin/videos/`

Adds a list of videos to the system.

**Request Body:**
```json
{
  "videos": [
    {
      "url": "https://youtu.be/NpqynQrkReU?si=7ScLYilCISOt1i5X",
      "topicName": "animate"
    },
    {
      "url": "https://youtu.be/2xXbwyVhMvM?si=p4eo3w51ZAdqQnBu",
      "topicName": "newTopic"
    }
  ]
}

```
**Responses:**
- `200 OK` - Videos added successfully.

    {
    "message": "Processing complete.",
    "addedVideos": [
        {
            "title": "“مين من ال sharks  جاهز انه يبقى جزء من مستقبل ال E Commerce”. [شارك تانك مصر]",
            "videoId": "679e250cdb43ee0f3e9cb6a8"
        }
    ],
    "errors": [
        {
            "url": "https://youtu.be/NpqynQrkReU?si=7ScLYilCISOt1i5X",
            "error": "Topic animate not found."
        }
    ]
}
- `400 Bad Request` - Missing or invalid input data.
{
    "message": "Processing complete.",
    "addedVideos": [],
    "errors": [
        {
            "url": "https://youtu.be/DdxrQV_bkkY?si=HDD5rU-ijQPW_n4x",
            "error": "Topic animate not found."
        }
    ]
}
- `500 Internal Server Error` - Error during video processing.

---

#### **2. Activate Videos**
`POST /api/v1/admin/videos/activate`

Activates one or more videos.

**Request Body:**
```json
{
  "videoIds": ["640ecf8f8d1b3e0012d3a3c1", "640ecf8f8d1b3e0012d3a3c2"]
}
```
**Responses:**
- `200 OK` - Videos activated successfully.
{
    "message": "Processing complete.",
    "updatedVideos": [
        {
            "favourite": false,
            "_id": "67914d43e5d468f584175aae",
            "title": "الفتاوى 1 5 2016 ؟ للشيخ مصطفى العدوي",
            "url": "https://www.youtube.com/watch?v=Kx1j5Zj1WkU",
            "thumbnailUrl": "https://i.ytimg.com/vi/Kx1j5Zj1WkU/hqdefault.jpg",
            "isActive": true,
            "totalHours": {
                "hours": 0,
                "minutes": 9,
                "seconds": 56
            },
            "description": "",
            "isRecommended": false,
            "topicId": "678ca02e5534b03c819d2656",
            "isValid": true,
            "lastChecked": "2025-01-22T19:55:47.011Z",
            "__v": 0
        },
        {
            "favourite": false,
            "_id": "67914d43e5d468f584175ab2",
            "title": "فتاوى 3 5 2016 الشيخ مصطفى العدوى ؟ للشيخ مصطفى العدوي",
            "url": "https://www.youtube.com/watch?v=tPKNq00Uk54",
            "thumbnailUrl": "https://i.ytimg.com/vi/tPKNq00Uk54/hqdefault.jpg",
            "isActive": true,
            "totalHours": {
                "hours": 0,
                "minutes": 5,
                "seconds": 54
            },
            "description": "الشيخ مصطفى العدوى\nyoutube.com/user/mostafaaladwy\nyoutube.com/user/ftawamostafaaladwy\ntelegram.me/mostafaaladwy\n🌴قناة الشيخ مصطفى العدوي للعلوم الشرعية✅\n👇👇👇👇👇👇👇👇👇\nhttps://telegram.me/mostafaaladwy\nقناة ينشر بها دروس ومحاضرات وخطب الشيخ حفظه الله\n🌴قناة الشيخ مصطفى العدوي للعلوم الشرعية✅\nقناة ينشر بها دروس ومحاضرات وخطب الشيخ حفظه الله",
            "isRecommended": false,
            "topicId": "678ca02e5534b03c819d2656",
            "isValid": true,
            "lastChecked": "2025-01-22T19:55:47.034Z",
            "__v": 0
        }
    ],
    "errors": []
}
- `400 Bad Request` - Missing or invalid video IDs.
{
    "message": "Processing complete.",
    "updatedVideos": [
        {
            "favourite": false,
            "_id": "67914d43e5d468f584175aae",
            "title": "الفتاوى 1 5 2016 ؟ للشيخ مصطفى العدوي",
            "url": "https://www.youtube.com/watch?v=Kx1j5Zj1WkU",
            "thumbnailUrl": "https://i.ytimg.com/vi/Kx1j5Zj1WkU/hqdefault.jpg",
            "isActive": true,
            "totalHours": {
                "hours": 0,
                "minutes": 9,
                "seconds": 56
            },
            "description": "",
            "isRecommended": false,
            "topicId": "678ca02e5534b03c819d2656",
            "isValid": true,
            "lastChecked": "2025-01-22T19:55:47.011Z",
            "__v": 0
        }
    ],
    "errors": [
        {
            "videoId": "678ca02e5534b03c819d2656",
            "error": "Video not found."
        }
    ]
}


or

{
    "message": "Processing complete.",
    "updatedVideos": [],
    "errors": [
        {
            "videoId": "67a11081b7851a912bba34e5",
            "error": "Video is already active"
        }
    ]
}
- `500 Internal Server Error` - Error during video activation.

---

#### **3. Deactivate Videos**
`POST /api/v1/admin/videos/deactivate`

Deactivates one or more videos.

**Request Body:**
```json
{
  "videoIds": ["640ecf8f8d1b3e0012d3a3c1"]
}
```
**Responses:**
- `200 OK` - Videos deactivated successfully.
{
    "message": "Processing complete.",
    "updatedVideos": [
        {
            "favourite": false,
            "_id": "67914d43e5d468f584175aae",
            "title": "الفتاوى 1 5 2016 ؟ للشيخ مصطفى العدوي",
            "url": "https://www.youtube.com/watch?v=Kx1j5Zj1WkU",
            "thumbnailUrl": "https://i.ytimg.com/vi/Kx1j5Zj1WkU/hqdefault.jpg",
            "isActive": false,
            "totalHours": {
                "hours": 0,
                "minutes": 9,
                "seconds": 56
            },
            "description": "",
            "isRecommended": false,
            "topicId": "678ca02e5534b03c819d2656",
            "isValid": true,
            "lastChecked": "2025-01-22T19:55:47.011Z",
            "__v": 0
        },
        {
            "favourite": false,
            "_id": "67914d43e5d468f584175ab2",
            "title": "فتاوى 3 5 2016 الشيخ مصطفى العدوى ؟ للشيخ مصطفى العدوي",
            "url": "https://www.youtube.com/watch?v=tPKNq00Uk54",
            "thumbnailUrl": "https://i.ytimg.com/vi/tPKNq00Uk54/hqdefault.jpg",
            "isActive": false,
            "totalHours": {
                "hours": 0,
                "minutes": 5,
                "seconds": 54
            },
            "description": "الشيخ مصطفى العدوى\nyoutube.com/user/mostafaaladwy\nyoutube.com/user/ftawamostafaaladwy\ntelegram.me/mostafaaladwy\n🌴قناة الشيخ مصطفى العدوي للعلوم الشرعية✅\n👇👇👇👇👇👇👇👇👇\nhttps://telegram.me/mostafaaladwy\nقناة ينشر بها دروس ومحاضرات وخطب الشيخ حفظه الله\n🌴قناة الشيخ مصطفى العدوي للعلوم الشرعية✅\nقناة ينشر بها دروس ومحاضرات وخطب الشيخ حفظه الله",
            "isRecommended": false,
            "topicId": "678ca02e5534b03c819d2656",
            "isValid": true,
            "lastChecked": "2025-01-22T19:55:47.034Z",
            "__v": 0
        }
    ],
    "errors": []
}
- `400 Bad Request` - Missing or invalid video IDs.
- `500 Internal Server Error` - Error during video deactivation.

---

#### **4. Delete Videos**
`DELETE /api/v1/admin/videos/`

Deletes one or more videos.

**Request Body:**
```json
{
  "videoIds": ["640ecf8f8d1b3e0012d3a3c1"]
}
```
**Responses:**
- `200 OK` - Videos deleted successfully.
{
    "message": "Processing complete.",
    "deletedVideos": [
        "67914d43e5d468f584175ad2"
    ],
    "errors": []
}
- `400 Bad Request` - Missing or invalid video IDs.
- `500 Internal Server Error` - Error during video deletion.

---

#### **5. Recommend Videos**
`POST /api/v1/admin/videos/recommend`

Marks one or more videos as recommended.

**Request Body:**
```json
{
  "videoIds": ["640ecf8f8d1b3e0012d3a3c1"]
}
```
**Responses:**
- `200 OK` - Videos marked as recommended successfully.
{
    "message": "Processing complete.",
    "recommendedVideos": [
        {
            "favourite": false,
            "_id": "67914d43e5d468f584175ad6",
            "title": "فتاوى 31 7 2016 ؟ للشيخ مصطفى العدوي",
            "url": "https://www.youtube.com/watch?v=PY0on7UQwgw",
            "thumbnailUrl": "https://i.ytimg.com/vi/PY0on7UQwgw/hqdefault.jpg",
            "isActive": true,
            "totalHours": {
                "hours": 0,
                "minutes": 4,
                "seconds": 10
            },
            "description": "",
            "isRecommended": true,
            "topicId": "678ca02e5534b03c819d2656",
            "isValid": true,
            "lastChecked": "2025-01-22T19:55:47.195Z",
            "__v": 0
        },
        {
            "favourite": false,
            "_id": "67914d43e5d468f584175aae",
            "title": "الفتاوى 1 5 2016 ؟ للشيخ مصطفى العدوي",
            "url": "https://www.youtube.com/watch?v=Kx1j5Zj1WkU",
            "thumbnailUrl": "https://i.ytimg.com/vi/Kx1j5Zj1WkU/hqdefault.jpg",
            "isActive": false,
            "totalHours": {
                "hours": 0,
                "minutes": 9,
                "seconds": 56
            },
            "description": "",
            "isRecommended": true,
            "topicId": "678ca02e5534b03c819d2656",
            "isValid": true,
            "lastChecked": "2025-01-22T19:55:47.011Z",
            "__v": 0
        }
    ],
    "errors": []
}
- `400 Bad Request` - Missing or invalid video IDs.
- `500 Internal Server Error` - Error during video recommendation.

---

#### **6. Remove Recommendation**
`POST /api/v1/admin/videos/not-recommend`

Removes the recommendation mark from one or more videos.

**Request Body:**
```json
{
  "videoIds": ["640ecf8f8d1b3e0012d3a3c1"]
}
```
**Responses:**
- `200 OK` - Recommendation removed successfully.
{
    "message": "Processing complete.",
    "notRecommendedVideos": [
        {
            "favourite": false,
            "_id": "67914d43e5d468f584175aae",
            "title": "الفتاوى 1 5 2016 ؟ للشيخ مصطفى العدوي",
            "url": "https://www.youtube.com/watch?v=Kx1j5Zj1WkU",
            "thumbnailUrl": "https://i.ytimg.com/vi/Kx1j5Zj1WkU/hqdefault.jpg",
            "isActive": false,
            "totalHours": {
                "hours": 0,
                "minutes": 9,
                "seconds": 56
            },
            "description": "",
            "isRecommended": false,
            "topicId": "678ca02e5534b03c819d2656",
            "isValid": true,
            "lastChecked": "2025-01-22T19:55:47.011Z",
            "__v": 0
        }
    ],
    "errors": []
}
- `400 Bad Request` - Missing or invalid video IDs.
- `500 Internal Server Error` - Error during operation.

---

#### **7. Get Videos**
`GET /api/v1/admin/videos/`
1- all videos
```json
{
    "message": "Videos fetched successfully.",
    "data": [
        {
        }
    ]
}

Fetches videos based on filters 

**Query Parameters:**
- `topicId` (optional) - Filter by topic ID.
- `isActive` (optional) - Filter by activation status (`true` or `false`).
- `isRecommended` (optional) - Filter by recommendation status (`true` or `false`).
- `hasThumbnail` (optional) - Filter by thumbnail presence (`true` or `false`).
- `deactivated` (optional) - Filter deactivated videos (`true` or `false`).


**Responses:**
- `200 OK` - Videos fetched successfully.
- `500 Internal Server Error` - Error during video retrieval.

---
#### **check availability**
`POST /api/v1/admin/videos/isAvailable`


**Request Body:**
```json
{
    "videos":[
       "https://youtu.be/DdxrQV_bkkY?si=HDD5rU-ijQPW_n4x"]
}
```
**Responses:**
- `200 OK` - 
{
    "message": "Video availability check completed.",
    "availableVideos": [
        {
            "url": "https://youtu.be/DdxrQV_bkkY?si=HDD5rU-ijQPW_n4x",
            "title": "فاهم 55 | سلسلة لازم تتحرر - (2) التحرر من التفاهة | مع الشيخ/ أمجد سمير"
        }
    ],
    "notAvailableVideos": []
}
- `400 Bad Request` - Missing or invalid input data.

- `500 Internal Server Error` - Error during video processing.

---

check availability of list of videos
`POST /api/v1/admin/videos/isAvailable`
**Request Body:**
```json
{
  "videos": ["https://youtu.be/C9mkzzAevzc?si=Vf19BSfx0l1Ju3Kg","https://youtu.be/encVmPEDy2k?si=j36RdU-ClU3LvaAt"]
}
```
**Responses:**
- `200 OK` - Videos added successfully.
{
    "message": "Video availability check completed.",
    "availableVideos": [
        {
            "url": "https://youtu.be/DdxrQV_bkkY?si=HDD5rU-ijQPW_n4x",
            "title": "فاهم 55 | سلسلة لازم تتحرر - (2) التحرر من التفاهة | مع الشيخ/ أمجد سمير"
        }
    ],
    "notAvailableVideos": []
}
   
- `400 Bad Request` - Missing or invalid input data.

- `500 Internal Server Error` - Error during video processing.

---

## Dependencies
This module relies on:
- **Mongoose** - For MongoDB interaction.
- **express-validator** - For validating request data.
- **YouTube API (or other services)** - For fetching video details.
- **Express** - For routing and middleware support.

---

## Security Considerations
- **Data Validation:** Ensures all inputs are sanitized and valid.
- **Error Handling:** Provides clear error responses to avoid ambiguity.
- **Access Control:** Routes are protected with authentication middleware.

---



