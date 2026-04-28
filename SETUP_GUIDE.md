# COECS-LGU Student Activity Management System - Architecture Guide

## System Overview

This is a comprehensive Student Activity Management System built with:
- **Frontend**: Next.js 16 + React 19 + TypeScript + Tailwind CSS
- **Backend**: Laravel 12 + PHP 8.2
- **Database**: SQLite (default, can be changed)
- **API**: RESTful with Sanctum for authentication

## Project Structure

```
project/
├── front-end/          # Next.js frontend application
│   ├── app/            # Next.js App Router
│   ├── components/     # Reusable React components
│   ├── lib/            # API client, auth context, utilities
│   └── public/         # Static assets
│
└── back-end/           # Laravel API backend
    ├── app/
    │   ├── Http/
    │   │   ├── Controllers/  # API controllers
    │   │   └── Middleware/   # Authentication, authorization
    │   └── Models/           # Eloquent models
    ├── database/
    │   ├── migrations/       # Database schema
    │   ├── seeders/          # Data seeders
    │   └── factories/        # Model factories
    ├── routes/
    │   ├── api.php           # API routes
    │   └── web.php           # Web routes
    └── config/               # Configuration files
```

## Database Schema

### Core Tables

1. **users** - Student and admin accounts
   - Fields: name, email, password, student_id, course, year_level, role, phone, qr_code, is_active
   - Roles: student, admin, officer

2. **events** - Organization events
   - Fields: title, description, start_date, end_date, venue, created_by

3. **announcements** - News and notifications
   - Fields: title, content, created_by, is_pinned, published_at

4. **attendance** - Event attendance tracking
   - Fields: user_id, event_id, status(present/absent/excused), marked_at, marked_by
   - Unique constraint: user_id + event_id

5. **fines** - Penalties for absences or violations
   - Fields: user_id, event_id, reason, amount, status(unpaid/paid/cancelled), due_date, paid_at

6. **payments** - Payment records
   - Fields: user_id, fine_id, payable_type, amount, status, reference_code, paid_at

7. **clearances** - Student clearance status
   - Fields: user_id, finance_cleared, attendance_cleared, products_cleared, is_signed, signed_by, signed_at

8. **feedback** - Student inquiries and complaints
   - Fields: user_id, subject, message, type(feedback/complaint/inquiry), status, response, responded_by

9. **notifications** - User notifications
   - Fields: user_id, title, message, type, data(json), read_at

## Installation & Setup

### Prerequisites
- PHP 8.2+
- Node.js 18+
- Composer
- MySQL or SQLite

### Backend Setup

1. **Navigate to backend folder**
   ```bash
   cd back-end
   ```

2. **Install dependencies**
   ```bash
   composer install
   ```

3. **Setup environment**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Create database and migrate**
   ```bash
   # For SQLite (default):
   touch database/database.sqlite
   
   # Run migrations
   php artisan migrate
   ```

5. **Seed database (optional)**
   ```bash
   php artisan db:seed
   ```

6. **Start Laravel development server**
   ```bash
   php artisan serve
   ```
   The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend folder**
   ```bash
   cd front-end
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment**
   ```bash
   cp .env.local.example .env.local
   # Update NEXT_PUBLIC_API_URL if your backend is on a different port
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`

### Using the Provided setup Script

From the back-end directory:
```bash
composer run setup
```

This command will:
- Install PHP dependencies
- Create .env file
- Generate app key
- Run migrations
- Install Node dependencies
- Build frontend assets

### Running Both Servers

From the back-end directory:
```bash
composer run dev
```

This uses concurrently to run:
- Laravel server
- Queue listener
- Pail (log stream)
- Vite dev server

## Key Features Implemented

### Authentication
- User registration with email and student ID
- Secure login with API tokens (Sanctum)
- Role-based access control (Student, Admin, Officer)
- Token-based session management

### Student Features
- Dashboard with attendance rate, unpaid fines, clearance status
- View upcoming and past events
- Attendance history tracking
- Fines and payment tracking
- Clearance status checklist
- Submit feedback and inquiries
- View announcements

### Admin/Officer Features
- Comprehensive dashboard with analytics
- Student management (activate/deactivate accounts)
- Event CRUD operations
- Attendance marking via QR/Student ID
- Fine management
- Payment tracking
- Clearance management and signing
- Message/feedback response center
- Announcement creation

## API Endpoints

### Authentication
- `POST /api/auth/register` - Student registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/user` - Get current user

### Users
- `GET /api/user/profile` - Get user profile
- `POST /api/user/profile` - Update profile
- `GET /api/users` - List students (admin)
- `POST /api/users/{id}/toggle-active` - Toggle user status

### Events
- `GET /api/events` - List events
- `GET /api/events/upcoming` - Get upcoming events
- `POST /api/events` - Create event (admin)
- `PUT /api/events/{id}` - Update event (admin)
- `DELETE /api/events/{id}` - Delete event (admin)

### Attendance
- `GET /api/attendance` - List attendance records
- `POST /api/attendance/mark` - Mark attendance (admin)
- `GET /api/attendance/my-history` - Get user's attendance history

### Fines
- `GET /api/fines` - List fines
- `POST /api/fines` - Create fine (admin)
- `POST /api/fines/{id}` - Update fine status

### Payments
- `GET /api/payments` - List payments
- `POST /api/payments` - Record payment (admin)
- `GET /api/payments-summary` - Payment analytics

### Clearance
- `GET /api/clearance` - Get user's clearance
- `POST /api/clearance/{id}` - Update clearance (admin)

### Feedback
- `GET /api/feedback` - List feedback
- `POST /api/feedback` - Submit feedback
- `POST /api/feedback/{id}/respond` - Respond to feedback (admin)

## Authentication Flow

1. User registers/logs in from frontend
2. Backend validates credentials and returns API token
3. Frontend stores token in localStorage and auth context
4. All subsequent requests include `Authorization: Bearer {token}` header
5. Backend validates token and returns user-specific data
6. Frontend redirects based on user role

## Frontend Routing

### Public Routes
- `/` - Landing page
- `/login` - Login page
- `/register` - Registration page

### Student Routes (Protected)
- `/student/dashboard` - Main dashboard
- `/student/profile` - Profile management
- `/student/events` - View events
- `/student/attendance` - Attendance history
- `/student/fines` - Fines & payments
- `/student/clearance` - Clearance status
- `/student/feedback` - Submit feedback

### Admin Routes (Protected)
- `/admin/dashboard` - Analytics dashboard
- `/admin/students` - Student management
- `/admin/events` - Event management
- `/admin/attendance` - Attendance marking
- `/admin/fines` - Fine management
- `/admin/payments` - Payment tracking
- `/admin/clearance` - Clearance management
- `/admin/messages` - Feedback responses
- `/admin/announcements` - Create announcements

## Important Configurations

### CORS & API Security
- Update `SANCTUM_STATEFUL_DOMAINS` and `SANCTUM_ALLOWED_DOMAINS` in .env for production
- Frontend API URL configured via `NEXT_PUBLIC_API_URL`

### Database
- Currently uses SQLite for simplicity
- To use MySQL, update `.env`:
  ```
  DB_CONNECTION=mysql
  DB_HOST=127.0.0.1
  DB_PORT=3306
  DB_DATABASE=coecs_lgu_sam
  DB_USERNAME=root
  DB_PASSWORD=
  ```

### Sessions
- API uses token-based authentication (Sanctum)
- Sessions can be used for web routes if needed

## Development Guidelines

### Backend (Laravel)
- Controllers handle API logic
- Models handle database interactions
- Middleware handles authentication/authorization
- Routes define API endpoints
- Migrations define database schema

### Frontend (Next.js)
- Components are in `/components`
- Pages are organized by route groups (auth, public, dashboard)
- API calls are centralized in `/lib/api.ts`
- Authentication state managed by `/lib/auth-context.tsx`
- Utility functions in `/lib/utils.ts`

## Common Operations

### Create a New API Endpoint

1. Create controller method in `app/Http/Controllers/`
2. Add route in `routes/api.php`
3. Create frontend API function in `lib/api.ts`
4. Create or update page component to use the API function

### Run Database Migrations

```bash
# Run all pending migrations
php artisan migrate

# Rollback last batch
php artisan migrate:rollback

# Refresh database (caution: deletes data)
php artisan migrate:refresh --seed
```

### Generate Model with Migration

```bash
php artisan make:model ModelName -m
```

## Deployment

### Backend (Laravel)
1. Update `.env` with production settings
2. Run `php artisan config:cache`
3. Run `php artisan migrate --force`
4. Setup a process manager (Supervisor) for queue
5. Configure web server (Nginx/Apache)

### Frontend (Next.js)
1. Run `npm run build`
2. Deploy to hosting service (Vercel, Netlify, etc.)
3. Update API URL in production environment

## Troubleshooting

### API Connection Issues
- Verify `NEXT_PUBLIC_API_URL` matches backend URL
- Check CORS settings in Laravel
- Ensure backend server is running

### Database Errors
- Verify SQLite file exists: `database/database.sqlite`
- Check file permissions: `chmod 777 database/ storage/`
- Run migrations: `php artisan migrate`

### Authentication Failing
- Clear browser localStorage
- Verify token is being sent with requests
- Check user credentials in database

## Security Notes

- Always use HTTPS in production
- Validate all inputs on backend
- Use environment variables for sensitive data
- Implement rate limiting for auth endpoints
- Regularly update dependencies
- Use strong password hashing (Laravel default)

## Next Steps

1. Deploy to production server
2. Setup automated backups
3. Configure email notifications
4. Add payment gateway integration
5. Implement real-time notifications with WebSockets
6. Add CSV export functionality
7. Create mobile-friendly improvements
8. Add dark mode support
