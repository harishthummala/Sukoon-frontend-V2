# Sukoon - Mental Wellness Chat App

A beautiful, modern mental wellness application built with Next.js that connects to your Java Spring Boot backend. Sukoon provides a safe space for users to express their feelings, chat with an AI companion, and maintain personal wellness notes.

## Features

### Core Features
- **8 Mood Selection**: Happy, Calm, Neutral, Sad, Anxious, Stressed, Angry, Tired
- **AI-Powered Chat**: Groq-powered conversations via your backend
- **Message Counter**: 20 messages per day limit tracking
- **Session Summaries**: Detailed insights after each chat session
- **Personal Notes**: Create, edit, and organize private reflections
- **Chat History**: Access previous conversations from the sidebar

### Authentication
- Email/Password registration and login
- Google OAuth integration (requires credentials)
- Password reset with email verification codes
- Secure JWT token storage in localStorage

### Design
- Gen Z/Millennial aesthetic with calming color palette (purple, blue, mint)
- Fully responsive mobile-first design
- Smooth animations and transitions
- Accessibility-first approach with semantic HTML

## Tech Stack

- **Frontend**: Next.js 16 + React 19
- **Styling**: Tailwind CSS with custom design tokens
- **Backend**: Your Java Spring Boot API (http://localhost:8080)
- **Icons**: Lucide React
- **State Management**: React Context API + Custom Hooks

## Getting Started

### Prerequisites
- Node.js 18+
- Your Java Spring Boot backend running on http://localhost:8080
- Google OAuth credentials (optional, for Google login)

### Installation

1. Clone the repository and navigate to the project:
```bash
cd /vercel/share/v0-project
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
/app
  /dashboard          - Protected dashboard routes
    /chat/[id]       - Chat interface with messages
    /notes           - Notes list and editor
    /settings        - User settings and profile
  /forgot-password    - Password reset flow
  /login             - Login page
  /register          - Registration page
  page.tsx           - Landing page

/components
  /dashboard
    ChatInput.tsx        - Message input component
    ChatWindow.tsx       - Message display component
    MessageCounter.tsx   - Messages remaining counter
    MoodSelector.tsx     - 8-mood selection grid
    SessionSummary.tsx   - Chat session summary
    Sidebar.tsx          - Navigation sidebar

/context
  AuthContext.tsx     - Authentication state & logic

/lib
  api.ts             - All API calls to backend
  utils.ts           - Utility functions
```

## API Integration

The app connects to your Spring Boot backend with these assumed endpoints:

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/google` - Google OAuth
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with code
- `GET /api/user` - Get current user

### Chat
- `POST /api/chat` - Create new chat session
- `GET /api/chat` - Get all sessions
- `GET /api/chat/{id}` - Get specific session
- `POST /api/chat/{id}/message` - Send message
- `GET /api/chat/messages/count` - Get message usage count
- `POST /api/chat/{id}/end` - End session

### Notes
- `GET /api/notes` - Get all notes
- `POST /api/notes` - Create note
- `PUT /api/notes/{id}` - Update note
- `DELETE /api/notes/{id}` - Delete note

## Environment Variables

Currently, the app uses `http://localhost:8080` as the backend URL. To change this:

1. Edit `lib/api.ts` and update the `API_BASE_URL` constant
2. For production, consider using environment variables

## Customization

### Design System
- Edit `app/globals.css` to modify:
  - Color tokens (primary, secondary, accent)
  - Border radius
  - Theme colors for dark mode

### Moods
- Edit the moods array in `app/dashboard/page.tsx` to change mood options
- Each mood has: emoji, label, and value

### Message Limit
- Edit `limit` in `app/dashboard/page.tsx` (currently set to 20)
- Update backend to match this limit

## Authentication Flow

1. **Login/Register**: User creates account or logs in
2. **JWT Storage**: Token stored in localStorage
3. **Protected Routes**: AuthProvider wraps dashboard routes
4. **Auto Redirect**: Unauthenticated users redirected to login
5. **Logout**: Token cleared from storage

## Notes

- The app stores JWT tokens in localStorage (not httpOnly cookies) as per your setup
- Google OAuth button is a placeholder - you need to implement the actual OAuth flow with your credentials
- The password change feature on settings page is UI-only - backend implementation needed
- Session summaries are generated client-side based on chat content

## Troubleshooting

### Can't connect to backend?
- Ensure your Spring Boot app is running on http://localhost:8080
- Check CORS settings in your Spring Boot configuration
- Check browser console for API errors

### Authentication not working?
- Verify JWT tokens are being sent correctly (check localStorage)
- Check that your backend returns tokens in the expected format
- Verify Authorization headers are being set (Bearer token format)

### Messages not loading?
- Check that your backend `/api/chat/messages/count` endpoint returns count and limit
- Verify chat messages structure matches the ChatMessage interface in lib/api.ts

## Future Enhancements

- Real-time chat with WebSockets
- Voice chat support
- Mood tracking analytics dashboard
- Export chat history
- Integration with therapy resources
- Mobile app version
- Offline mode with local storage

## Support

For issues or questions:
1. Check the browser console for detailed error messages
2. Verify backend API is responding correctly
3. Check network tab in dev tools for API calls

---

Built with care for your mental wellness journey. Remember: Sukoon is a complement to professional mental health care, not a replacement.
