# School Management System - Backend

A comprehensive Express.js backend API for a school management system built with TypeScript, Supabase, and modern security practices.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Student, teacher, and admin user management
- **Student Management**: Complete student profile and academic management
- **Teacher Management**: Teacher profiles and class assignments
- **Attendance Tracking**: Student attendance management
- **Marks Management**: Academic performance tracking
- **Class & Subject Management**: Academic structure management
- **Event Management**: School events and announcements
- **Notes Management**: Teacher notes and resources
- **Database**: Supabase PostgreSQL with type-safe operations

## 🛠️ Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT with bcrypt

## 🔐 Authentication & Authorization

The API uses JWT-based authentication with role-based access control:

- **Student**: Can view their own data, marks, attendance, events, and published notes
- **Teacher**: Can manage students, marks, attendance, events, and notes in their classes
- **Admin**: Full access to all resources and user management

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=3000
   FRONTEND_URL=http://localhost:3000
   
   # Supabase Configuration
   SUPABASE_URL=your-supabase-url
   SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-that-is-at-least-32-characters-long
   JWT_EXPIRES_IN=7d
   
   # Security Configuration
   BCRYPT_ROUNDS=12
   UPLOAD_MAX_SIZE=10485760
   
   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   
   # Logging
   LOG_LEVEL=info
   ```

4. **Database Setup**
   - Create a Supabase project
   - Run the SQL schema from `docs/supabase-schema.sql`
   - Update the environment variables with your Supabase credentials

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Verify token

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Create student
- `GET /api/students/:id` - Get student by ID
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student
- `GET /api/students/search` - Search students
- `GET /api/students/class/:classId` - Get students by class
- `GET /api/students/school/:schoolId` - Get students by school

### Teachers
- `GET /api/teachers` - Get all teachers
- `POST /api/teachers` - Create teacher
- `GET /api/teachers/:id` - Get teacher by ID
- `PUT /api/teachers/:id` - Update teacher
- `DELETE /api/teachers/:id` - Delete teacher
- `GET /api/teachers/search` - Search teachers
- `GET /api/teachers/school/:schoolId` - Get teachers by school

### Attendance
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance` - Create attendance record
- `PUT /api/attendance/:id` - Update attendance record
- `POST /api/attendance/bulk` - Bulk update attendance
- `DELETE /api/attendance/:id` - Delete attendance record

### Marks
- `GET /api/marks` - Get marks records
- `POST /api/marks` - Create marks record
- `PUT /api/marks/:id` - Update marks record
- `GET /api/marks/student/:studentId` - Get marks by student
- `DELETE /api/marks/:id` - Delete marks record

### Classes
- `GET /api/classes` - Get all classes
- `POST /api/classes` - Create class
- `GET /api/classes/:id` - Get class by ID
- `PUT /api/classes/:id` - Update class
- `DELETE /api/classes/:id` - Delete class
- `GET /api/classes/school/:schoolId` - Get classes by school

### Subjects
- `GET /api/subjects` - Get all subjects
- `POST /api/subjects` - Create subject
- `GET /api/subjects/:id` - Get subject by ID
- `PUT /api/subjects/:id` - Update subject
- `DELETE /api/subjects/:id` - Delete subject
- `GET /api/subjects/class/:classId` - Get subjects by class

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event
- `GET /api/events/:id` - Get event by ID
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `GET /api/events/upcoming` - Get upcoming events
- `GET /api/events/school/:schoolId` - Get events by school

### Notes
- `GET /api/notes` - Get all notes
- `POST /api/notes` - Create note
- `GET /api/notes/:id` - Get note by ID
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `GET /api/notes/published` - Get published notes
- `GET /api/notes/teacher/:teacherId` - Get notes by teacher
- `GET /api/notes/class/:classId` - Get notes by class
- `PUT /api/notes/:id/publish` - Publish/unpublish note

### Timetable
- `GET /api/timetable` - Get timetable (placeholder)
- `POST /api/timetable` - Create timetable entry (placeholder)
- `PUT /api/timetable/:id` - Update timetable entry (placeholder)
- `GET /api/timetable/class/:classId` - Get timetable by class (placeholder)
- `GET /api/timetable/teacher/:teacherId` - Get timetable by teacher (placeholder)
