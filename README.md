# School Management System Backend

A comprehensive backend API for a school management system built with Node.js, TypeScript, Express, and Supabase (PostgreSQL).

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Student and teacher profile management
- **Database**: PostgreSQL with Supabase for scalable data management
- **Security**: Helmet, CORS, rate limiting, input validation
- **Logging**: Winston-based structured logging
- **Error Handling**: Comprehensive error handling with custom error classes
- **API Documentation**: RESTful API with proper HTTP status codes

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account and project

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend-work-crm
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
   # Application Configuration
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
   
   Run the SQL schema in your Supabase project:
   ```bash
   # Copy the contents of docs/supabase-schema.sql and run it in your Supabase SQL editor
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

## 📁 Project Structure

```
src/
├── config/           # Configuration files
│   ├── database.ts   # Database connection
│   └── environment.ts # Environment validation
├── controllers/      # Request handlers
│   ├── AuthController.ts
│   ├── StudentController.ts
│   └── TeacherController.ts
├── middleware/       # Express middleware
│   ├── auth.ts       # Authentication middleware
│   ├── errorHandler.ts # Error handling
│   ├── rateLimiter.ts # Rate limiting
│   ├── security.ts   # Security headers
│   └── validation.ts # Input validation
├── models/          # Database models (legacy - being migrated)
├── routes/          # API routes
│   ├── authRoutes.ts
│   ├── studentRoutes.ts
│   ├── teacherRoutes.ts
│   └── ...
├── services/        # Business logic
│   ├── database.ts  # Generic database service
│   ├── UserService.ts
│   ├── StudentService.ts
│   └── TeacherService.ts
├── types/           # TypeScript type definitions
│   ├── index.ts     # Common types
│   └── database.ts  # Database types
├── utils/           # Utility functions
│   └── logger.ts    # Logging configuration
├── app.ts           # Express app configuration
└── server.ts        # Server startup
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Verify token

### Students
- `GET /api/students` - Get all students (with pagination)
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student
- `GET /api/students/search` - Search students
- `GET /api/students/class/:classId` - Get students by class
- `GET /api/students/school/:schoolId` - Get students by school

### Teachers
- `GET /api/teachers` - Get all teachers (with pagination)
- `GET /api/teachers/:id` - Get teacher by ID
- `POST /api/teachers` - Create new teacher
- `PUT /api/teachers/:id` - Update teacher
- `DELETE /api/teachers/:id` - Delete teacher
- `GET /api/teachers/search` - Search teachers
- `GET /api/teachers/school/:schoolId` - Get teachers by school

### Other Endpoints
- `GET /api/classes` - Classes management
- `GET /api/subjects` - Subjects management
- `GET /api/attendance` - Attendance management
- `GET /api/marks` - Marks management
- `GET /api/events` - Events management
- `GET /api/notes` - Notes management
- `GET /api/timetable` - Timetable management

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles
- `student` - Student access
- `teacher` - Teacher access
- `admin` - Administrator access
- `super_admin` - Super administrator access

## 📊 Database Schema

The system uses PostgreSQL with the following main entities:

- **Users** - Base user accounts
- **Student Profiles** - Student-specific information
- **Teacher Profiles** - Teacher-specific information
- **Classes** - Class information
- **Subjects** - Subject information
- **Attendance** - Student and teacher attendance
- **Marks** - Student marks and grades
- **Events** - School events
- **Notes** - Digital notes and resources
- **Timetables** - Class and teacher timetables

## 🛡️ Security Features

- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API rate limiting
- **Input Validation** - Request validation using express-validator
- **Password Hashing** - bcrypt for password security
- **JWT** - Secure token-based authentication

## 📝 Logging

The application uses Winston for structured logging with different levels:
- `error` - Error logs
- `warn` - Warning logs
- `info` - Information logs
- `debug` - Debug logs

Logs are written to:
- Console (development)
- `logs/error.log` (error logs)
- `logs/combined.log` (all logs)

## 🧪 Development

### Scripts
- `npm start` - Start development server with nodemon
- `npm run build` - Build TypeScript to JavaScript

### Environment Variables
All environment variables are validated using Zod schema. See `src/config/environment.ts` for the complete list.

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set production environment variables**
   ```bash
   NODE_ENV=production
   ```

3. **Start the production server**
   ```bash
   node dist/server.js
   ```

## 📚 API Documentation

### Response Format
All API responses follow this format:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "pagination": { ... } // For paginated responses
}
```

### Error Format
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information" // Only in development
}
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

For support and questions, please open an issue in the repository.

## 🔄 Migration from MongoDB

This project has been migrated from MongoDB to Supabase (PostgreSQL). The migration includes:

- Database schema redesign for PostgreSQL
- Service layer implementation for Supabase
- Type-safe database operations
- Enhanced error handling
- Improved security and validation

The old MongoDB models are still present in the `models/` directory for reference but are no longer used.
