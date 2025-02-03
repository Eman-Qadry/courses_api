

---

# Topic Management Module Documentation  

## Overview  
This module manages topic creation, retrieval, renaming, and deletion for the course management system. It provides APIs for administrators to handle topics efficiently.  

## Models  

### Topic Model (`Topic`)  
The `Topic` model represents a topic or category containing videos and playlists.  

#### Fields:  
- `name`: (String, required) - The name of the topic.  
- `numberOfVideos`: (Number, default: `0`) - Total number of videos associated with the topic.  
- `totalHours`: (Number, default: `0`) - Total duration of all videos in hours.  
- `video`: (Array of ObjectId, ref: `Video`) - A list of videos belonging to the topic.  
- `playlist`: (Array of ObjectId, ref: `Playlist`) - A list of playlists linked to the topic.  

#### Methods:  
None  

## API Endpoints  

### Topic Endpoints  

#### **1. Create a New Topic**  
`POST /api/v1/admin/topics/`  

Registers a new topic in the system.  

**Request Body:**  
```json  
{
    "name":"english"
}
```  

**Responses:**  
- `200 OK` - Topic created successfully.  
{
    "message": "Topic created successfully.",
    "data": {
        "topic": {
            "name": "english",
            "numberOfVideos": 0,
            "actualNumberOfVideos": 0,
            "video": [],
            "playlist": [],
            "_id": "67a10ce0755a4c02390c8cca",
            "actualHours": {
                "hours": 0,
                "minutes": 0,
                "seconds": 0,
                "_id": "67a10ce0755a4c02390c8ccb"
            },
            "totalHours": {
                "hours": 0,
                "minutes": 0,
                "seconds": 0,
                "_id": "67a10ce0755a4c02390c8ccc"
            },
            "__v": 0
        }
    }
}
- `400 Bad Request` - Invalid input or topic already exists.  
{
    "message": "Topic already exists.",
    "data": {}
}
- `500 Internal Server Error` - Error occurred while creating the topic.  

#### **2. Get All Topics**  
`GET /api/admin/topic`  

Retrieves all topics from the system.  

**Request Parameters:**  
None  

**Responses:**  
- `200 OK` - Successfully retrieved topics, returns a list of topics. 
{
    "message": "These are the topics.",
    "topics": [
        {
            "actualNumberOfVideos": 0,
            "_id": "678ca02e5534b03c819d2656",
            "name": "animat",
            "actualHours": {
                "hours": 0,
                "minutes": 0,
                "seconds": 0,
                "_id": "67a1153d6fbaabf26313c236"
            }
        },
     
        {
            "_id": "67a1105bb7851a912bba34df",
            "name": "wafaa",
            "actualNumberOfVideos": 3,
            "actualHours": {
                "hours": 1,
                "minutes": 56,
                "seconds": 9,
                "_id": "67a1105bb7851a912bba34e0"
            }
        }
    ]
}
- `400 Bad Request` - No topics found.  
- `500 Internal Server Error` - Error occurred while fetching topics.  

#### **3. Rename a Topic**  
`PUT /api/v1/admin/topics/`  

Renames an existing topic.  

**Request Body:**  
```json  
{  
   
  "newname": "animat"  ,
  "topicId":"678ca02e5534b03c819d2656"
}  
```  

**Responses:**  
- `200 OK` - Topic renamed successfully.  
{
    "message": "Topic renamed successfully.",
    "data": {}
}
- `400 Bad Request` - Invalid input or topic not found.  
{
    "errors": [
        {
            "type": "field",
            "value": "678ca02e5534b3c819d2656",
            "msg": "Invalid topic ID format. Must be a valid MongoDB ObjectId.",
            "path": "topicId",
            "location": "body"
        }
    ]
}
- `500 Internal Server Error` - Error occurred while renaming the topic.  

#### **4. Delete a Topic**  
`DELETE /api/v1/admin/topics/?topicId=6799495109bc945ddf4d7d56`  

Deletes a topic from the system.  

**Request Query Parameters:**  
```json  
{  
  
}  
query{
"topicId":"6799495109bc945ddf4d7d56" 
}
```  

**Responses:**  
- `200 OK` - Topic deleted successfully.  
{
    "message": "Topic deleted successfully.",
    "data": {}
}
- `400 Bad Request` - Invalid input or topic not found.  
{
    "message": "Topic does not exist.",
    "data": {}
}
- `500 Internal Server Error` - Error occurred while deleting the topic.  

## Dependencies  
This module relies on:  
- **Express** - For routing and handling HTTP requests.  
- **Mongoose** - For MongoDB database interaction.  
- **Express-Validator** - For validating API request inputs.  

## Security Considerations  
- **Input Validation:** All inputs are validated to prevent invalid or malicious data.  
- **Authentication Middleware:** Ensures only authorized users can manage topics.  
- **Error Handling:** Provides clear error responses for client-side debugging.  



