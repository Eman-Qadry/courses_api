
## API Endpoints  

### message Endpoints  

#### **1. Get all messages**  
`GET /api/v1/admin/messages`  

Registers a new topic in the system.  


```  

**Responses:**  
- `200 OK` - messages are fetched successfully.  
{
    "message": "messages are fetched successfully",
    "data": {
        "messages": [
            {
                "_id": "679e75d69a1e0d93e2e85232",
                "fullName": "emanQadry",
                "email": "emanqadry24@gmail",
                "message": "your website is very ",
                "__v": 0
            },
            {
                "_id": "679e75da9a1e0d93e2e85234",
                "fullName": "emanQadry",
                "email": "emanqadry24@gmail",
                "message": "your website is very ",
                "__v": 0
            }
        ]
    }
}

- `500 Internal Server Error` - Error occurred while getting messages.  
