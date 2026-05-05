# 🚀 Quick Reference - Backend & Frontend Integration

## Start Development Servers

```bash
# Terminal 1
cd back-end && php artisan serve

# Terminal 2  
cd front-end && npm run dev
```

**URLs:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api

---

## API Client Usage

```typescript
import { api } from '@/lib/api';

// Register
const user = await api.register({
  name, email, student_id, course, year_level, password
});

// Login
const { token } = await api.login(email, password);
localStorage.setItem('auth_token', token);

// Get Current User
const user = await api.getCurrentUser(token);

// Logout
await api.logout(token);
localStorage.removeItem('auth_token');
```

---

## Using Auth Context

```typescript
import { useAuth } from '@/lib/auth-context';

export function MyComponent() {
  const { user, token, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) return <div>Not logged in</div>;
  
  return <div>Welcome, {user?.name}!</div>;
}
```

---

## Protected API Route Example

```typescript
// Only accessible with valid token
const response = await api.getProfile(token);
// Backend returns 401 if token invalid/missing
```

---

## Configuration Files

| File | Purpose |
|------|---------|
| `back-end/config/cors.php` | Allow frontend requests |
| `back-end/config/sanctum.php` | Token authentication |
| `front-end/.env.local` | API endpoint URL |
| `back-end/.env` | Database & app config |

---

## Key Endpoints

```
Auth:
  POST   /auth/register
  POST   /auth/login
  POST   /auth/logout
  GET    /auth/user

Public:
  GET    /events
  GET    /announcements
  GET    /events/upcoming

Protected:
  GET    /user/profile
  POST   /user/profile
  GET    /dashboard/student
  GET    /dashboard/admin
```

---

## Database Setup

```bash
cd back-end
php artisan migrate --seed
```

---

## Environment Variables

**Backend (.env):**
```
APP_URL=http://localhost:8000
DB_CONNECTION=mysql
DB_DATABASE=laravel_db
```

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## Token Management

```typescript
// Store token after login
localStorage.setItem('auth_token', response.token);

// Use in API calls
const profile = await api.getProfile(localStorage.getItem('auth_token'));

// Remove on logout
localStorage.removeItem('auth_token');
```

---

## Response Format

**Success:**
```json
{
  "message": "Operation successful",
  "data": { /* user data */ },
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Error:**
```json
{
  "message": "Invalid credentials",
  "errors": { /* validation errors */ }
}
```

---

## Common Commands

```bash
# Backend
php artisan serve              # Start server
php artisan migrate            # Run migrations
php artisan migrate --seed     # Migrations + seeding
php artisan tinker             # Interactive shell

# Frontend
npm run dev                    # Start dev server
npm run build                  # Build for production
npm run lint                   # Run linter
```

---

## Test API in Browser

```javascript
// In DevTools Console

// Register
fetch('http://localhost:8000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test', email: 'test@example.com',
    student_id: 'STU001', course: 'BS CS',
    year_level: '1st Year', password: 'password123',
    password_confirmation: 'password123'
  })
}).then(r => r.json()).then(console.log)

// Get announcements
fetch('http://localhost:8000/api/announcements')
  .then(r => r.json())
  .then(console.log)
```

---

## File Structure

```
back-end/
├── app/Http/Controllers/     ← API logic
├── routes/api.php            ← Endpoints
├── config/
│   ├── cors.php             ← CORS setup
│   └── sanctum.php          ← Auth
└── database/migrations/      ← Schema

front-end/
├── lib/
│   ├── api.ts               ← API client
│   └── auth-context.tsx     ← Auth state
├── app/
│   ├── (auth)/             ← Auth pages
│   ├── (dashboard)/        ← Protected pages
│   └── (public)/           ← Public pages
└── .env.local              ← Config
```

---

## Troubleshooting

| Problem | Check |
|---------|-------|
| CORS error | Backend running? Correct URL in `.env.local`? |
| 404 errors | Correct endpoint? Backend server running? |
| Auth failures | Token in localStorage? Expired? |
| Database errors | MySQL running? Migrations run? |
| Port conflicts | Change with `--port` flag |

---

## Security Reminders

⚠️ **Never**:
- Commit `.env` files
- Expose tokens in code
- Use weak passwords
- Allow all CORS origins in production

✅ **Always**:
- Use HTTPS in production
- Validate input on backend
- Implement CSRF protection
- Set token expiration

---

**Last Updated:** May 5, 2026  
**Status:** ✅ Backend & Frontend Connected
