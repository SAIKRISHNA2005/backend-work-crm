import mongoose from "mongoose";
import dotenv from "dotenv";
import Attendance, { IAttendance } from "../models/StudentAttendance";
import { IStudentProfile, StudentProfile } from "../models/StudentProfile";
import { ITeacherProfile, TeacherProfile } from "../models/TeacherProfile";
import { IClassInfo, ClassInfo } from "../models/ClassInfo";

dotenv.config();
const MONGO_URI = process.env.DB_URL || "";

// Utility function
function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seedAttendance() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB");

        // Clear previous data
        await Attendance.deleteMany({});
        console.log("🗑️ Cleared previous attendance records");

        // Fetch students, teachers, and classes
        const students = await StudentProfile.find() as IStudentProfile[];
        const teachers = await TeacherProfile.find() as ITeacherProfile[];
        const classes = await ClassInfo.find() as IClassInfo[];

        if (!students.length || !teachers.length || !classes.length) {
            console.error("⚠️ Missing prerequisite data: students, teachers, or classes");
            return;
        }

        const attendanceData: Partial<IAttendance>[] = [];

        for (const student of students) {
            // Find student's class info
            const classInfo = classes.find(c => c._id.equals(student.class_id));
            if (!classInfo) continue;

            // Randomly assign a teacher
            const teacher = teachers[getRandomInt(0, teachers.length - 1)];

            const totalWorkingDays = 200;
            const presentDays = getRandomInt(120, 200);
            const absentDays = totalWorkingDays - presentDays;

            attendanceData.push({
                student_id: student._id,
                class_id: student.class_id,
                school_id: student.school_id,
                teacher_id: teacher._id,
                student_name: student.name,
                home_class_teacher_name: teacher.name,
                yearly_attendance: Math.round((presentDays / totalWorkingDays) * 100),
                monthly_attendance: getRandomInt(70, 100),
                weekly_attendance: getRandomInt(80, 100),
                leave_request_status: ["accepted", "rejected", "pending"][getRandomInt(0, 2)],
                total_working_days: totalWorkingDays,
                present_days: presentDays,
                absent_days: absentDays,
                late_arrivals: getRandomInt(0, 10),
            });
        }

        await Attendance.insertMany(attendanceData);
        console.log(`✅ Seeded ${attendanceData.length} student attendance records successfully!`);

    } catch (err) {
        console.error("❌ Error seeding attendance:", err);
    } finally {
        await mongoose.disconnect();
        console.log("🔌 MongoDB disconnected");
    }
}

seedAttendance();
