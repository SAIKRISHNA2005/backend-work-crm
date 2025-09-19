-- ===========================================
-- School Management System Database Schema
-- ===========================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- 1. Schools
-- ===========================================
CREATE TABLE schools (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    location TEXT,
    contact_info VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ===========================================
-- 2. Classes
-- ===========================================
CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    school_id INT REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    section VARCHAR(20),
    room_number VARCHAR(20),
    home_teacher_id INT, -- FK to teacher_profiles later
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ===========================================
-- 3. Users (students, teachers, future admin roles)
-- ===========================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    password_hash TEXT NOT NULL,
    role VARCHAR(20) CHECK(role IN ('student','teacher','admin','super_admin')),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ===========================================
-- 4. Student Profiles
-- ===========================================
CREATE TABLE student_profiles (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    school_id INT REFERENCES schools(id) ON DELETE CASCADE,
    class_id INT REFERENCES classes(id) ON DELETE CASCADE,
    roll_number VARCHAR(20),
    name VARCHAR(255) NOT NULL,
    father_name VARCHAR(255),
    mother_name VARCHAR(255),
    father_occupation VARCHAR(100),
    mother_occupation VARCHAR(100),
    blood_group VARCHAR(10),
    father_contact VARCHAR(20),
    mother_contact VARCHAR(20),
    aadhar_number VARCHAR(20),
    bio TEXT,
    superpowers TEXT,
    current_mission TEXT,
    side_quests TEXT,
    joined_on DATE,
    address TEXT,
    location TEXT,
    fee_payment_status VARCHAR(50),
    event_registration_info TEXT,
    classwise_leaderboard_rank INT,
    overall_leaderboard_rank INT,
    active_courses TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ===========================================
-- 5. Teacher Profiles
-- ===========================================
CREATE TABLE teacher_profiles (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    school_id INT REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    blood_group VARCHAR(10),
    address TEXT,
    handling_classes TEXT,
    home_class_id INT REFERENCES classes(id),
    subjects_handled TEXT,
    personal_attendance_percent DECIMAL(5,2),
    leaves_count INT DEFAULT 0,
    salary_status VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ===========================================
-- 6. Subjects
-- ===========================================
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    class_id INT REFERENCES classes(id) ON DELETE CASCADE,
    school_id INT REFERENCES schools(id) ON DELETE CASCADE,
    subject_name VARCHAR(255) NOT NULL,
    teacher_id INT REFERENCES teacher_profiles(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ===========================================
-- 7. Exams & Exam Subjects
-- ===========================================
CREATE TABLE exams (
    id SERIAL PRIMARY KEY,
    class_id INT REFERENCES classes(id) ON DELETE CASCADE,
    school_id INT REFERENCES schools(id) ON DELETE CASCADE,
    exam_name VARCHAR(255),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE exam_subjects (
    id SERIAL PRIMARY KEY,
    exam_id INT REFERENCES exams(id) ON DELETE CASCADE,
    subject_id INT REFERENCES subjects(id),
    exam_date DATE,
    start_time TIME,
    end_time TIME
);

-- ===========================================
-- 8. Marks
-- ===========================================
CREATE TABLE marks (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES student_profiles(id),
    exam_subject_id INT REFERENCES exam_subjects(id),
    marks_obtained DECIMAL(5,2),
    grade VARCHAR(5),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ===========================================
-- 9. Academic Calendar
-- ===========================================
CREATE TABLE academic_calendar (
    id SERIAL PRIMARY KEY,
    class_id INT REFERENCES classes(id),
    school_id INT REFERENCES schools(id),
    month INT CHECK(month BETWEEN 1 AND 12),
    event_type VARCHAR(50) CHECK(event_type IN ('holiday','exam','parent_meeting','other')),
    title VARCHAR(255),
    description TEXT,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ===========================================
-- 10. Student Timetable
-- ===========================================
CREATE TABLE student_timetable (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES student_profiles(id),
    class_id INT REFERENCES classes(id),
    subject_id INT REFERENCES subjects(id),
    day_of_week VARCHAR(10),
    start_time TIME,
    end_time TIME,
    class_type VARCHAR(50) CHECK(class_type IN ('theory','lab','break','lunch','activity')),
    teacher_id INT REFERENCES teacher_profiles(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ===========================================
-- 11. Teacher Timetable
-- ===========================================
CREATE TABLE teacher_timetable (
    id SERIAL PRIMARY KEY,
    teacher_id INT REFERENCES teacher_profiles(id),
    class_id INT REFERENCES classes(id),
    subject_id INT REFERENCES subjects(id),
    day_of_week VARCHAR(10),
    start_time TIME,
    end_time TIME,
    class_type VARCHAR(50),
    room_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ===========================================
-- 12. Attendance
-- ===========================================
CREATE TABLE student_attendance (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES student_profiles(id),
    class_id INT REFERENCES classes(id),
    teacher_id INT REFERENCES teacher_profiles(id),
    date DATE,
    status VARCHAR(20) CHECK(status IN ('present','absent','late')),
    leave_request_status VARCHAR(20) CHECK(leave_request_status IN ('accepted','rejected','pending')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE teacher_attendance (
    id SERIAL PRIMARY KEY,
    teacher_id INT REFERENCES teacher_profiles(id),
    date DATE,
    status VARCHAR(20) CHECK(status IN ('present','absent','late')),
    leave_request_status VARCHAR(20) CHECK(leave_request_status IN ('accepted','rejected','pending')),
    leave_start_date DATE,
    leave_end_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ===========================================
-- 13. Events & Student Event Registration
-- ===========================================
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    school_id INT REFERENCES schools(id),
    title VARCHAR(255),
    description TEXT,
    location TEXT,
    date DATE,
    time TIME,
    venue TEXT,
    status VARCHAR(20) CHECK(status IN ('upcoming','ongoing','past')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE student_event_registration (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES student_profiles(id),
    event_id INT REFERENCES events(id),
    registration_status VARCHAR(20)
);

-- ===========================================
-- 14. Announcements, Achievements, Reminders
-- ===========================================
CREATE TABLE announcements (
    id SERIAL PRIMARY KEY,
    school_id INT REFERENCES schools(id),
    class_id INT REFERENCES classes(id),
    title VARCHAR(255),
    description TEXT,
    date DATE,
    created_by INT REFERENCES users(id)
);

CREATE TABLE achievements (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES student_profiles(id),
    title VARCHAR(255),
    description TEXT,
    date DATE,
    location TEXT,
    award_type VARCHAR(100)
);

CREATE TABLE reminders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    title VARCHAR(255),
    description TEXT,
    reminder_date DATE,
    status VARCHAR(20) CHECK(status IN ('pending','completed'))
);

-- ===========================================
-- 15. Enquiries
-- ===========================================
CREATE TABLE enquiries (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    subject VARCHAR(255),
    category VARCHAR(100),
    description TEXT,
    status VARCHAR(20) CHECK(status IN ('active','resolved','support')),
    date DATE,
    priority VARCHAR(20),
    last_update TIMESTAMP,
    actions_taken TEXT,
    attachment_url TEXT
);

-- ===========================================
-- 16. Fee Structure & Payments
-- ===========================================
CREATE TABLE fee_structure (
    id SERIAL PRIMARY KEY,
    class_id INT REFERENCES classes(id),
    fee_name VARCHAR(255),
    description TEXT,
    amount DECIMAL(10,2),
    due_date DATE
);

CREATE TABLE fee_payments (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES student_profiles(id),
    class_id INT REFERENCES classes(id),
    fee_id INT REFERENCES fee_structure(id),
    status VARCHAR(20) CHECK(status IN ('paid','pending')),
    payment_date DATE,
    transaction_id VARCHAR(100)
);

-- ===========================================
-- 17. Leaderboard
-- ===========================================
CREATE TABLE leaderboard (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES student_profiles(id),
    class_id INT REFERENCES classes(id),
    school_id INT REFERENCES schools(id),
    xp INT,
    percentage DECIMAL(5,2),
    classwise_rank INT,
    overall_rank INT
);

-- ===========================================
-- 18. Digital Notes
-- ===========================================
CREATE TABLE digital_notes (
    id SERIAL PRIMARY KEY,
    class_id INT REFERENCES classes(id),
    subject_id INT REFERENCES subjects(id),
    section_type VARCHAR(20) CHECK(section_type IN ('note','video','assignment')),
    title VARCHAR(255),
    description TEXT,
    resource_url TEXT,
    file_type VARCHAR(50),
    uploaded_at TIMESTAMP DEFAULT NOW(),
    due_date DATE,
    is_important BOOLEAN DEFAULT FALSE,
    added_by_id INT REFERENCES users(id),
    last_seen_at TIMESTAMP
);

-- ===========================================
-- 19. Teacher Notes
-- ===========================================
CREATE TABLE teacher_notes (
    id SERIAL PRIMARY KEY,
    teacher_id INT REFERENCES teacher_profiles(id),
    class_id INT REFERENCES classes(id),
    subject_id INT REFERENCES subjects(id),
    title VARCHAR(255),
    description TEXT,
    file_url TEXT,
    file_type VARCHAR(50),
    uploaded_at TIMESTAMP DEFAULT NOW(),
    is_published BOOLEAN DEFAULT FALSE,
    visibility VARCHAR(20) CHECK(visibility IN ('class','section','school')),
    available_from DATE,
    available_until DATE,
    tags TEXT
);

-- ===========================================
-- 20. Home Class & Handling Class (Teacher-specific)
-- ===========================================
CREATE TABLE home_class (
    id SERIAL PRIMARY KEY,
    teacher_id INT REFERENCES teacher_profiles(id),
    class_id INT REFERENCES classes(id)
);

CREATE TABLE handling_class (
    id SERIAL PRIMARY KEY,
    teacher_id INT REFERENCES teacher_profiles(id),
    class_id INT REFERENCES classes(id)
);

-- ===========================================
-- Indexes for better performance
-- ===========================================

-- Users indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Student profiles indexes
CREATE INDEX idx_student_profiles_user_id ON student_profiles(user_id);
CREATE INDEX idx_student_profiles_class_id ON student_profiles(class_id);
CREATE INDEX idx_student_profiles_roll_number ON student_profiles(roll_number);

-- Teacher profiles indexes
CREATE INDEX idx_teacher_profiles_user_id ON teacher_profiles(user_id);
CREATE INDEX idx_teacher_profiles_home_class_id ON teacher_profiles(home_class_id);

-- Classes indexes
CREATE INDEX idx_classes_school_id ON classes(school_id);
CREATE INDEX idx_classes_name ON classes(name);

-- Subjects indexes
CREATE INDEX idx_subjects_class_id ON subjects(class_id);
CREATE INDEX idx_subjects_teacher_id ON subjects(teacher_id);

-- Attendance indexes
CREATE INDEX idx_student_attendance_student_id ON student_attendance(student_id);
CREATE INDEX idx_student_attendance_date ON student_attendance(date);
CREATE INDEX idx_teacher_attendance_teacher_id ON teacher_attendance(teacher_id);
CREATE INDEX idx_teacher_attendance_date ON teacher_attendance(date);

-- Marks indexes
CREATE INDEX idx_marks_student_id ON marks(student_id);
CREATE INDEX idx_marks_exam_subject_id ON marks(exam_subject_id);

-- Events indexes
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_status ON events(status);

-- Timetable indexes
CREATE INDEX idx_student_timetable_student_id ON student_timetable(student_id);
CREATE INDEX idx_student_timetable_class_id ON student_timetable(class_id);
CREATE INDEX idx_teacher_timetable_teacher_id ON teacher_timetable(teacher_id);

-- ===========================================
-- Triggers for updated_at timestamps
-- ===========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at column
CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON schools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_student_profiles_updated_at BEFORE UPDATE ON student_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teacher_profiles_updated_at BEFORE UPDATE ON teacher_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON subjects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exams_updated_at BEFORE UPDATE ON exams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_marks_updated_at BEFORE UPDATE ON marks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_academic_calendar_updated_at BEFORE UPDATE ON academic_calendar FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_student_timetable_updated_at BEFORE UPDATE ON student_timetable FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teacher_timetable_updated_at BEFORE UPDATE ON teacher_timetable FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_student_attendance_updated_at BEFORE UPDATE ON student_attendance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teacher_attendance_updated_at BEFORE UPDATE ON teacher_attendance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
