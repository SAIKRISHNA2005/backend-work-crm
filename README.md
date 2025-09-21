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
- **Security**: Rate limiting, CORS, Helmet, input validation
- **Logging**: Comprehensive logging with Winston
- **Database**: Supabase PostgreSQL with type-safe operations

## 🛠️ Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT with bcrypt
- **Validation**: Express-validator with Zod
- **Security**: Helmet, CORS, Rate limiting
- **Logging**: Winston
- **Development**: ts-node-dev

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.ts  # Supabase configuration
│   │   └── environment.ts # Environment variables
│   ├── controllers/     # Route controllers
│   │   ├── AuthController.ts
│   │   ├── StudentController.ts
│   │   ├── TeacherController.ts
│   │   ├── AttendanceController.ts
│   │   ├── MarksController.ts
│   │   ├── ClassController.ts
│   │   ├── SubjectController.ts
│   │   ├── EventController.ts
│   │   ├── NoteController.ts
│   │   └── TimetableController.ts
│   ├── middleware/      # Express middleware
│   │   ├── auth.ts      # Authentication middleware
│   │   ├── errorHandler.ts # Error handling
│   │   ├── rateLimiter.ts # Rate limiting
│   │   ├── security.ts  # Security headers
│   │   └── validation.ts # Input validation
│   ├── routes/          # API routes
│   │   ├── authRoutes.ts
│   │   ├── studentRoutes.ts
│   │   ├── teacherRoutes.ts
│   │   ├── attendanceRoutes.ts
│   │   ├── marksRoutes.ts
│   │   ├── classRoutes.ts
│   │   ├── subjectRoutes.ts
│   │   ├── eventRoutes.ts
│   │   ├── noteRoutes.ts
│   │   └── timetableRoutes.ts
│   ├── services/        # Business logic
│   │   ├── database.ts  # Database service
│   │   ├── UserService.ts
│   │   ├── StudentService.ts
│   │   └── TeacherService.ts
│   ├── types/           # TypeScript types
│   │   ├── index.ts     # Common types
│   │   └── database.ts  # Database types
│   ├── utils/           # Utility functions
│   │   └── logger.ts    # Logging configuration
│   ├── app.ts           # Express app configuration
│   └── server.ts        # Server startup
├── docs/                # Documentation
│   └── supabase-schema.sql
├── logs/                # Log files
├── dist/                # Compiled JavaScript
├── package.json
├── tsconfig.json
└── README.md
```

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

## 🔐 Authentication & Authorization

The API uses JWT-based authentication with role-based access control:

- **Student**: Can view their own data, marks, attendance, events, and published notes
- **Teacher**: Can manage students, marks, attendance, events, and notes in their classes
- **Admin**: Full access to all resources and user management
- **Super Admin**: System-wide administrative access

## 🛡️ Security Features

- **Rate Limiting**: Prevents abuse with configurable limits
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers for protection
- **Input Validation**: Comprehensive validation using express-validator
- **Password Hashing**: bcrypt with configurable rounds
- **JWT Security**: Secure token generation and verification

## 📊 Logging

The application uses Winston for comprehensive logging:

- **Error Logs**: Stored in `logs/error.log`
- **Combined Logs**: Stored in `logs/combined.log`
- **Console Logs**: Development mode console output
- **HTTP Logs**: Morgan HTTP request logging

## 🗄️ Database Schema

The application uses Supabase (PostgreSQL) with the following main tables:

- `schools` - School information
- `classes` - Class/grade information
- `users` - User accounts and authentication
- `student_profiles` - Student detailed information
- `teacher_profiles` - Teacher detailed information
- `subjects` - Subject information
- `student_attendance` - Attendance records
- `marks` - Academic marks and grades
- `events` - School events and announcements
- `teacher_notes` - Teacher notes and resources

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run tests with coverage
npm run test:coverage
```

## 📝 API Documentation

The API follows RESTful conventions with consistent response formats:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

## 🚀 Deployment

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use strong JWT secrets
- Configure proper CORS origins
- Set up proper logging levels
- Configure rate limiting for production load

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Check the API documentation
- Review the logs in the `logs/` directory
- Ensure all environment variables are properly configured
- Verify Supabase connection and schema setup