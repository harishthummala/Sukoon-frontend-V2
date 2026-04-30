# Sukoon - Quick Start Guide

Get Sukoon running in 5 minutes! 🚀

## Prerequisites

- Node.js 18+ installed
- Your Spring Boot backend running on `http://localhost:8080`
- Terminal/command line access

## Step 1: Start the Frontend (30 seconds)

```bash
cd /vercel/share/v0-project
pnpm dev
```

**Output**: 
```
✓ Ready in 540ms
- Local: http://localhost:3000
```

Open http://localhost:3000 in your browser.

---

## Step 2: Test Authentication (1 minute)

### Register a Test Account
1. Click **"Get Started"** on landing page
2. Fill in name, email, password
3. Click **"Create Account"**
4. ✅ Should redirect to dashboard

### Login with Test Account
1. Click **"Log In"** 
2. Enter email and password
3. Click **"Sign In"**
4. ✅ Should show mood selector

---

## Step 3: Test Chat Feature (1 minute)

1. Select a mood (e.g., "Anxious")
2. Type a message in the chat box
3. Click "Send"
4. ✅ Message should appear in chat
5. Wait for AI response from backend
6. ✅ Response should appear as assistant message

**Note**: If messages don't work, check:
- Spring Boot backend is running
- Message counter shows remaining count
- No errors in browser console

---

## Step 4: Test Notes Feature (1 minute)

1. Click **"Notes"** in left sidebar
2. Click **"New Note"** button
3. Enter title and content
4. Click **"Save"**
5. ✅ Note should appear in list
6. Click note to edit
7. Make changes and click **"Save"**
8. ✅ Changes should be saved
9. Click trash icon to delete
10. ✅ Note should be removed

---

## Step 5: Customize (1 minute)

### Change API URL
Edit `lib/api.ts`:
```typescript
const API_BASE_URL = 'http://localhost:8080/api';
```

### Change Colors
Edit `app/globals.css`:
```css
--primary: oklch(0.55 0.2 280);  /* Purple - change to your color */
```

### Change Moods
Edit `app/dashboard/page.tsx`:
```typescript
const moods = [
  { emoji: '😊', label: 'Happy', value: 'happy' },
  // Add more moods here
];
```

### Change Message Limit
Edit `app/dashboard/page.tsx`:
```typescript
const [messageLimit] = useState(20);  // Change to any number
```

---

## Common Issues & Fixes

### ❌ "Cannot POST /api/auth/login"
**Fix**: Ensure Spring Boot backend is running on port 8080
```bash
# In your Spring Boot project terminal
mvn spring-boot:run
```

### ❌ "CORS error in console"
**Fix**: Add CORS headers to Spring Boot:
```java
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class ApiController { }
```

### ❌ "Page shows blank/Loading"
**Fix**: Clear browser cache and reload
```
Ctrl+Shift+Delete (Windows/Linux) or Cmd+Shift+Delete (Mac)
```

### ❌ "Buttons not responsive"
**Fix**: Restart dev server
```bash
Ctrl+C
pnpm dev
```

### ❌ "Authentication not working"
**Fix**: Check localStorage has token
```javascript
// In browser console
localStorage.getItem('auth_token')
// Should return a JWT token
```

---

## File Locations

| Feature | File |
|---------|------|
| Login page | `app/login/page.tsx` |
| Register page | `app/register/page.tsx` |
| Dashboard | `app/dashboard/page.tsx` |
| Chat interface | `app/dashboard/chat/[id]/page.tsx` |
| Notes list | `app/dashboard/notes/page.tsx` |
| Note editor | `app/dashboard/notes/[id]/page.tsx` |
| Sidebar | `components/dashboard/Sidebar.tsx` |
| API calls | `lib/api.ts` |
| Auth logic | `context/AuthContext.tsx` |
| Colors & theme | `app/globals.css` |

---

## Environment Variables

Optional - create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

Then update `lib/api.ts`:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
```

---

## Browser DevTools

### Check API Requests
1. Open DevTools: `F12` or `Ctrl+Shift+I`
2. Go to **Network** tab
3. Reload page
4. Look for `/api/` requests
5. Click request to see:
   - Request headers
   - Response body
   - Status code (200, 401, etc.)

### Check for Errors
1. Go to **Console** tab
2. Look for red error messages
3. Note the error details
4. Check backend logs

### Check LocalStorage
1. Go to **Application** tab
2. Click **Local Storage**
3. Find `http://localhost:3000`
4. Look for `auth_token` key
5. Should contain your JWT token

---

## Testing Checklist

- [ ] Frontend loads at http://localhost:3000
- [ ] Landing page displays properly
- [ ] Can register new account
- [ ] Can login with credentials
- [ ] Dashboard shows mood selector
- [ ] Can select mood and create chat
- [ ] Can send message in chat
- [ ] Message appears in chat window
- [ ] AI response appears (from backend)
- [ ] Message counter updates
- [ ] Can create new note
- [ ] Can edit note
- [ ] Can delete note
- [ ] Can logout
- [ ] Settings page displays

---

## Next Steps

### For Development
1. Read `SETUP_GUIDE.md` for detailed setup
2. Read `COMPONENTS.md` for component overview
3. Read `API_REFERENCE.md` for API details
4. Check `README.md` for full documentation

### For Production
1. Update API URL to production backend
2. Enable HTTPS
3. Configure CORS for production domain
4. Set up authentication tokens properly
5. Add error logging/monitoring
6. Deploy to hosting platform

### For Customization
1. Modify colors in `globals.css`
2. Add more moods in `dashboard/page.tsx`
3. Customize messages and copy throughout
4. Adjust spacing/sizing in components
5. Add your branding/logo

---

## Useful Commands

```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Run production build locally
pnpm start

# Format code (Prettier)
pnpm format

# Check types (TypeScript)
pnpm type-check

# Clear cache and reinstall
rm -rf .next node_modules
pnpm install
```

---

## Getting Help

### Check These First
1. Browser console for errors (F12 → Console)
2. Network tab for API responses (F12 → Network)
3. Backend server logs
4. This Quick Start guide
5. `SETUP_GUIDE.md` and `API_REFERENCE.md`

### Debugging
1. Add `console.log()` in components to trace execution
2. Check Network tab to see exact request/response
3. Verify backend returns correct JSON structure
4. Check browser cache (Ctrl+Shift+Delete)
5. Try incognito/private mode

---

## Performance Tips

- Clear browser cache if seeing old styles
- Restart dev server if seeing stale code
- Check network tab to ensure requests succeed
- Use React DevTools extension to debug components
- Check Lighthouse score: `F12 → Lighthouse`

---

## Success Indicators ✅

You'll know it's working when:

1. ✅ Frontend loads without errors
2. ✅ Can navigate between pages smoothly
3. ✅ Can register and login
4. ✅ Dashboard shows immediately after login
5. ✅ Mood selector is interactive
6. ✅ Chat messages appear and disappear
7. ✅ Message counter decreases with each message
8. ✅ Can create, edit, delete notes
9. ✅ Logout works and redirects to login
10. ✅ No red errors in console

---

## Support

For detailed help:
- **API Issues**: See `API_REFERENCE.md`
- **Components**: See `COMPONENTS.md`
- **Setup**: See `SETUP_GUIDE.md`
- **Architecture**: See `README.md`

---

## That's It! 🎉

Your Sukoon frontend is now running and ready to connect with your backend.

Happy building! 🌙

---

**Quick Links**:
- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- Documentation: See README.md

