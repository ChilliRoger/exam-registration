# Exam Registration System (ERS)

A professional, role-based examination management portal built for DevOps coursework. This system automates exam registration, verification, and scheduling processes for educational institutions.

## Features

### Student Portal
- **Subject Registration**: Browse and register for available exam subjects
- **Dashboard**: View registration status and statistics
- **Exam Schedule**: Access personalized exam timetable with hall details
- **Real-time Status**: Track approval status (Pending/Approved/Rejected)

### Faculty Portal
- **Verification Dashboard**: Review and approve/reject student registrations
- **Student Details**: View comprehensive registration information
- **Reports**: Access attendance sheets and registration summaries

### Admin Portal
- **Exam Scheduling**: Create and manage exam schedules
- **Hall Allocation**: Assign examination halls and time slots
- **System Overview**: Monitor total exams and registrations

### Security & Quality
- JWT-based authentication with 24-hour token expiry
- Role-based access control (Student/Faculty/Admin)
- Password hashing with bcrypt
- Input validation and error handling
- SQLite database for reliable data persistence

## Technology Stack

**Frontend:**
- React 18 with Vite
- React Router for navigation
- Lucide React for icons
- Vanilla CSS (professional design system)

**Backend:**
- Node.js with Express
- SQLite3 database
- JWT for authentication
- bcryptjs for password security

## Project Structure

```
exam-registration/
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── pages/           # Role-specific dashboards
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── FacultyDashboard.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── App.jsx          # Main routing
│   │   ├── main.jsx         # React entry point
│   │   └── index.css        # Design system
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── backend/
    ├── database.js          # SQLite schema & initialization
    ├── index.js             # Express server & API routes
    ├── .env                 # Environment variables
    └── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm (comes with Node.js)

### Step 1: Clone or Download
```bash
cd exam-registration
```

### Step 2: Backend Setup
```bash
cd backend
npm install
npm start
```

The backend server will start on `http://localhost:5000` and automatically:
- Create the SQLite database (`database.sqlite`)
- Initialize all required tables
- Seed sample subjects and exams

### Step 3: Frontend Setup
Open a **new terminal** window:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

## User Roles & Login Types

The system supports **three distinct user roles**, each with specific permissions and features:

### 🎓 Student Role
**Purpose**: Register for exams and track registration status

**How to Create Account**:
1. Go to Signup page
2. Select "Student" from the role dropdown
3. Complete registration

**Login Credentials Format**:
- Email: `student@university.edu` (or your registered email)
- Password: Your chosen password (minimum 6 characters)

**Available Features**:
- ✅ **Dashboard**: View statistics (Total Registrations, Pending Approvals, Approved Exams)
- ✅ **Subject Selection**: Browse available subjects and register for exams
- ✅ **Exam Schedule**: View personalized exam timetable with:
  - Subject details (Code & Name)
  - Exam date
  - Hall allocation
  - Time slot (Morning/Afternoon)
- ✅ **Registration Status Tracking**: Monitor approval status in real-time
  - 🟡 Pending: Awaiting faculty approval
  - 🟢 Approved: Ready to take exam
  - 🔴 Rejected: Registration denied

**Restrictions**:
- ❌ Cannot approve/reject registrations
- ❌ Cannot create exam schedules
- ❌ Cannot access faculty or admin dashboards

---

### 👨‍🏫 Faculty Role
**Purpose**: Verify and approve student exam registrations

**How to Create Account**:
1. Go to Signup page
2. Select "Faculty" from the role dropdown
3. Complete registration

**Login Credentials Format**:
- Email: `faculty@university.edu` (or your registered email)
- Password: Your chosen password (minimum 6 characters)

**Available Features**:
- ✅ **Verification Dashboard**: Review all pending student registrations with:
  - Student name and email
  - Subject code and name
  - Exam date
  - Current status
- ✅ **Approve/Reject Actions**: 
  - Click "Approve" to allow student to take exam
  - Click "Reject" to deny registration
  - Changes reflect immediately in student dashboard
- ✅ **Student Details**: View comprehensive registration information
- ✅ **Reports Section**: Access to:
  - Attendance sheets
  - Registration summaries

**Restrictions**:
- ❌ Cannot register for exams
- ❌ Cannot create exam schedules (Admin only)
- ❌ Cannot access student or admin dashboards

---

### 👨‍💼 Admin Role
**Purpose**: Manage exam schedules and system configuration

**How to Create Account**:
> **Note**: For security reasons, Admin accounts cannot be created directly through signup.

**Method 1 - Manual Database Update** (Recommended for first admin):
1. Create a Faculty account through signup
2. Stop the backend server
3. Open `backend/database.sqlite` with SQLite browser
4. Find your user in the `users` table
5. Change `role` from `'faculty'` to `'admin'`
6. Restart backend and login

**Method 2 - Existing Admin Creates** (Future enhancement):
- An existing admin can promote faculty to admin role

**Login Credentials Format**:
- Email: Your registered email (upgraded to admin)
- Password: Your original password

**Available Features**:
- ✅ **Exam Schedule Management**: 
  - Create new exam schedules
  - Assign subjects to exam slots
  - Set exam dates (with date picker)
  - Allocate examination halls
  - Define time slots (Morning 9AM-12PM / Afternoon 1PM-4PM)
- ✅ **System Overview Dashboard**:
  - Total exams scheduled counter
  - Complete exam schedule table
- ✅ **Subject Management**: View all available subjects
- ✅ **Schedule Viewing**: See all created exam schedules with:
  - Exam code
  - Subject name
  - Date
  - Hall allocation
  - Time slot

**Restrictions**:
- ❌ Cannot register for exams as student
- ❌ Cannot access student dashboard
- ✅ **Can** verify registrations (has faculty permissions)

---

---

## Pre-Created Test Accounts

For easy testing and evaluation, the system **automatically creates** three test accounts when you first start the backend server:

| Role | Email | Password | Features |
|------|-------|----------|----------|
| 🎓 **Student** | `student@university.edu` | `student123` | Register for exams, view schedules, track status |
| 👨‍🏫 **Faculty** | `faculty@university.edu` | `faculty123` | Verify registrations, approve/reject, reports |
| 👨‍💼 **Admin** | `admin@university.edu` | `admin123` | Create exam schedules, manage system |

**💡 Quick Access:** Click the **"Test Accounts"** help button on the login page to:
- View all test credentials
- See feature lists for each role
- Auto-fill login form with one click

These accounts are created automatically on first database initialization, so you can start testing immediately!

---

## Complete Usage Guide

### 1. First Time Setup

**Option A: Use Test Accounts (Recommended for Quick Testing)**
- Navigate to `http://localhost:5173`
- Click the **"Test Accounts"** button (top-right corner)
- Click on any account card to auto-fill credentials
- Click "Sign In" to access the dashboard

**Option B: Create Your Own Account**
- Navigate to `http://localhost:5173`
- Click "Create account"
- Fill in required information:
  - Full Name
  - Email Address (use university email format)
  - Password (minimum 6 characters)
  - Role: Select **Student** or **Faculty**
- Click "Register"
- You'll see a success message

**Step 2: Login**
- Enter your registered email
- Enter your password
- Click "Sign In"
- You'll be automatically redirected to your role-specific dashboard

---

### 2. Student Complete Workflow

**A. Register for Exams**
1. After login, click "Subject Selection" in the sidebar
2. Browse available subjects (shows code, name, and credits)
3. Click "Register" button next to desired subject
4. Confirm the success message
5. Registration status will be "Pending"

**B. Check Registration Status**
1. Go to "Dashboard" from sidebar
2. View your statistics:
   - Total registered exams
   - Pending approvals count
   - Approved exams count
3. Scroll to "Active Registrations" table
4. Check status badges:
   - 🟡 Yellow = Pending
   - 🟢 Green = Approved
   - 🔴 Red = Rejected

**C. View Exam Schedule**
1. Click "Schedules" in sidebar
2. See only **approved** exams
3. View complete details:
   - Subject code and name
   - Exam date
   - Hall location
   - Time slot

**D. Logout**
- Click "Logout" button in top-right navbar
- You'll be redirected to login page

---

### 3. Faculty Complete Workflow

**A. Review Pending Registrations**
1. After login, click "Verifications" in sidebar
2. View table with all pending student registrations
3. See student details:
   - Name
   - Email
   - Subject registered
   - Exam date

**B. Approve Registration**
1. Find the student registration to approve
2. Click green "Approve" button
3. Confirm the success alert
4. Registration disappears from pending list
5. Student can now see it as "Approved" in their dashboard

**C. Reject Registration**
1. Find the student registration to reject
2. Click red "Reject" button
3. Confirm the action
4. Registration is marked as rejected
5. Student will see "Rejected" status

**D. Access Reports**
1. Scroll to "Exam Reports" section
2. Click on:
   - "Attendance Sheet" for exam attendance
   - "Registration Summary" for overview

---

### 4. Admin Complete Workflow

**A. Create Exam Schedule**
1. After login, go to "Manage Exams" in sidebar
2. Click "Add New Schedule" button
3. Fill in the form:
   - **Subject**: Select from dropdown (e.g., CS401 - Software Engineering)
   - **Exam Date**: Pick date from calendar (must be future date)
   - **Hall Allocation**: Enter hall details (e.g., "Hall A, Room 101")
   - **Time Slot**: Choose Morning or Afternoon
4. Click "Save Schedule"
5. Success message appears
6. New exam appears in the schedule table

**B. View All Exam Schedules**
1. Go to "Manage Exams"
2. Scroll to exam schedule table
3. View all scheduled exams with:
   - Exam code
   - Subject name
   - Date
   - Hall
   - Time slot
4. Exams are sorted by date

**C. Monitor System**
1. Check "Exams Scheduled" counter in dashboard
2. Review complete exam list
3. Ensure no scheduling conflicts

---

### 5. Common Scenarios

**Scenario 1: Student Registers and Gets Approved**
1. Student logs in → Subject Selection → Registers for CS401
2. Status shows "Pending" in dashboard
3. Faculty logs in → Verifications → Sees student's registration
4. Faculty clicks "Approve"
5. Student refreshes dashboard → Status changes to "Approved"
6. Student goes to Schedules → Sees exam details with hall and time

**Scenario 2: Admin Creates New Exam**
1. Admin logs in → Manage Exams → Add New Schedule
2. Selects CS403, Date: 2026-06-10, Hall: "Hall B", Slot: Morning
3. Clicks Save
4. Students can now see CS403 in Subject Selection
5. Students can register for this new exam

**Scenario 3: Duplicate Registration Prevention**
1. Student registers for CS401
2. Student tries to register for CS401 again
3. System shows error: "Already registered for this exam"
4. Registration is prevented

---

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - User login

### Subjects & Exams
- `GET /api/subjects` - Get all subjects
- `GET /api/exams` - Get all exam schedules
- `POST /api/exams` - Create exam schedule (Admin only)

### Registrations
- `POST /api/register` - Register for exam (Student)
- `GET /api/registrations/my` - Get my registrations (Student)
- `GET /api/registrations/pending` - Get pending verifications (Faculty/Admin)
- `POST /api/registrations/:id/verify` - Approve/Reject registration (Faculty/Admin)

## Database Schema

### Users Table
- `id`, `name`, `email`, `password` (hashed), `role`

### Subjects Table
- `id`, `code`, `name`, `credits`, `faculty_id`

### Exams Table
- `id`, `subject_id`, `date`, `hall`, `slot`

### Registrations Table
- `id`, `student_id`, `exam_id`, `status`, `payment_status`

## Default Test Data

The system comes pre-seeded with:
- **Subjects**: CS401 (Software Engineering), CS402 (Database Management), CS403 (Computer Networks)
- **Exams**: 2 sample exams scheduled for May 2026

## Troubleshooting

### Port Already in Use
If port 5000 or 5173 is busy:
- Backend: Edit `backend/.env` and change `PORT=5000` to another port
- Frontend: Vite will automatically suggest an alternative port

### Database Issues
Delete `backend/database.sqlite` and restart the backend server to recreate the database.

### CORS Errors
Ensure both frontend and backend are running. The backend is configured to accept requests from all origins.

## Production Deployment

### Backend
1. Set `NODE_ENV=production` in `.env`
2. Use a production-grade database (PostgreSQL/MySQL)
3. Set a strong `JWT_SECRET`
4. Deploy to services like Heroku, Railway, or DigitalOcean

### Frontend
```bash
cd frontend
npm run build
```
Deploy the `dist/` folder to Netlify, Vercel, or any static hosting service.

## Contributing
This project was developed as part of a DevOps Software Requirements Specification (SRS) assignment.

## License
MIT License - Free to use for educational purposes.

## Support
For issues or questions, please create an issue in the repository or contact the development team.
