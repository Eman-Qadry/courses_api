

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
  "name": "Topic Name"  
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
            "totalHours": 0,
            "video": [],
            "playlist": [],
            "_id": "6799495109bc945ddf4d7d56",
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
            "_id": "678ca02e5534b03c819d2656",
            "name": "sounds",
            "numberOfVideos": 0,
            "totalHours": 0,
            "video": [
                "678fd42952ebea1027c07e54",
                "678fdd920a206bf06ee776ac",
                "6791372e5c46fdb9518e43f3",
                "67914fcc232ddc5bc0afb7db"
            ],
            "playlist": [
                "67914c09cd4f9c6cf0feaa76",
                "67914d42e5d468f584175aa7"
            ],
            "__v": 3
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

## Future Enhancements  
- Add pagination and sorting when retrieving topics.  
- Implement bulk operations for managing multiple topics simultaneously.  
- Include metrics like topic popularity or usage statistics.  

---

