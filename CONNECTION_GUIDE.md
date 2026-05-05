# Backend-Frontend Connection Setup

## Overview
This project uses a **Laravel backend API** and a **Next.js frontend**, communicating via REST API with JWT token authentication through Laravel Sanctum.

## Architecture
- **Backend**: Laravel API server on `http://localhost:8000`
- **Frontend**: Next.js application on `http://localhost:3000`
- **Authentication**: Laravel Sanctum with Bearer tokens
- **CORS**: Enabled for frontend origins

## Configuration Files

### Backend Configuration

#### 1. **config/sanctum.php** (NEW)
- Configures stateful domain authentication
- Allows requests from `localhost:3000` and `localhost:3001`
- Sets up token expiration and prefixes

#### 2. **config/cors.php** (NEW)
- Enables CORS for API endpoints
- Allows requests from frontend domains
- Supports credentials (cookies) for authentication

#### 3. **bootstrap/app.php** (UPDATED)
- Added Sanctum middleware for proper authentication
- Ensures frontend requests are treated as stateful

### Frontend Configuration

#### 1. **.env.local** (NEW)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```
- Sets the base URL for all API calls
- Next.js exposes this variable to browser

#### 2. **lib/api.ts** (EXISTING)
- Pre-configured API client with:
  - Automatic token injection in Authorization headers
  - Error handling
  - Parameter parsing
  - All necessary endpoints

## Running Both Servers

### Prerequisites
```bash
# Backend
cd back-end
composer install
php artisan migrate --seed

# Frontend
cd front-end
npm install
```

### Start the Services

**Terminal 1 - Backend:**
```bash
cd back-end
php artisan serve
```
Backend will run on: `http://localhost:8000`

**Terminal 2 - Frontend:**
```bash
cd front-end
npm run dev
```
Frontend will run on: `http://localhost:3000`

## API Usage from Frontend

### 1. **Registration**
```typescript
import { api } from '@/lib/api';

const response = await api.register({
  name: 'John Doe',
  email: 'john@example.com',
  student_id: 'STU001',
  course: 'BS Computer Science',
  year_level: '3rd Year',
  password: 'password123',
  password_confirmation: 'password123'
});

// Response includes: { message, data, user, token }
const token = response.token; // Store this token
```

### 2. **Login**
```typescript
const response = await api.login('john@example.com', 'password123');
const token = response.data.token; // Store the token
```

### 3. **Authenticated Requests**
```typescript
// Get current user
const user = await api.getCurrentUser(token);

// Get user profile
const profile = await api.getProfile(token);

// Get student dashboard
const dashboard = await api.getStudentDashboard(token);
```

### 4. **Token Storage**
Store the token securely (typically in localStorage or httpOnly cookie):
```typescript
// Save token
localStorage.setItem('auth_token', token);

// Use token in requests
const token = localStorage.getItem('auth_token');
```

## Authentication Flow

1. **User registers/logs in** → Backend returns API token
2. **Frontend stores token** → localStorage or cookies
3. **Frontend includes token** → In all subsequent requests as Bearer token
4. **Backend validates token** → Via Sanctum middleware
5. **Response returns** → User data or error

## Available API Endpoints

### Public Endpoints (No Authentication Required)
```
POST   /auth/register
POST   /auth/login
GET    /announcements
GET    /announcements/{id}
GET    /announcements/latest
GET    /events
GET    /events/{id}
GET    /events/upcoming
```

### Protected Endpoints (Requires Token)
```
POST   /auth/logout
GET    /auth/user
GET    /user/profile
POST   /user/profile
GET    /dashboard/admin
GET    /dashboard/student
GET    /attendance
GET    /attendance/my-history
GET    /fines
GET    /fines/{id}
GET    /fines/user/{userId}
POST   /payments
GET    /clearances
POST   /clearances
GET    /feedback
POST   /feedback
```

## Database

The backend uses MySQL (configured in `.env`):
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel_db
DB_USERNAME=root
DB_PASSWORD=
```

Ensure MySQL is running and the database exists:
```bash
mysql -u root
CREATE DATABASE laravel_db;
```

Then run migrations:
```bash
php artisan migrate
```

## Troubleshooting

### CORS Errors
**Issue**: "Access to XMLHttpRequest blocked by CORS policy"
**Solution**: 
- Ensure backend is running
- Check that `localhost:3000` is in `config/cors.php` allowed origins
- Verify `NEXT_PUBLIC_API_URL` is correctly set in `.env.local`

### Token Not Working
**Issue**: "Unauthenticated" errors on protected routes
**Solution**:
- Ensure token is being sent in `Authorization: Bearer <token>` header
- Verify token hasn't expired (stored in localStorage)
- Check that Sanctum middleware is enabled in `bootstrap/app.php`

### API Not Found
**Issue**: "404 Not Found" on API calls
**Solution**:
- Confirm backend is running on port 8000
- Check that API_URL environment variable is correct
- Verify routes exist in `routes/api.php`

## Environment Variables

### Backend (.env)
```
APP_NAME=COECS-LGU-SAM
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000
DB_CONNECTION=mysql
DB_DATABASE=laravel_db
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Security Notes

1. **Token Security**: Never expose tokens in public repositories
2. **CORS**: Only allow trusted frontend domains
3. **HTTPS**: Use HTTPS in production
4. **Environment Variables**: Never commit `.env` files to version control
5. **Token Expiration**: Consider implementing token refresh strategy

## File Locations

```
back-end/
├── config/
│   ├── cors.php (NEW)
│   ├── sanctum.php (NEW)
│   └── auth.php
├── bootstrap/
│   └── app.php (UPDATED)
└── routes/
    └── api.php

front-end/
├── .env.local (NEW)
├── lib/
│   └── api.ts (pre-configured)
└── app/
    └── (dashboard)/
```

## Next Steps

1. Implement auth context in frontend to manage token state
2. Create protected route components
3. Add error handling and loading states
4. Implement token refresh strategy
5. Add request/response interceptors
6. Set up proper error boundaries
