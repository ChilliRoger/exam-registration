# Exam Registration System (ERS)

A professional, role-based examination management portal developed for DevOps SRS requirements.

## Features
- **Student Portal**: Subject selection, registration tracking, and schedule viewing.
- **Faculty Portal**: Registration verification and academic reporting.
- **Admin Portal**: Exam scheduling, user management, and system configuration.
- **Security**: JWT-based authentication and role-based access control.
- **Design**: Clean, professional UI using Vanilla CSS (no gradients, no emojis).

## Project Structure
```text
exam-registration/
├── frontend/          # React + Vite application
│   ├── src/components # Reusable UI components
│   ├── src/pages      # Role-specific dashboards
│   └── src/index.css  # Professional design system
└── backend/           # Node.js + Express server
    ├── database.sqlite # SQLite database
    ├── database.js     # Schema and DB logic
    └── index.js       # API endpoints
```

## Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- npm

### 2. Backend Setup
```bash
cd backend
npm install
npm start
```
The server will run on `http://localhost:5000`. It automatically initializes the `database.sqlite` file and seeds initial subject data.

### 3. Frontend Setup
```bash
# In a new terminal
cd frontend
npm install
npm run dev
```
The application will be available at `http://localhost:5173`.

## Usage Guide
1. **Signup**: Create a new account as a **Student** or **Faculty**.
2. **Login**: Sign in with your credentials.
3. **Student Flow**:
   - Go to "Subject Selection".
   - Click "Register" for available subjects.
   - View status in the Dashboard.
4. **Faculty Flow**:
   - Review pending student registrations.
   - Access reports.
5. **Admin Flow**:
   - Manage global exam schedules and hall allocations.
