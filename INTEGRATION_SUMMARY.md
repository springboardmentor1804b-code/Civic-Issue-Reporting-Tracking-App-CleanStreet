# Civix-CleanStreet Frontend & Backend Integration Summary

## Overview
This document summarizes all the integration work completed between the frontend and backend to ensure seamless API communication.

## Changes Made

### 1. **Image Upload System** ✅

#### Backend Updates

**Files Modified:**
- [Backend/src/middleware/upload.middleware.js](Backend/src/middleware/upload.middleware.js)
- [Backend/src/routes/images.routes.js](Backend/src/routes/images.routes.js)
- [Backend/src/controllers/user.controller.js](Backend/src/controllers/user.controller.js)
- [Backend/src/routes/user.routes.js](Backend/src/routes/user.routes.js)

**Changes:**
1. **Upload Middleware** - Updated to support multiple upload directories:
   - `/uploads/complaints/` - For complaint images
   - `/uploads/profile/` - For user profile images
   - `/uploads/images/` - For general image uploads

2. **Image Routes** - Implemented full image upload functionality:
   - `POST /api/images/upload` - Upload single image
   - `POST /api/images/upload-multiple` - Upload multiple images (up to 10)
   - Returns proper response format with URLs and file metadata

3. **User Controller** - Added profile image upload:
   - `POST /api/users/profile/image` - Upload user profile image
   - Updates user document with image URL
   - Returns user object with updated profile image

**Response Formats:**
```json
// Single image upload response
{
  "message": "Image uploaded successfully",
  "url": "/uploads/images/{filename}",
  "filename": "{filename}",
  "fileSize": 12345,
  "fileType": "image/jpeg"
}

// Multiple images upload response
{
  "message": "Images uploaded successfully",
  "urls": ["/uploads/images/{file1}", "/uploads/images/{file2}"],
  "count": 2,
  "files": [...]
}

// Profile image upload response
{
  "message": "Profile image uploaded",
  "imageUrl": "/uploads/profile/{filename}",
  "user": {...}
}
```

---

### 2. **Complaint Pagination & Filtering** ✅

**File Modified:** [Backend/src/routes/complaints.routes.js](Backend/src/routes/complaints.routes.js#L12-L39)

**Changes:**
- Added pagination support with `page` and `limit` query parameters
- Default limit: 10, Max limit: 100
- Maintained existing filters: `status`, `priority`, `issueType`, `user_id`
- Returns paginated response with metadata

**Endpoint:** `GET /api/complaints?page=1&limit=10&status=received&priority=High`

**Response Format:**
```json
{
  "data": [...complaints array...],
  "total": 150,
  "page": 1,
  "limit": 10,
  "pages": 15
}
```

---

### 3. **Complaint Model Enhancement** ✅

**File Modified:** [Backend/src/models/Complaint.js](Backend/src/models/Complaint.js)

**Changes:**
- Added `fullDescription` field to store detailed complaint descriptions
- Maintains compatibility with existing fields

**Schema Fields:**
- `title` - Complaint title (required)
- `issueType` - Type of issue (required)
- `description` - Brief description (required)
- `fullDescription` - Detailed description (optional, new)
- `priority` - Low/Medium/High (default: Medium)
- `address` - Location address (required)
- `landmark` - Nearby landmark (optional)
- `photo` - Photo URL (optional)
- `location_coords` - { lat, lng } (optional)
- `status` - received/in_review/resolved (default: received)
- `assigned_to` - Responsible authority (default: Municipal Authority)
- `user_id` - Reference to user (required)
- `timestamps` - createdAt, updatedAt

---

### 4. **Dashboard Stats Endpoint** ✅

**File Modified:** [Backend/src/routes/dashboard.routes.js](Backend/src/routes/dashboard.routes.js#L106-L135)

**Endpoint:** `GET /api/dashboard/stats`

**Response Format:**
```json
{
  "totalComplaints": 150,
  "resolvedComplaints": 45,
  "pendingComplaints": 78,
  "inProgressComplaints": 27,
  "byType": {
    "Pothole": 25,
    "Garbage Collection": 35,
    "Street Light": 20,
    ...
  }
}
```

---

### 5. **Complaints Over Time Endpoint** ✅

**File Modified:** [Backend/src/routes/dashboard.routes.js](Backend/src/routes/dashboard.routes.js#L137-L168)

**Endpoint:** `GET /api/dashboard/complaints-over-time`

**Response Format:**
```json
{
  "data": [
    { "date": "2024-01-15", "count": 5 },
    { "date": "2024-01-16", "count": 8 },
    { "date": "2024-01-17", "count": 3 },
    ...
  ]
}
```

---

## API Endpoints - Complete Reference

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/logout` - Logout user

### Complaints
- `GET /api/complaints` - Get all complaints (with pagination & filters)
- `GET /api/complaints/:id` - Get single complaint
- `POST /api/complaints` - Create complaint (authenticated)
- `POST /api/complaint/submit` - Submit complaint with file upload (authenticated)
- `PUT /api/complaints/:id` - Update complaint (authenticated, owner only)
- `DELETE /api/complaints/:id` - Delete complaint (authenticated, owner only)
- `POST /api/complaints/:id/comments` - Add comment to complaint (authenticated)
- `GET /api/complaints/:id/comments` - Get complaints comments
- `POST /api/complaints/:id/like` - Like complaint (authenticated)
- `POST /api/complaints/:id/dislike` - Dislike complaint (authenticated)

### Comments
- `POST /api/comment/:id` - Add comment (authenticated)
- `GET /api/comment/:id` - Get comments for complaint

### User Profile
- `GET /api/users/profile` - Get user profile (authenticated)
- `PUT /api/users/profile` - Update user profile (authenticated)
- `POST /api/users/profile/image` - Upload profile image (authenticated)
- `GET /api/users/complaints` - Get user's complaints (authenticated)

### Image Upload
- `POST /api/images/upload` - Upload single image (authenticated)
- `POST /api/images/upload-multiple` - Upload multiple images (authenticated)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/complaints-over-time` - Get complaints timeline data
- `GET /api/dashboard/admin-dashboard` - Get admin dashboard (admin only)

---

## Frontend-Backend Data Flow

### Complaint Submission Flow
1. User fills form in ReportIssue.jsx
2. Frontend creates FormData (if image) or JSON object
3. API call to `POST /api/complaint/submit` or `POST /api/complaints`
4. Backend creates Complaint document with:
   - User ID from authenticated token
   - Issue type (handles both `type` and `issueType`)
   - Priority conversion (Urgent → High)
   - Location coordinates from latitude/longitude
   - Photo file path (if provided)
5. Returns created complaint object

### Complaint Viewing Flow
1. Frontend calls `GET /api/complaints` with filters
2. Backend returns paginated list with metadata
3. User can view individual complaint via `GET /api/complaints/:id`
4. Frontend displays user info (populated from user_id reference)

### Comment Flow
1. User adds comment via ViewComplaints.jsx
2. Frontend calls `POST /api/comment/:complaintId` with text
3. Backend accepts `text`, `comment`, or `content` field
4. Stores comment linked to complaint and user
5. `GET /api/comment/:complaintId` retrieves all comments

### Voting Flow
1. User likes/dislikes complaint
2. Frontend calls `POST /api/complaints/:id/like` or `dislike`
3. Backend creates Vote document with voteType (upvote/downvote)
4. Prevents duplicate votes from same user

### Profile Image Upload Flow
1. User selects image in Profilesettings.jsx
2. Frontend calls `POST /api/users/profile/image` with FormData
3. Backend stores file in `/uploads/profile/`
4. Updates user document with image URL
5. Returns updated user object with imageUrl

### Dashboard Stats Flow
1. Frontend calls `GET /api/dashboard/stats` and `GET /api/dashboard/complaints-over-time`
2. Backend aggregates complaint data
3. Returns statistics by status and issue type
4. Returns daily complaint counts for charting

---

## Key Integration Points

### 1. **Authentication**
- All protected endpoints use Bearer token in Authorization header
- Middleware: [Backend/src/middleware/auth.middleware.js](Backend/src/middleware/auth.middleware.js)
- Token verification with JWT (SECRET key)
- User ID extracted and stored in req.user.id

### 2. **File Upload**
- Multer middleware handles file storage
- Automatic directory creation for different upload types
- File naming: `{timestamp}-{originalname}`
- Files served statically via `/uploads/` route

### 3. **Data Validation**
- Frontend validates form inputs before submission
- Backend validates all input data
- Proper HTTP status codes (400, 401, 403, 404, 500)
- Detailed error messages in JSON responses

### 4. **Database References**
- User ID references in Complaint, Comment, Vote
- Complaint ID references in Comment, Vote
- Proper population of user details in responses

### 5. **CORS Configuration**
- Backend allows requests from `http://localhost:5173` (frontend)
- Credentials enabled for cross-origin requests

---

## Testing Checklist

- [x] Image upload endpoints working with proper response format
- [x] Complaint pagination and filtering functional
- [x] Dashboard stats returning correct data structure
- [x] Profile image upload integrated
- [x] Comment system working bidirectionally
- [x] Like/Dislike voting system operational
- [x] User authentication flow complete
- [x] Complaint submission with and without images
- [x] All error handling returning proper HTTP status codes
- [x] Frontend-backend data format compatibility

---

## Environment Variables

**Frontend (.env.local)**
```
VITE_API_URL=http://localhost:5000/api
```

**Backend (.env) - Optional for production**
- Database connection string (MongoDB)
- JWT secret key
- File upload limits

---

## Notes

1. **No Breaking Changes**: All existing functionality preserved
2. **Frontend Visuals**: No changes made to frontend UI/styling
3. **Database Compatibility**: Works with existing MongoDB collections
4. **Authentication**: Uses JWT tokens with SECRET key
5. **File Storage**: Local disk storage in `/uploads/` directories
6. **Status Mapping**: "received" → "Pending", "in_review" → "In Progress", "resolved" → "Resolved"

---

## Troubleshooting

### Issue: Image uploads returning 400
- Check multer middleware is loaded
- Verify `/uploads` directory exists and is writable
- Ensure FormData is properly formatted on frontend

### Issue: Pagination not working
- Verify query parameters are being passed: `?page=1&limit=10`
- Check page/limit are valid integers
- Ensure page > 0 and limit <= 100

### Issue: Complaints not appearing
- Check complaint status filter (default: all statuses)
- Verify user_id matches authenticated user if filtering by user
- Check timestamp filters aren't excluding recent complaints

### Issue: Authentication failing
- Verify JWT_SECRET matches between auth and verification
- Check token is properly stored and sent in Authorization header
- Ensure token hasn't expired

---

**Integration Completed:** January 24, 2026
**Status:** ✅ All Features Integrated and Ready for Use
