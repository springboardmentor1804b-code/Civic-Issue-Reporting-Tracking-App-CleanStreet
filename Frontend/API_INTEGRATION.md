# API Integration Guide for Civix-CleanStreet

## Overview
This document provides information about API integration setup and usage for the Civix-CleanStreet Frontend application.

## Setup Instructions

### 1. Environment Configuration

Create a `.env.local` file in the `Frontend` directory:

```
VITE_API_URL=http://localhost:5000/api
```

Update this URL to match your backend server address.

### 2. API Base URL

All API calls use the base URL from `VITE_API_URL` environment variable. If not set, it defaults to `http://localhost:5000/api`.

## API Modules

### Authentication API (`authAPI`)

#### Login
```javascript
import { authAPI } from './services/api';

authAPI.login(email, password)
  .then(response => {
    // response.token - JWT token
    // response.user - User object
    localStorage.setItem('token', response.token);
  })
  .catch(error => console.error(error));
```

**Endpoint:** `POST /auth/login`
**Body:** `{ email, password }`
**Returns:** `{ token, user }`

#### Signup
```javascript
authAPI.signup({
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  password: "SecurePass123!",
  role: "User"
})
  .then(response => {
    // Account created successfully
  })
  .catch(error => console.error(error));
```

**Endpoint:** `POST /auth/signup`
**Body:** `{ firstName, lastName, email, password, role }`
**Returns:** `{ message, user }`

#### Logout
```javascript
authAPI.logout()
  .then(() => {
    // Clear local token and user data
    localStorage.removeItem('token');
  })
  .catch(error => console.error(error));
```

**Endpoint:** `POST /auth/logout`
**Headers:** `Authorization: Bearer {token}`
**Returns:** `{ message }`

---

### Complaints API (`complaintsAPI`)

#### Get All Complaints
```javascript
complaintsAPI.getAll({ 
  status: 'pending',
  priority: 'High',
  type: 'Pothole'
})
  .then(data => {
    // data.data - Array of complaints
  })
  .catch(error => console.error(error));
```

**Endpoint:** `GET /complaints?{filters}`
**Query Parameters:** `status`, `priority`, `type`, `location`, `page`, `limit`
**Returns:** `{ data: [], total, page, limit }`

#### Get Single Complaint
```javascript
complaintsAPI.getById(complaintId)
  .then(complaint => {
    // Display complaint details
  })
  .catch(error => console.error(error));
```

**Endpoint:** `GET /complaints/{id}`
**Returns:** `{ id, title, type, priority, ... }`

#### Create Complaint
```javascript
complaintsAPI.create({
  title: "Pothole on Main Road",
  type: "Pothole",
  priority: "High",
  address: "123 Main St, City",
  description: "Large pothole causing accidents",
  fullDescription: "Detailed description...",
  latitude: 12.9716,
  longitude: 77.5946
})
  .then(response => {
    // Complaint created
    // response.id - New complaint ID
  })
  .catch(error => console.error(error));
```

**Endpoint:** `POST /complaints`
**Headers:** `Authorization: Bearer {token}`
**Body:** Complaint object
**Returns:** `{ id, message, complaint }`

#### Update Complaint
```javascript
complaintsAPI.update(complaintId, {
  status: "in-progress",
  priority: "Medium"
})
  .then(response => {
    // Complaint updated
  })
  .catch(error => console.error(error));
```

**Endpoint:** `PUT /complaints/{id}`
**Headers:** `Authorization: Bearer {token}`
**Body:** Updated fields
**Returns:** `{ message, complaint }`

#### Delete Complaint
```javascript
complaintsAPI.delete(complaintId)
  .then(response => {
    // Complaint deleted
  })
  .catch(error => console.error(error));
```

**Endpoint:** `DELETE /complaints/{id}`
**Headers:** `Authorization: Bearer {token}`
**Returns:** `{ message }`

#### Add Comment
```javascript
complaintsAPI.addComment(complaintId, "This issue needs urgent action")
  .then(response => {
    // Comment added
  })
  .catch(error => console.error(error));
```

**Endpoint:** `POST /complaints/{id}/comments`
**Headers:** `Authorization: Bearer {token}`
**Body:** `{ comment }`
**Returns:** `{ message, comment }`

#### Like Complaint
```javascript
complaintsAPI.like(complaintId)
  .then(response => {
    // Complaint liked
    // response.likes - Updated like count
  })
  .catch(error => console.error(error));
```

**Endpoint:** `POST /complaints/{id}/like`
**Headers:** `Authorization: Bearer {token}`
**Returns:** `{ likes, message }`

#### Dislike Complaint
```javascript
complaintsAPI.dislike(complaintId)
  .then(response => {
    // Complaint disliked
  })
  .catch(error => console.error(error));
```

**Endpoint:** `POST /complaints/{id}/dislike`
**Headers:** `Authorization: Bearer {token}`
**Returns:** `{ dislikes, message }`

---

### Profile API (`profileAPI`)

#### Get Profile
```javascript
profileAPI.getProfile()
  .then(user => {
    // Display user profile
  })
  .catch(error => console.error(error));
```

**Endpoint:** `GET /users/profile`
**Headers:** `Authorization: Bearer {token}`
**Returns:** `{ id, firstName, lastName, email, phone, ... }`

#### Update Profile
```javascript
profileAPI.updateProfile({
  firstName: "John",
  lastName: "Doe",
  phone: "9876543210",
  location: "Mysore",
  bio: "Civic volunteer"
})
  .then(response => {
    // Profile updated
  })
  .catch(error => console.error(error));
```

**Endpoint:** `PUT /users/profile`
**Headers:** `Authorization: Bearer {token}`
**Body:** Updated user fields
**Returns:** `{ message, user }`

#### Upload Profile Image
```javascript
const formData = new FormData();
formData.append('file', imageFile);

profileAPI.uploadProfileImage(formData)
  .then(response => {
    // response.imageUrl - URL of uploaded image
  })
  .catch(error => console.error(error));
```

**Endpoint:** `POST /users/profile/image`
**Headers:** `Authorization: Bearer {token}`
**Body:** FormData with file
**Returns:** `{ imageUrl, message }`

#### Get User Complaints
```javascript
profileAPI.getUserComplaints()
  .then(complaints => {
    // Array of user's complaints
  })
  .catch(error => console.error(error));
```

**Endpoint:** `GET /users/complaints`
**Headers:** `Authorization: Bearer {token}`
**Returns:** `{ data: [] }`

---

### Image API (`imageAPI`)

#### Upload Single Image
```javascript
imageAPI.upload(imageFile)
  .then(response => {
    // response.url - URL of uploaded image
  })
  .catch(error => console.error(error));
```

**Endpoint:** `POST /images/upload`
**Headers:** `Authorization: Bearer {token}`
**Body:** FormData with file
**Returns:** `{ url, fileSize, fileType }`

#### Upload Multiple Images
```javascript
imageAPI.uploadMultiple([file1, file2, file3])
  .then(response => {
    // response.urls - Array of uploaded image URLs
  })
  .catch(error => console.error(error));
```

**Endpoint:** `POST /images/upload-multiple`
**Headers:** `Authorization: Bearer {token}`
**Body:** FormData with multiple files
**Returns:** `{ urls: [], message }`

---

### Location API (`locationAPI`)

#### Get Address from Coordinates
```javascript
locationAPI.getAddressFromCoordinates(12.9716, 77.5946)
  .then(data => {
    // data.address - Address object
  })
  .catch(error => console.error(error));
```

**Note:** Uses OpenStreetMap Nominatim API (free, no authentication required)
**Returns:** `{ address: { road, city, country, ... }, ... }`

#### Get Coordinates from Address
```javascript
locationAPI.getCoordinatesFromAddress("Main Street, Mysore")
  .then(results => {
    // Array of location results
    // results[0] - { lat, lon, address, ... }
  })
  .catch(error => console.error(error));
```

**Note:** Uses OpenStreetMap Nominatim API
**Returns:** `[{ lat, lon, display_name, ... }]`

---

### Dashboard API (`dashboardAPI`)

#### Get Statistics
```javascript
dashboardAPI.getStats()
  .then(stats => {
    // stats.totalComplaints
    // stats.resolvedComplaints
    // stats.pendingComplaints
  })
  .catch(error => console.error(error));
```

**Endpoint:** `GET /dashboard/stats`
**Returns:** `{ totalComplaints, resolvedComplaints, pendingComplaints, byType: {} }`

#### Get Complaints Over Time
```javascript
dashboardAPI.getComplaintsOverTime()
  .then(data => {
    // data - Array of { date, count }
  })
  .catch(error => console.error(error));
```

**Endpoint:** `GET /dashboard/complaints-over-time`
**Returns:** `{ data: [{ date, count }] }`

---

## Error Handling

All API methods throw errors with descriptive messages:

```javascript
try {
  const response = await complaintsAPI.create(data);
} catch (error) {
  // error.message contains the error message
  console.error(error.message);
}
```

Common error responses:
- **400 Bad Request** - Invalid input data
- **401 Unauthorized** - Missing or invalid token
- **403 Forbidden** - User doesn't have permission
- **404 Not Found** - Resource not found
- **500 Server Error** - Backend server error

---

## Authentication Flow

1. User logs in via `authAPI.login()`
2. Token is received and stored in localStorage
3. Token is automatically included in all subsequent requests via Authorization header
4. Token should be cleared on logout

```javascript
// In components:
const token = localStorage.getItem('token');
// API service automatically uses this token for authenticated requests
```

---

## Fallback to LocalStorage

The application is designed to work even if the backend is unavailable:

- **Complaints:** Falls back to localStorage data if API call fails
- **User Data:** Syncs with API but maintains local copy
- **Images:** Can upload locally first, then sync with backend

---

## Backend API Specification Template

Use this as a reference when implementing backend endpoints:

### Required Endpoints

```
Authentication:
POST   /api/auth/login
POST   /api/auth/signup
POST   /api/auth/logout

Complaints:
GET    /api/complaints
GET    /api/complaints/:id
POST   /api/complaints
PUT    /api/complaints/:id
DELETE /api/complaints/:id
POST   /api/complaints/:id/comments
POST   /api/complaints/:id/like
POST   /api/complaints/:id/dislike

User Profile:
GET    /api/users/profile
PUT    /api/users/profile
POST   /api/users/profile/image
GET    /api/users/complaints

Images:
POST   /api/images/upload
POST   /api/images/upload-multiple

Dashboard:
GET    /api/dashboard/stats
GET    /api/dashboard/complaints-over-time
```

---

## Testing API Calls

You can test API calls using tools like Postman or curl:

```bash
# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'

# Test get complaints
curl http://localhost:5000/api/complaints

# Test create complaint (requires token)
curl -X POST http://localhost:5000/api/complaints \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"Pothole","type":"Infrastructure",...}'
```

---

## Additional Notes

- All timestamps are in ISO 8601 format
- All endpoints support JSON request/response format
- Images should be sent as FormData
- Maximum file size for images: 5MB
- Supported image formats: JPEG, PNG, GIF, WebP
