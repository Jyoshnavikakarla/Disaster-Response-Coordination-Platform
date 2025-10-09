# Disaster Response Coordination Platform - API Specification




## Victims

### 1. Get All Victims
**Endpoint:** `GET /victims`  
**Response:**
```json
[
  {
    "id": "v_001",
    "name": "John Doe",
    "location": "Sector 7",
    "contact": "9876543210",
    "helpType": "Medical",
    "status": "Pending"
  }
]

