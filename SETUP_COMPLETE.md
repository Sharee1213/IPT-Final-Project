# Backend-Frontend Connection - Setup Summary

## ✅ What Has Been Configured

### Backend Configuration
1. **CORS Middleware** (`config/cors.php`) ✓
   - Allows requests from frontend (localhost:3000, localhost:3001)
   - Enables credentials for stateful authentication
   - Configured for development environment

2. **Sanctum Authentication** (`config/sanctum.php`) ✓
   - API token-based authentication
   - Stateful domain configuration for trusted frontend
   - Token expiration and prefix settings

3. **Middleware Setup** (`bootstrap/app.php`) ✓
   - Added Sanctum middleware for proper request handling
   - Ensures frontend requests are treated as stateful

4. **Environment File** (`.env`) ✓
   - App configuration already present
   - Database connection configured (MySQL)
   - VITE_FRONTEND_URL set for reference

### Frontend Configuration
1. **Environment Variable** (`.env.local`) ✓
   - `NEXT_PUBLIC_API_URL=http://localhost:8000/api`
   - Used by all API calls in `lib/api.ts`

2. **API Client** (`lib/api.ts`) ✓
   - Pre-configured with all necessary endpoints
   - Automatic token injection in headers
   - Built-in error handling

3. **Auth Context** (`lib/auth-context.tsx`) ✓
   - User state management
   - Token storage and retrieval
   - Login/Logout/Register flows
   - Role-based access control

## 🚀 How to Start Development

### Windows Users:
```batch
Double-click: setup.bat
```

Or manually:

**Terminal 1 (Backend):**
```bash
cd back-end
composer install
php artisan migrate --seed
php artisan serve
```

**Terminal 2 (Frontend):**
```bash
cd front-end
npm install
npm run dev
```

### Mac/Linux Users:
```bash
bash setup.sh
```

Or follow the manual steps above.

## 📡 API Communication Flow

```
Frontend (Next.js)
    ↓
lib/api.ts (Makes HTTP requests)
    ↓
Includes Authorization: Bearer {token}
    ↓
Backend (Laravel)
    ↓
routes/api.php (Routes requests)
    ↓
Sanctum Middleware (Validates token)
    ↓
Controllers (Process request)
    ↓
Returns JSON response
    ↓
Frontend receives data
```

## 🔐 Authentication Flow

1. **User Registration/Login**
   ```typescript
   const response = await api.register(userData);
   // or
   const response = await api.login(email, password);
   ```

2. **Token Storage**
   ```typescript
   localStorage.setItem('auth_token', response.token);
   ```

3. **Use Token in Requests**
   ```typescript
   const profile = await api.getProfile(token);
   // Token automatically added to Authorization header
   ```

4. **Backend Validates**
   - Sanctum middleware validates token
   - Returns user data if valid
   - Returns 401 if invalid/expired

## 📋 Available Endpoints

**Public (No Auth Required):**
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /events` - List events
- `GET /announcements` - List announcements

**Protected (Auth Required):**
- `GET /auth/user` - Get current user
- `POST /auth/logout` - Logout
- `GET /user/profile` - Get user profile
- `GET /dashboard/student` - Student dashboard
- `GET /attendance` - Attendance data
- `GET /fines` - Fines data

*See CONNECTION_GUIDE.md for complete endpoint list*

## 🔧 File Locations

```
Project Root/
├── CONNECTION_GUIDE.md (Comprehensive documentation)
├── setup.bat (Windows setup script)
├── setup.sh (Mac/Linux setup script)
│
├── back-end/
│   ├── config/
│   │   ├── cors.php (NEW - CORS Configuration)
│   │   ├── sanctum.php (NEW - Token Authentication)
│   │   └── auth.php (Existing - Auth config)
│   ├── bootstrap/
│   │   └── app.php (UPDATED - Middleware)
│   ├── routes/
│   │   └── api.php (API endpoints)
│   ├── .env (Environment variables)
│   └── ...
│
└── front-end/
    ├── .env.local (NEW - Frontend API URL)
    ├── lib/
    │   ├── api.ts (API client)
    │   └── auth-context.tsx (Auth state)
    └── ...
```

## ✨ Features Now Enabled

- ✅ Frontend can make requests to backend API
- ✅ CORS properly configured for development
- ✅ Token-based authentication working
- ✅ Automatic token injection in requests
- ✅ User state management in frontend
- ✅ Error handling and validation
- ✅ Protected API routes
- ✅ Public and private endpoints

## 🧪 Testing the Connection

1. **Start both servers** (see "How to Start Development" above)

2. **Test in browser console:**
   ```javascript
   // In frontend, open DevTools console
   fetch('http://localhost:8000/api/announcements')
     .then(r => r.json())
     .then(d => console.log(d))
   ```

3. **Test registration:**
   ```javascript
   fetch('http://localhost:8000/api/auth/register', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       name: 'Test User',
       email: 'test@example.com',
       student_id: 'STU001',
       course: 'BS CS',
       year_level: '1st Year',
       password: 'password123',
       password_confirmation: 'password123'
     })
   })
   .then(r => r.json())
   .then(d => console.log(d))
   ```

## 🐛 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| CORS Error | Ensure backend is running on port 8000 |
| Token not working | Check token is in localStorage and valid |
| 404 on API calls | Verify `NEXT_PUBLIC_API_URL` in `.env.local` |
| Database errors | Run `php artisan migrate` |
| Port already in use | Change port with `--port=8001` flag |

## 📚 Next Steps

1. Implement login page in frontend
2. Add protected routes component
3. Test all API endpoints
4. Add error boundaries
5. Implement token refresh strategy
6. Add loading states and spinners
7. Style authentication pages
8. Set up production deployment

## 📝 Database Setup

The backend uses MySQL. Ensure:

1. MySQL is running
2. Database exists (or create with):
   ```bash
   mysql -u root -p
   CREATE DATABASE laravel_db;
   ```
3. Run migrations:
   ```bash
   cd back-end
   php artisan migrate
   ```

## 🎯 Success Indicators

You'll know everything is connected when:
- ✅ Frontend loads without CORS errors
- ✅ Can successfully register a new user
- ✅ Can login and receive a token
- ✅ Can access protected routes with token
- ✅ Can fetch user profile data
- ✅ Can see data in browser DevTools Network tab

---

**For detailed API documentation, see: CONNECTION_GUIDE.md**
