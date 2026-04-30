# Sukoon Frontend - Setup Guide

## Quick Start

Your Sukoon mental wellness frontend is now ready! Here's what you need to do to connect it to your Spring Boot backend.

### 1. Backend Connection

The frontend is configured to connect to your Spring Boot backend at:
```
http://localhost:8080/api
```

**Make sure your Spring Boot backend is running before starting the frontend.**

### 2. API Endpoint Structure

Your backend should have these endpoints. If your endpoints differ, update `lib/api.ts`:

#### Authentication Endpoints
```
POST   /api/auth/register          - { email, password, name } → { token, user }
POST   /api/auth/login             - { email, password } → { token, user }
POST   /api/auth/google            - { token } → { token, user }
POST   /api/auth/forgot-password   - { email } → { success }
POST   /api/auth/reset-password    - { email, code, newPassword } → { success }
GET    /api/user                   - Headers: Authorization: Bearer {token} → { id, email, name }
```

#### Chat Endpoints
```
POST   /api/chat                   - { mood } → { id, mood, title, messages, createdAt, updatedAt }
GET    /api/chat                   - → [{ id, mood, title, createdAt, updatedAt }]
GET    /api/chat/{id}              - → { id, mood, title, messages[], createdAt, updatedAt }
POST   /api/chat/{id}/message      - { message } → { id, sessionId, content, sender, createdAt }
GET    /api/chat/messages/count    - → { count, limit }
POST   /api/chat/{id}/end          - → { success }
```

#### Notes Endpoints
```
GET    /api/notes                  - → [{ id, title, content, createdAt, updatedAt }]
POST   /api/notes                  - { title, content } → { id, title, content, createdAt, updatedAt }
PUT    /api/notes/{id}             - { title, content } → { id, title, content, createdAt, updatedAt }
DELETE /api/notes/{id}             - → { success }
```

### 3. Data Models

Make sure your backend returns data in these formats:

#### User
```json
{
  "id": "string",
  "email": "string",
  "name": "string"
}
```

#### ChatSession
```json
{
  "id": "string",
  "mood": "string",
  "title": "string",
  "messages": [
    {
      "id": "string",
      "sessionId": "string",
      "content": "string",
      "sender": "user" | "assistant",
      "createdAt": "ISO8601_string"
    }
  ],
  "createdAt": "ISO8601_string",
  "updatedAt": "ISO8601_string"
}
```

#### Note
```json
{
  "id": "string",
  "title": "string",
  "content": "string",
  "createdAt": "ISO8601_string",
  "updatedAt": "ISO8601_string"
}
```

### 4. Authentication Setup

The app uses JWT tokens stored in localStorage:

1. On login/register, store the token:
   ```javascript
   localStorage.setItem('auth_token', token);
   ```

2. Send token with every API request:
   ```
   Authorization: Bearer {token}
   ```

3. If token is invalid, user is redirected to login

**Note**: Currently using localStorage (not httpOnly cookies). For production, consider migrating to httpOnly cookies.

### 5. Google OAuth Setup (Optional)

To enable Google login:

1. Get your Google OAuth Client ID from Google Cloud Console
2. Update the Google sign-in button in `app/login/page.tsx` and `app/register/page.tsx`
3. Implement Google token verification in your backend at `POST /api/auth/google`

For now, the Google buttons are placeholders.

### 6. Environment Variables

If you need to add environment variables, create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

Then update `lib/api.ts` to use it:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
```

### 7. Running the App

```bash
# Install dependencies (already done)
pnpm install

# Start development server
pnpm dev

# Open http://localhost:3000
```

### 8. Test the App

1. **Create Account**: Go to /register and sign up
2. **Login**: Go to /login and login
3. **Start Chat**: Select a mood on dashboard
4. **Create Notes**: Click "New Note" in sidebar
5. **View History**: Chat history appears in sidebar

## Common Issues & Solutions

### Issue: "Cannot POST /api/auth/login"
**Solution**: Make sure Spring Boot backend is running on port 8080

### Issue: "CORS error"
**Solution**: Add CORS headers to your Spring Boot controllers:
```java
@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class AuthController { }
```

### Issue: "Cannot read property 'token' of undefined"
**Solution**: Check that your backend returns `{ token, user }` object from auth endpoints

### Issue: Messages show "undefined" or empty
**Solution**: Verify your `ChatMessage` array structure matches the interface in `lib/api.ts`

## File Structure Overview

```
app/
├── page.tsx                 # Landing page
├── login/page.tsx          # Login form
├── register/page.tsx       # Registration form  
├── forgot-password/page.tsx # Password reset
├── dashboard/
│   ├── layout.tsx          # Dashboard wrapper with auth check
│   ├── page.tsx            # Mood selector
│   ├── chat/[id]/page.tsx  # Chat interface
│   ├── notes/page.tsx      # Notes list
│   ├── notes/[id]/page.tsx # Note editor
│   └── settings/page.tsx   # User settings
├── layout.tsx              # Root layout with AuthProvider
└── globals.css             # Tailwind + design tokens

components/
├── dashboard/
│   ├── Sidebar.tsx         # Navigation sidebar
│   ├── ChatWindow.tsx      # Message display
│   ├── ChatInput.tsx       # Message input
│   ├── MoodSelector.tsx    # Mood buttons
│   ├── MessageCounter.tsx  # Usage counter
│   └── SessionSummary.tsx  # Session recap

context/
└── AuthContext.tsx         # Auth state management

lib/
├── api.ts                  # API client functions
└── utils.ts                # Utility functions
```

## Customization Guide

### Change Message Limit
Edit `app/dashboard/page.tsx`:
```typescript
const [messageLimit] = useState(20); // Change this number
```

### Change Mood Options
Edit `app/dashboard/page.tsx`:
```typescript
const moods = [
  { emoji: '😊', label: 'Happy', value: 'happy' },
  // Add or remove moods here
];
```

### Change Colors
Edit `app/globals.css`:
```css
:root {
  --primary: oklch(0.55 0.2 280);  /* Purple - change hue angle */
  --secondary: oklch(0.65 0.15 240); /* Blue */
  --accent: oklch(0.7 0.12 180);   /* Teal */
}
```

## Production Deployment

When deploying to production:

1. Update `API_BASE_URL` in `lib/api.ts` to your production backend URL
2. Enable HTTPS for secure token transmission
3. Migrate from localStorage to httpOnly cookies
4. Add proper error handling and logging
5. Set up environment variables via your hosting platform
6. Enable CORS properly (avoid wildcard *)
7. Add rate limiting on backend
8. Implement proper session management

## Next Steps

1. Start your Spring Boot backend
2. Run `pnpm dev` to start frontend
3. Test authentication flow
4. Test chat functionality
5. Test notes feature
6. Customize design if needed
7. Deploy to production

---

**Need help?** Check the console logs (Ctrl+Shift+J) for detailed error messages. Your Spring Boot backend logs will also show what's happening with API requests.

Good luck with Sukoon! 🌙
