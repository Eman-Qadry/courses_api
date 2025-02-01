### **1. Documentation for User Functions (Topics & Playlists API)**  

#### **1.1 Get All Topics**  
**Endpoint:** `GET /api/v1/user/topics/`  
**Description:** Retrieves a list of all topics with their basic information.  
**Response:**  
- **200 OK:** Returns an array of topics.  
- **500 Internal Server Error:** If an error occurs while fetching topics.  

**Example Response:**  
```json
{
    "message": "topics information ",
    "topics": [
        {
            "_id": "678ca02e5534b03c819d2656",
            "name": "animat",
            "numberOfVideos": 0,
            "totalHours": {
                "hours": 0,
                "minutes": 0,
                "seconds": 0,
                "_id": "679e273998f68691974c5b67"
            }
        },
       
    ]
}
```

---

#### **1.2 Get Topic by ID**  
**Endpoint:** `GET /api/v1/user/topics/679e273998f68691974c5b67`  
**Description:** Retrieves details of a specific topic, including its videos and playlists.  
**Response:**  
- **200 OK:** Returns the topic with related videos and playlists.  
- **404 Not Found:** If the topic is not found.  
{
    "error": "Topic not found."
}
- **500 Internal Server Error:** If an error occurs while fetching the topic.  

**Example Response:**  
```json
{
  "topic": {
    "_id": "601c8b3e8b5e4b001f9a1a2b",
    "name": "Science",
    "numberOfVideos": 10,
    "totalHours": { "hours": 2, "minutes": 30, "seconds": 45 },
    "video": [
      {
        "_id": "679abc2f26759de7ef024acd",
                "title": "ما تغلطش غلطتي! 10 نصائح للمبتدئين في البرمجة",
                "url": "https://youtu.be/encVmPEDy2k?si=j36RdU-ClU3LvaAt",
                "thumbnailUrl": "https://i.ytimg.com/vi/encVmPEDy2k/hqdefault.jpg",
                "isActive": true,
                "favourite": false,
                "totalHours": {
                    "hours": 0,
                    "minutes": 8,
                    "seconds": 0
                },
                "isRecommended": false,
                "topicId": "678ca02e5534b03c819d2656",
                "isValid": true,
                "lastChecked": "2025-01-29T23:39:27.040Z",
                "__v": 0
      }
    ],
    "playlist": [
      {
        "_id": "67914d42e5d468f584175aa7",
                "title": "الفتاوى الواردة في المساجد",
                "thumbnailUrl": "https://i.ytimg.com/vi/PqnjFrWS4uE/hqdefault.jpg",
                "numberOfVideos": 63,
                "totalHours": {
                    "hours": 11,
                    "minutes": 56,
                    "seconds": 27
                }
      }
    ]
  }
}
```

---

#### **1.3 Get Playlist by ID**  
**Endpoint:** `GET /topics/:id/playlists/:listID`  
api/v1/user/topics/679ce91d162296c0dc064c82/playlists/679ce951162296c0dc064c89
**Description:** Retrieves details of a specific playlist, including its videos.  
**Response:**  
- **200 OK:** Returns the playlist details.  
- **404 Not Found:** If the playlist is not found.  
- **500 Internal Server Error:** If an error occurs while fetching the playlist.  

**Example Response:**  
```json
{
  "playlist": {
    "_id": "601c8b3e8b5e4b001f9a1a2d",
    "title": "Physics Basics",
    "video": [
      {
        "_id": "601c8b3e8b5e4b001f9a1a2e",
        "title": "Newton's Laws",
        "url": "https://example.com/video2"
      }
    ]
  }
}
```


#### ** send messages to admins **  
**Endpoint:** `POST /api/v1/user/sendMessage`  

**Description:** send messages to the admins  
**Response:**  
- **200 OK:** message sent successfully.  
- **404 Not Found:** missing any data .  
- **500 Internal Server Error:** If an error occurs while sending any message  

**Example Response:**  
```json
{
     "fullName":"emanQadry",
     "email":"emanqadry24@gmail.com", "message":"your website is very good" 
}
```
---

