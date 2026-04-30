# Sukoon Frontend - API Reference

## Overview

This document provides the complete API contract expected by the Sukoon frontend. Your Spring Boot backend should implement these endpoints and response formats.

## Authentication API

### Register User
**Endpoint**: `POST /api/auth/register`

**Request**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe"
}
```

**Response** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Error** (400 Bad Request):
```json
{
  "error": "Email already registered"
}
```

---

### Login User
**Endpoint**: `POST /api/auth/login`

**Request**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Error** (401 Unauthorized):
```json
{
  "error": "Invalid email or password"
}
```

---

### Google OAuth
**Endpoint**: `POST /api/auth/google`

**Request**:
```json
{
  "token": "google_id_token_from_frontend"
}
```

**Response** (200 OK):
```json
{
  "token": "your_jwt_token",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Note**: Verify Google token on backend and create/update user as needed.

---

### Forgot Password
**Endpoint**: `POST /api/auth/forgot-password`

**Request**:
```json
{
  "email": "user@example.com"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Reset code sent to email"
}
```

**Backend Action**:
- Generate 6-character reset code
- Store code with expiration (e.g., 30 minutes)
- Send email with reset code

---

### Reset Password
**Endpoint**: `POST /api/auth/reset-password`

**Request**:
```json
{
  "email": "user@example.com",
  "code": "ABC123",
  "newPassword": "NewSecurePass456"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

**Error** (400 Bad Request):
```json
{
  "error": "Invalid or expired reset code"
}
```

**Backend Action**:
- Validate reset code (exists, not expired)
- Hash new password
- Update user password
- Invalidate reset code

---

### Get Current User
**Endpoint**: `GET /api/user`

**Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response** (200 OK):
```json
{
  "id": "user_123",
  "email": "user@example.com",
  "name": "John Doe"
}
```

**Error** (401 Unauthorized):
```json
{
  "error": "Invalid or expired token"
}
```

---

## Chat API

### Create Chat Session
**Endpoint**: `POST /api/chat`

**Headers**:
```
Authorization: Bearer {token}
```

**Request**:
```json
{
  "mood": "anxious"
}
```

**Response** (201 Created):
```json
{
  "id": "chat_123",
  "mood": "anxious",
  "title": "Anxious Chat - 2024-04-29",
  "messages": [],
  "createdAt": "2024-04-29T10:30:00Z",
  "updatedAt": "2024-04-29T10:30:00Z"
}
```

---

### Get All Chat Sessions
**Endpoint**: `GET /api/chat`

**Headers**:
```
Authorization: Bearer {token}
```

**Response** (200 OK):
```json
[
  {
    "id": "chat_123",
    "mood": "anxious",
    "title": "Anxious Chat - 2024-04-29",
    "createdAt": "2024-04-29T10:30:00Z",
    "updatedAt": "2024-04-29T10:30:00Z"
  },
  {
    "id": "chat_124",
    "mood": "happy",
    "title": "Happy Chat - 2024-04-28",
    "createdAt": "2024-04-28T14:15:00Z",
    "updatedAt": "2024-04-28T14:45:00Z"
  }
]
```

---

### Get Specific Chat Session
**Endpoint**: `GET /api/chat/{id}`

**Headers**:
```
Authorization: Bearer {token}
```

**Response** (200 OK):
```json
{
  "id": "chat_123",
  "mood": "anxious",
  "title": "Anxious Chat - 2024-04-29",
  "messages": [
    {
      "id": "msg_1",
      "sessionId": "chat_123",
      "content": "I'm feeling really anxious about my upcoming presentation",
      "sender": "user",
      "createdAt": "2024-04-29T10:31:00Z"
    },
    {
      "id": "msg_2",
      "sessionId": "chat_123",
      "content": "It's completely normal to feel anxious about presentations. Let's talk about what specifically is making you anxious.",
      "sender": "assistant",
      "createdAt": "2024-04-29T10:31:30Z"
    }
  ],
  "createdAt": "2024-04-29T10:30:00Z",
  "updatedAt": "2024-04-29T10:31:30Z"
}
```

**Error** (404 Not Found):
```json
{
  "error": "Chat session not found"
}
```

---

### Send Message
**Endpoint**: `POST /api/chat/{id}/message`

**Headers**:
```
Authorization: Bearer {token}
```

**Request**:
```json
{
  "message": "I'm worried I'll forget everything I prepared"
}
```

**Response** (201 Created):
```json
{
  "id": "msg_3",
  "sessionId": "chat_123",
  "content": "I'm worried I'll forget everything I prepared",
  "sender": "user",
  "createdAt": "2024-04-29T10:32:00Z"
}
```

**Backend Action**:
- Validate user hasn't exceeded daily message limit (20)
- Check message count for today
- If user message, send to Groq API for AI response
- Store both messages in database
- Update chat session updated_at timestamp

---

### Get Message Count
**Endpoint**: `GET /api/chat/messages/count`

**Headers**:
```
Authorization: Bearer {token}
```

**Response** (200 OK):
```json
{
  "count": 15,
  "limit": 20
}
```

**Backend Logic**:
- Count user's messages sent today (reset at midnight)
- Return count and daily limit (20)
- Frontend uses this to enforce UI limit

---

### End Chat Session
**Endpoint**: `POST /api/chat/{id}/end`

**Headers**:
```
Authorization: Bearer {token}
```

**Request**:
```json
{}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Chat session ended"
}
```

**Backend Action**:
- Mark session as ended
- Calculate session summary stats
- Store session metrics

---

## Notes API

### Get All Notes
**Endpoint**: `GET /api/notes`

**Headers**:
```
Authorization: Bearer {token}
```

**Response** (200 OK):
```json
[
  {
    "id": "note_1",
    "title": "Gratitude List",
    "content": "1. Supportive friends\n2. Good health\n3. Interesting projects",
    "createdAt": "2024-04-25T09:00:00Z",
    "updatedAt": "2024-04-25T09:00:00Z"
  },
  {
    "id": "note_2",
    "title": "Weekly Goals",
    "content": "- Complete project\n- Exercise 3 times\n- Read one book",
    "createdAt": "2024-04-22T08:30:00Z",
    "updatedAt": "2024-04-28T10:15:00Z"
  }
]
```

---

### Create Note
**Endpoint**: `POST /api/notes`

**Headers**:
```
Authorization: Bearer {token}
```

**Request**:
```json
{
  "title": "Gratitude List",
  "content": "1. Supportive friends\n2. Good health\n3. Interesting projects"
}
```

**Response** (201 Created):
```json
{
  "id": "note_1",
  "title": "Gratitude List",
  "content": "1. Supportive friends\n2. Good health\n3. Interesting projects",
  "createdAt": "2024-04-25T09:00:00Z",
  "updatedAt": "2024-04-25T09:00:00Z"
}
```

---

### Update Note
**Endpoint**: `PUT /api/notes/{id}`

**Headers**:
```
Authorization: Bearer {token}
```

**Request**:
```json
{
  "title": "Updated Gratitude List",
  "content": "1. Supportive friends\n2. Good health\n3. Interesting projects\n4. Growing confidence"
}
```

**Response** (200 OK):
```json
{
  "id": "note_1",
  "title": "Updated Gratitude List",
  "content": "1. Supportive friends\n2. Good health\n3. Interesting projects\n4. Growing confidence",
  "createdAt": "2024-04-25T09:00:00Z",
  "updatedAt": "2024-04-25T10:30:00Z"
}
```

---

### Delete Note
**Endpoint**: `DELETE /api/notes/{id}`

**Headers**:
```
Authorization: Bearer {token}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Note deleted successfully"
}
```

**Error** (404 Not Found):
```json
{
  "error": "Note not found"
}
```

---

## Error Handling

### Standard Error Format

All errors should follow this format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "status": 400
}
```

### Common HTTP Status Codes

- **200 OK** - Successful GET/PUT request
- **201 Created** - Successful POST request
- **400 Bad Request** - Invalid request data
- **401 Unauthorized** - Invalid/missing authentication
- **403 Forbidden** - User doesn't have permission
- **404 Not Found** - Resource doesn't exist
- **409 Conflict** - Duplicate resource (e.g., email already registered)
- **500 Internal Server Error** - Server error

---

## Authentication

### JWT Token Format

Tokens are sent in Authorization header:

```
Authorization: Bearer <token>
```

### Token Validation

- Verify token signature
- Check token expiration
- Extract user ID from token claims

### Token Refresh (Optional)

Consider implementing token refresh for production:
- Access token: 15 minutes
- Refresh token: 7 days
- Endpoint: `POST /api/auth/refresh`

---

## Rate Limiting

Implement rate limiting to prevent abuse:

- **Auth endpoints**: 5 requests per minute
- **Chat endpoints**: 30 requests per minute
- **Notes endpoints**: 60 requests per minute
- **Message sending**: 1 request per 2 seconds

---

## CORS Configuration

Configure CORS to allow requests from frontend:

```
Allowed Origins: http://localhost:3000, https://yourdomain.com
Allowed Methods: GET, POST, PUT, DELETE, OPTIONS
Allowed Headers: Content-Type, Authorization
```

---

## Pagination (Optional)

If implementing pagination for large lists:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 45,
    "pages": 3
  }
}
```

---

## Validation Rules

### User Registration
- Email: Valid email format, unique
- Password: Min 8 chars, 1 uppercase, 1 number
- Name: Non-empty string

### Chat Session
- Mood: One of [happy, calm, neutral, sad, anxious, stressed, angry, tired]
- Message: Non-empty string, max 5000 chars

### Notes
- Title: Non-empty, max 200 chars
- Content: Max 50000 chars

---

## Testing Endpoints

### Using cURL

```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123","name":"Test User"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123"}'

# Get User
curl -X GET http://localhost:8080/api/user \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create Chat
curl -X POST http://localhost:8080/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"mood":"anxious"}'
```

### Using Postman

1. Create requests for each endpoint
2. Set Authorization header with Bearer token
3. Test with different inputs
4. Verify response formats

---

## Frontend Integration Example

```typescript
// src/lib/api.ts
const API_BASE_URL = 'http://localhost:8080/api';

// Register
const response = await fetch(`${API_BASE_URL}/auth/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password, name }),
});
const data = await response.json();
localStorage.setItem('auth_token', data.token);

// Authenticated request
const userResponse = await fetch(`${API_BASE_URL}/user`, {
  headers: { Authorization: `Bearer ${token}` },
});
```

---

## Version History

- **v1.0** (April 29, 2024) - Initial API specification

---

## Support

For API issues:
1. Check endpoint URLs match exactly
2. Verify request/response formats
3. Check HTTP status codes
4. Review error messages
5. Check server logs

---

Last Updated: April 29, 2026
