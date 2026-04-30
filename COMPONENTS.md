# Sukoon Components Documentation

## Overview

This document describes all React components used in Sukoon and how they work together.

## Context & Hooks

### AuthContext.tsx
**Location**: `context/AuthContext.tsx`

Manages global authentication state and provides auth functions to the app.

**Exports**:
- `AuthProvider` - Wrapper component that provides auth context
- `useAuth()` - Hook to access auth state

**State**:
```typescript
{
  user: User | null,           // Current logged-in user
  token: string | null,        // JWT token
  loading: boolean,            // Is auth state loading?
  isAuthenticated: boolean,    // Is user logged in?
}
```

**Methods**:
- `login(email, password)` - Authenticate user
- `register(email, password, name)` - Create new account
- `logout()` - Clear auth and redirect to login

**Usage**:
```typescript
const { user, token, isAuthenticated, login, logout } = useAuth();
```

---

## Page Components

### Landing Page
**Location**: `app/page.tsx`

Marketing homepage with hero section, features, how it works, problems solved, and CTA.

**Features**:
- Navigation with login/signup links
- Responsive grid for feature cards
- Problem solution section with emoji icons
- Call-to-action buttons
- Footer with terms and legal links

**Redirects**:
- If authenticated, redirects to `/dashboard`

---

### Login Page
**Location**: `app/login/page.tsx`

User login form with email, password, and Google sign-in option.

**Components**:
- Email input with mail icon
- Password input with show/hide toggle
- "Forgot password?" link
- Google sign-in button
- Signup link at bottom

**Validation**:
- Email format check
- Password required
- Error messages for failed login

---

### Register Page
**Location**: `app/register/page.tsx`

User registration form with password validation.

**Components**:
- Name input
- Email input
- Password input with requirements display
- Confirm password input
- Password strength indicators (8 chars, uppercase, number)
- Google sign-up button
- Login link at bottom

**Validation**:
- All fields required
- Password: 8+ chars, 1 uppercase, 1 number
- Passwords must match
- Real-time validation feedback

---

### Forgot Password Page
**Location**: `app/forgot-password/page.tsx`

Three-step password reset flow: email → code → new password

**Steps**:
1. **Email**: User enters email to receive reset code
2. **Code**: User enters 6-character reset code from email
3. **Password**: User sets new password

**Features**:
- Step-by-step form progression
- Error and success messages
- Password confirmation
- Back navigation between steps

---

### Dashboard Layout
**Location**: `app/dashboard/layout.tsx`

Protected wrapper for all dashboard routes.

**Features**:
- Auth check: Redirects unauthenticated users to login
- Loading state while checking auth
- Renders sidebar and page content

**Protected Routes**:
- `/dashboard/*` - All dashboard pages require auth

---

### Dashboard Home
**Location**: `app/dashboard/page.tsx`

Main dashboard showing mood selector and message counter.

**Components**:
- Message counter in header
- Mood selector grid (8 moods)
- Info text

**Functionality**:
- Clicking a mood creates new chat session
- Fetches message count on load
- Shows loading spinner while creating chat

---

### Chat Page
**Location**: `app/dashboard/chat/[id]/page.tsx`

Chat interface for conversing with AI.

**Components**:
- Header with mood and message counter
- Chat window with message bubbles
- Chat input field
- End session button

**Features**:
- Auto-scroll to latest message
- Shows loading spinners
- Error handling
- Enforces 20-message daily limit
- Prevents sending if limit reached

**Flow**:
1. Load existing chat session
2. Display messages
3. User sends message
4. Message sent to backend
5. Session refreshed with AI response
6. User can end session for summary

---

### Notes Page
**Location**: `app/dashboard/notes/page.tsx`

Grid view of all user notes with create/edit/delete.

**Features**:
- Grid layout (responsive: 1-3 columns)
- Create new note button
- Note cards showing:
  - Title
  - Content preview (4 lines)
  - Creation date
  - Edit/delete buttons (hover)
- Confirmation before delete

---

### Note Editor
**Location**: `app/dashboard/notes/[id]/page.tsx`

Create or edit a single note.

**Fields**:
- Title input (large, editable)
- Content textarea (full editor)
- Metadata showing creation/update dates

**Buttons**:
- Save (only enabled if changed)
- Delete (only shown for existing notes)
- Back link to notes list

**Features**:
- Tracks unsaved changes
- Prevents save if no title
- Redirects to notes list after save
- Delete confirmation

---

### Settings Page
**Location**: `app/dashboard/settings/page.tsx`

User account and security settings.

**Sections**:
1. **Profile**
   - Display-only name and email
   - Note about contact support for changes

2. **Security**
   - Change password form
   - Current password, new password, confirm
   - Show/hide password toggle

3. **Notifications**
   - Email notifications toggle
   - SMS reminders toggle
   - Push notifications toggle

4. **Danger Zone**
   - Logout button

---

## Dashboard Components

### Sidebar (Navigation)
**Location**: `components/dashboard/Sidebar.tsx`

Left sidebar with navigation, chat history, notes list, and user menu.

**Sections**:
- **Header**: Logo and user profile card
- **Navigation**: 
  - New Chat button
  - Tab switch: Chats / Notes
- **Chat History**: List of previous chats (sorted by date)
- **Notes List**: 
  - New Note button
  - List of notes (sorted by date)
- **Footer**: Settings and Logout buttons

**Features**:
- Mobile toggle (collapses on small screens)
- Active link highlighting
- Loads data based on active tab
- Loading state while fetching
- Empty state messages

**Responsive**:
- Fixed width on desktop
- Slides in/out on mobile
- Overlay on mobile when open

---

### Chat Window
**Location**: `components/dashboard/ChatWindow.tsx`

Displays message bubbles in conversation format.

**Features**:
- User messages: right-aligned, primary color
- Assistant messages: left-aligned, white with border
- Timestamps on each message
- Auto-scroll to latest message
- Empty state with icon

**Message Bubble Styling**:
- Rounded corners
- Rounded corner removed on same side as sender
- Max-width for readability
- Time displayed in small text below

---

### Chat Input
**Location**: `components/dashboard/ChatInput.tsx`

Bottom input field for sending messages.

**Features**:
- Text input with placeholder
- Send button with icon
- Loading spinner while sending
- Disabled while sending
- Clear input after sending

**Keyboard**:
- Enter/Shift+Enter to submit (can customize)

---

### Message Counter
**Location**: `components/dashboard/MessageCounter.tsx`

Shows message usage progress bar.

**Display**:
- Current count / limit (e.g., "15 / 20")
- Visual progress bar
- Color coding:
  - Green: Normal usage
  - Yellow: Warning (5 or less remaining)
  - Red: Limit reached

**States**:
- Loading spinner while fetching
- Warning icon when low
- Percentage calculation for progress bar

---

### Mood Selector
**Location**: `components/dashboard/MoodSelector.tsx`

Grid of 8 mood buttons for selecting mood.

**Moods**:
1. 😊 Happy
2. 😌 Calm
3. 😐 Neutral
4. 😢 Sad
5. 😰 Anxious
6. 😤 Stressed
7. 😠 Angry
8. 😴 Tired

**Features**:
- Large emoji display
- Mood label
- Hover effects with border and color change
- Selection state with scale transform
- Loading spinner on selected mood
- Info card below grid

---

### Session Summary
**Location**: `components/dashboard/SessionSummary.tsx`

Summary view after chat session ends.

**Sections**:
1. **Header**
   - Back to dashboard link
   - Session mood and date

2. **Stats**
   - Total messages (user + assistant breakdown)
   - Duration in minutes
   - Mood for session

3. **Summary Card**
   - Generated summary text based on mood and content

4. **Key Takeaways**
   - Reflection (message count)
   - Growth suggestion
   - Next steps

5. **Actions**
   - New Chat button
   - Create Note button

---

## Styling System

### Design Tokens (app/globals.css)

**Light Mode**:
```css
--primary: oklch(0.55 0.2 280);      /* Purple */
--secondary: oklch(0.65 0.15 240);   /* Blue */
--accent: oklch(0.7 0.12 180);       /* Teal */
--background: oklch(0.98 0.01 280);  /* Off-white */
--foreground: oklch(0.15 0 0);       /* Dark gray */
```

**Dark Mode**:
Similar structure with inverted brightness values.

### Color Palette

- **Primary (Purple)**: Main actions, focus states
- **Secondary (Blue)**: Alternate actions, info boxes
- **Accent (Teal)**: Highlights, success states
- **Background**: Page background
- **Foreground**: Text color
- **Muted**: Secondary text, disabled states
- **Border**: Card borders
- **Destructive**: Delete/warning actions

### Tailwind Classes

Common patterns:
```typescript
// Buttons
bg-primary text-primary-foreground hover:bg-primary/90

// Cards
p-6 rounded-2xl bg-white border-2 border-border

// Text
text-foreground text-muted-foreground

// Responsive
md:grid-cols-2 lg:grid-cols-3
```

---

## API Integration

### authAPI
```typescript
login(email, password)
register(email, password, name)
googleAuth(token)
forgotPassword(email)
resetPassword(email, code, newPassword)
getCurrentUser(token)
```

### chatAPI
```typescript
createSession(mood, token)
getSessions(token)
getSession(sessionId, token)
sendMessage(sessionId, message, token)
getMessageCount(token)
endSession(sessionId, token)
```

### notesAPI
```typescript
getNotes(token)
createNote(title, content, token)
updateNote(id, title, content, token)
deleteNote(id, token)
```

---

## State Management

### Global State (Context)
- Authentication state (user, token, loading)
- Auth functions (login, register, logout)

### Local State (useState)
- Form inputs (email, password, etc.)
- Loading states (loading, saving, sending)
- UI states (expanded, selectedTab, etc.)
- Data (messages, notes, chats)

### No Redux/Zustand
- Kept simple with Context API
- Sufficient for current app scope
- Easy to refactor if needed

---

## Accessibility Features

### Semantic HTML
- `<main>`, `<nav>`, `<article>`, `<section>`
- Proper heading hierarchy (h1, h2, h3)
- `<label>` with `htmlFor` for form inputs

### ARIA Attributes
- `role="button"` for button-like divs
- `aria-label` for icon buttons
- `aria-expanded` for collapsible sections

### Keyboard Navigation
- Tab order for form inputs
- Enter to submit forms
- Escape to close overlays

### Color Contrast
- WCAG AA compliant text contrast
- Not relying only on color for information

---

## Performance Optimizations

- Code splitting with Next.js dynamic imports
- Component memoization where needed
- Optimized re-renders with proper dependencies
- CSS class names (no inline styles)
- Image optimization with Next.js Image

---

## Common Patterns

### Form Submission
```typescript
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    await api.function();
    // Handle success
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

### Conditional Rendering
```typescript
{isLoading ? (
  <LoadingSpinner />
) : isEmpty ? (
  <EmptyState />
) : (
  <Content />
)}
```

### Protected Route
```typescript
useEffect(() => {
  if (!loading && !isAuthenticated) {
    router.push('/login');
  }
}, [isAuthenticated, loading, router]);
```

---

## Tips for Contributing

1. **Follow naming conventions**: PascalCase for components, camelCase for functions
2. **Use TypeScript**: All components should have proper typing
3. **Maintain design system**: Use color tokens, not hex colors
4. **Keep components small**: Each file ~200-300 lines max
5. **Document complex logic**: Add comments for non-obvious code
6. **Test responsive**: Check mobile, tablet, and desktop views

---

Generated for Sukoon v1.0
