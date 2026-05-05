# COECS-LGU Student Activity Management System

A modern, production-ready web platform for managing student attendance, fines, events, payments, clearance status, and communication between students and officers.

## 🎯 Key Features

### Student Features
- ✅ User registration and secure login
- 📊 Personal dashboard with attendance rate, balance, clearance status
- 📅 View upcoming and past events
- 📍 Attendance history tracking
- 💰 Fine and payment tracking
- ✔️ Clearance status checklist
- 💬 Submit feedback, concerns, and inquiries
- 🔔 View announcements and notifications

### Admin/Officer Features
- 📈 Comprehensive dashboard with analytics
- 👥 Student management (activate/deactivate)
- 📅 Event CRUD operations
- 🎯 QR code attendance marking
- 💸 Fine management and payment tracking
- ✅ Student clearance management and signing
- 💌 Message center for responding to student concerns
- 📢 Announcement creation and management

## 🏗️ Technology Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| **Backend** | Laravel 12, PHP 8.2 |
| **Database** | SQLite (default), MySQL supported |
| **Auth** | Laravel Sanctum (API token-based) |
| **API** | RESTful JSON API |

## 📋 Prerequisites

Before you begin, ensure you have:
- **PHP 8.2 or higher**
- **Composer** (for PHP dependencies)
- **Node.js 18 or higher** (for frontend)
- **npm or yarn** (Node.js package manager)
- **Git**
- **SQLite** or MySQL

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

From the project root:

```bash
cd back-end
composer run setup
```

This will automatically:
- Install all dependencies
- Create `.env` file from `.env.example`
- Generate application key
- Run database migrations
- Install frontend dependencies
- Build frontend assets

### Option 2: Manual Setup

#### Backend Setup

```bash
cd back-end

# Install dependencies
composer install

# Create environment file
cp .env.example .env

# Generate app key
php artisan key:generate

# Create SQLite database
touch database/database.sqlite

# Run migrations
php artisan migrate

# Start Laravel development server
php artisan serve
```

The backend API will be available at: `http://localhost:8000/api`

#### Frontend Setup

```bash
cd front-end

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Start development server
npm run dev
```

The frontend will be available at: `http://localhost:3000`

### Running Both Servers Simultaneously

From the `back-end` directory:

```bash
composer run dev
```

This uses `concurrently` to run:
- Laravel server on port 8000
- Queue listener
- Log stream (Pail)
- Vite frontend build server
- Frontend dev server on port 3000

## � Backend & Frontend Connection

The frontend and backend communicate via **REST API** with **Laravel Sanctum** token-based authentication.

### Configuration Included

✅ **CORS Middleware** - Allows frontend requests from `localhost:3000`  
✅ **Sanctum Authentication** - API token-based auth  
✅ **API Client** - Pre-configured in `front-end/lib/api.ts`  
✅ **Auth Context** - User state management in `front-end/lib/auth-context.tsx`

### How It Works

1. User logs in via frontend → Backend returns API token
2. Token is stored in browser (localStorage)
3. Frontend includes token in all API requests (`Authorization: Bearer <token>`)
4. Backend validates token via Sanctum middleware
5. Protected routes return data; invalid tokens return 401

### Documentation

For detailed integration guide, see:
- **[CONNECTION_GUIDE.md](CONNECTION_GUIDE.md)** - Complete API documentation
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Quick lookup guide
- **[SETUP_COMPLETE.md](SETUP_COMPLETE.md)** - Setup checklist

### Quick API Usage

```typescript
import { api } from '@/lib/api';

// Login
const response = await api.login('email@example.com', 'password');
const token = response.token;

// Use token in protected routes
const user = await api.getCurrentUser(token);
const profile = await api.getProfile(token);
```

## �🗄️ Database

### Current Setup
- **Default**: SQLite (file-based, no server needed)
- **Production**: MySQL recommended

### Database Schema

The system includes the following tables:
- `users` - Student and admin accounts
- `events` - Organization events
- `announcements` - News and announcements
- `attendance` - Event attendance records
- `fines` - Fine records
- `payments` - Payment transactions
- `clearances` - Student clearance status
- `feedback` - Student inquiries and complaints
- `notifications` - User notifications

All relationships and constraints are properly defined in migrations.

## 🔐 Authentication & Authorization

### User Roles
1. **Student**: Can view own data, submit feedback, view events
2. **Admin/Officer**: Can manage all system data and students

### Authentication Flow
1. User registers or logs in
2. Backend validates credentials
3. Backend returns API token (Sanctum)
4. Frontend stores token and manages auth context
5. All API requests include authorization header
6. Backend validates token and returns role-based data

### Login Credentials (After Seed)
```
Demo Admin:
Email: admin@coecs.local
Password: password

Demo Student:
Email: student@coecs.local  
Password: password
```

## 📁 Project Structure

```
project/
├── front-end/
│   ├── app/                 # Next.js App Router
│   │   ├── (auth)/         # Authentication pages
│   │   ├── (dashboard)/    # Protected routes
│   │   │   ├── student/    # Student portal
│   │   │   └── admin/      # Admin dashboard
│   │   └── (public)/       # Public pages
│   ├── components/          # Reusable React components
│   ├── lib/                # API client, auth context, utilities
│   └── public/             # Static assets
│
└── back-end/
    ├── app/
    │   ├── Http/
    │   │   ├── Controllers/ # API controllers
    │   │   └── Middleware/  # Auth middleware
    │   ├── Models/          # Eloquent models
    │   └── Providers/       # Service providers
    ├── database/
    │   ├── migrations/     # Database schema
    │   ├── seeders/        # Data seeders
    │   └── factories/      # Model factories
    ├── routes/
    │   ├── api.php         # API routes
    │   └── web.php         # Web routes
    └── config/             # Configuration files
```

## 🔌 API Routes

### Public Endpoints
- `POST /api/auth/register` - Student registration
- `POST /api/auth/login` - User login
- `GET /api/events/upcoming` - Upcoming events
- `GET /api/announcements/latest` - Latest announcements

### Protected Endpoints (Require Authentication)

**User Management**
- `GET /api/user/profile` - Get profile
- `POST /api/user/profile` - Update profile

**Events**
- `GET /api/events` - List events
- `POST /api/events` - Create event (admin)
- `PUT /api/events/{id}` - Update event (admin)
- `DELETE /api/events/{id}` - Delete event (admin)

**Attendance**
- `GET /api/attendance` - List attendance (admin)
- `POST /api/attendance/mark` - Mark attendance (admin)
- `GET /api/attendance/my-history` - User's attendance

**Fines**
- `GET /api/fines` - List fines
- `POST /api/fines` - Create fine (admin)
- `PUT /api/fines/{id}` - Update fine (admin)

**Payments**
- `GET /api/payments` - List payments
- `POST /api/payments` - Record payment (admin)

**Clearance**
- `GET /api/clearance` - Get user's clearance
- `POST /api/clearance/{id}` - Update clearance (admin)

**Feedback**
- `GET /api/feedback` - List feedback
- `POST /api/feedback` - Submit feedback
- `POST /api/feedback/{id}/respond` - Respond (admin)

For complete API documentation, see `SETUP_GUIDE.md`.

## 🎨 UI Components

Pre-built reusable components in `front-end/components/ui.tsx`:
- Button (variants: primary, secondary, danger)
- Input with label and error handling
- Card
- Badge (for status indicators)
- LoadingSpinner
- Table

## 📱 Responsive Design

- Mobile-first approach
- Tailwind CSS responsive utilities
- Sidebar collapses on mobile
- Touch-friendly buttons and inputs
- Optimized for all screen sizes

## 🔒 Security Features

- Secure password hashing (Laravel bcrypt)
- CSRF protection
- API token validation (Sanctum)
- Role-based middleware
- Input validation
- SQL injection prevention (Eloquent ORM)
- XSS protection

## 🧪 Testing

### Running Tests

```bash
cd back-end
php artisan test
```

### Running Linting

```bash
cd front-end
npm run lint
```

## 📦 Building for Production

### Backend

```bash
cd back-end

# Update .env for production
# Set APP_ENV=production
# Set APP_DEBUG=false
# Configure database
# Configure app key

php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Frontend

```bash
cd front-end

# Build optimized production bundle
npm run build

# Start production server
npm start
```

## 🚢 Deployment Guide

See `SETUP_GUIDE.md` for comprehensive deployment instructions including:
- Environment setup
- Database configuration
- CORS configuration
- Server setup (Nginx/Apache)
- SSL certificate setup
- Domain configuration

## 🐛 Troubleshooting

### Backend Issues

**Database not migrating**
```bash
# Clear config cache
php artisan config:clear

# Fresh migrate
php artisan migrate:fresh --seed
```

**Permission errors**
```bash
# Fix storage permissions
chmod -R 775 storage bootstrap/cache
```

### Frontend Issues

**API connection errors**
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- Ensure backend server is running
- Check CORS settings

**Build errors**
```bash
# Clear cache and reinstall
npm run lint --fix
npm run build
```

## 📚 Documentation

- `SETUP_GUIDE.md` - Detailed setup and architecture documentation
- This README - Quick start and overview
- Code comments - In-code documentation

## 🤝 Contributing

This is a student project for the COECS-LGU organization. For modifications:

1. Follow existing code style and patterns
2. Test thoroughly before committing
3. Write clear commit messages
4. Update documentation as needed

## 📄 License

This project is created for COECS-LGU (Center of Excellence in Computer Science - Laguna State Polytechnic University).

## 📞 Support

For issues or questions:
1. Check the documentation files
2. Review the code comments
3. Check GitHub Issues (if applicable)

## ✨ Features Checklist

- ✅ User authentication (register/login)
- ✅ Role-based access control
- ✅ Attendance tracking
- ✅ Fine management
- ✅ Payment tracking
- ✅ Clearance status management
- ✅ Event management
- ✅ Announcement system
- ✅ Feedback & messaging
- ✅ Student dashboard
- ✅ Admin dashboard
- ✅ Responsive UI
- ✅ API documentation
- ⏳ QR code scanning (web-based)
- ⏳ Email notifications
- ⏳ Real-time notifications
- ⏳ Export to CSV/PDF

---

Built with ❤️ for COECS-LGU Student Organization
