import mongoose from "mongoose";
import dotenv from "dotenv";
import { ClassInfo } from "../models/ClassInfo";
import { StudentProfile } from "../models/StudentProfile";
import { TeacherProfile } from "../models/TeacherProfile";
import { SubjectInfo } from "../models/SubjectInfo";
import StudentTimetable from "../models/StudentTimetable";
import { Marks } from "../models/Marks";
import { Attendance } from "../models/Attendance";
import { Events } from "../models/EventsSchema";

dotenv.config();

const MONGO_URI = process.env.DB_URL || "mongodb://127.0.0.1:27017/test";

async function seedDemo() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  // Cleanup
  await Promise.all([
    ClassInfo.deleteMany({ class_id: { $in: ["XI-A Commerce"] } }),
    StudentProfile.deleteMany({ student_id: { $in: ["ST001"] } }),
    TeacherProfile.deleteMany({ teacherId: { $in: ["T001"] } }),
    SubjectInfo.deleteMany({}),
    StudentTimetable.deleteMany({}),
    Marks.deleteMany({ student_id: { $in: ["ST001"] } }),
    Attendance.deleteMany({ student_id: { $in: ["ST001"] } }),
  ]);

  // Class
  const cls = await ClassInfo.create({ class_id: "XI-A Commerce", classroom_number: "A12", home_class_teacher_name: "Mrs. Divya V" });

  // Student
  const student = await StudentProfile.create({
    student_id: "ST001",
    class_id: "XI-A Commerce",
    password: "password",
    name: "Aryan Patel",
    roll_number: "11A2-07",
    class_section: "A2",
    school_name: "Maharishi Vidya Mandir Senior Secondary School, Chetpet",
    phone_number: "9999999999",
    email: "aryan@example.com",
    current_mission: "Dominate board exams & crack IIT 🚀",
    bio: "Math wizard | Physics enthusiast | Future engineer",
    superpowers: ["Problem Solving", "Mathematics", "Leadership", "Physics"],
    active_courses: ["Advanced Mathematics", "Physics Mastery", "Chemistry Foundation"],
    side_quests: ["Science Club President", "Math Olympiad Training"],
  });

  // Teacher
  const teacher = await TeacherProfile.create({
    teacherId: "T001",
    name: "Mrs. Divya V",
    phoneNumber: "8888888888",
    password: "password",
    email: "divya@example.com",
    address: "Chennai",
    bloodGroup: "O+",
    handlingClassIds: ["XI-A Commerce"],
    homeClassId: "XI-A Commerce",
    handlingSubjects: ["Mathematics"],
    personalAttendancePercent: 97,
    numberOfLeaves: 1,
    salaryStatus: "credited",
  });

  // Subjects
  const subjects = await SubjectInfo.insertMany([
    { subject_id: "MATH101", subject_name: "Mathematics", class_id: cls._id as any, teacher_id: (teacher as any)._id, teacher_name: teacher.name },
    { subject_id: "ENG101", subject_name: "English", class_id: cls._id as any, teacher_id: (teacher as any)._id, teacher_name: "Mr. Ravi" },
    { subject_id: "BST101", subject_name: "BST", class_id: cls._id as any, teacher_id: (teacher as any)._id, teacher_name: "Ms. Ananya" },
    { subject_id: "ACC101", subject_name: "Accounts", class_id: cls._id as any, teacher_id: (teacher as any)._id, teacher_name: "Mr. Kumar" },
    { subject_id: "ECO101", subject_name: "Economic", class_id: cls._id as any, teacher_id: (teacher as any)._id, teacher_name: "Mr. Rajesh" },
  ]);

  // Timetable (Mon-Fri few slots)
  const slots = [
    { day: "Monday", subject_id: subjects[0]._id, subject_name: "Mathematics", teacher_id: (teacher as any)._id, teacher_name: teacher.name, class_type: "Theory", start_time: "07:30", end_time: "08:10" },
    { day: "Monday", subject_id: subjects[1]._id, subject_name: "English", teacher_name: "Mr. Ravi", class_type: "Theory", start_time: "08:15", end_time: "08:55" },
    { day: "Monday", class_type: "Break", start_time: "09:00", end_time: "09:20" },
    { day: "Monday", subject_id: subjects[2]._id, subject_name: "BST", teacher_name: "Ms. Ananya", class_type: "Theory", start_time: "09:25", end_time: "10:05" },

    { day: "Tuesday", subject_id: subjects[3]._id, subject_name: "Accounts", teacher_name: "Mr. Kumar", class_type: "Theory", start_time: "07:30", end_time: "08:10" },
    { day: "Tuesday", subject_id: subjects[0]._id, subject_name: "Mathematics", teacher_name: teacher.name, class_type: "Lab", start_time: "08:15", end_time: "09:15" },
    { day: "Tuesday", class_type: "Break", start_time: "09:20", end_time: "09:40" },
    { day: "Tuesday", subject_id: subjects[4]._id, subject_name: "Economic", teacher_name: "Mr. Rajesh", class_type: "Theory", start_time: "09:45", end_time: "10:25" },

    { day: "Wednesday", subject_id: subjects[1]._id, subject_name: "English", teacher_name: "Mr. Ravi", class_type: "Theory", start_time: "07:30", end_time: "08:10" },
    { day: "Wednesday", class_type: "Break", start_time: "08:15", end_time: "08:35" },
    { day: "Wednesday", subject_id: subjects[0]._id, subject_name: "Mathematics", teacher_name: teacher.name, class_type: "Theory", start_time: "08:40", end_time: "09:20" },

    { day: "Thursday", subject_id: subjects[2]._id, subject_name: "BST", teacher_name: "Ms. Ananya", class_type: "Theory", start_time: "07:30", end_time: "08:10" },
    { day: "Thursday", class_type: "Break", start_time: "08:15", end_time: "08:35" },
    { day: "Thursday", subject_id: subjects[3]._id, subject_name: "Accounts", teacher_name: "Mr. Kumar", class_type: "Theory", start_time: "08:40", end_time: "09:20" },

    { day: "Friday", subject_id: subjects[4]._id, subject_name: "Economic", teacher_name: "Mr. Rajesh", class_type: "Theory", start_time: "07:30", end_time: "08:10" },
    { day: "Friday", subject_id: subjects[0]._id, subject_name: "Mathematics", teacher_name: teacher.name, class_type: "Theory", start_time: "08:15", end_time: "08:55" },
  ];
  await StudentTimetable.create({ class_id: cls._id, school_name: "Maharishi Vidya Mandir Senior Secondary School, Chetpet", slots });

  // Marks for student
  const findSub = (name: string) => subjects.find(s => s.subject_name === name)!;
  await Marks.insertMany([
    { student_id: student.student_id, class_id: cls._id, subject_id: findSub("Mathematics")._id, subject_name: "Mathematics", marks_obtained: 55 },
    { student_id: student.student_id, class_id: cls._id, subject_id: findSub("Mathematics")._id, subject_name: "Mathematics", marks_obtained: 63 },
    { student_id: student.student_id, class_id: cls._id, subject_id: findSub("Mathematics")._id, subject_name: "Mathematics", marks_obtained: 79 },

    { student_id: student.student_id, class_id: cls._id, subject_id: findSub("English")._id, subject_name: "English", marks_obtained: 70 },
    { student_id: student.student_id, class_id: cls._id, subject_id: findSub("English")._id, subject_name: "English", marks_obtained: 75 },
    { student_id: student.student_id, class_id: cls._id, subject_id: findSub("English")._id, subject_name: "English", marks_obtained: 85 },

    { student_id: student.student_id, class_id: cls._id, subject_id: findSub("BST")._id, subject_name: "BST", marks_obtained: 65 },
    { student_id: student.student_id, class_id: cls._id, subject_id: findSub("BST")._id, subject_name: "BST", marks_obtained: 70 },
    { student_id: student.student_id, class_id: cls._id, subject_id: findSub("BST")._id, subject_name: "BST", marks_obtained: 80 },

    { student_id: student.student_id, class_id: cls._id, subject_id: findSub("Accounts")._id, subject_name: "Accounts", marks_obtained: 60 },
    { student_id: student.student_id, class_id: cls._id, subject_id: findSub("Accounts")._id, subject_name: "Accounts", marks_obtained: 70 },
    { student_id: student.student_id, class_id: cls._id, subject_id: findSub("Accounts")._id, subject_name: "Accounts", marks_obtained: 75 },

    { student_id: student.student_id, class_id: cls._id, subject_id: findSub("Economic")._id, subject_name: "Economic", marks_obtained: 75 },
    { student_id: student.student_id, class_id: cls._id, subject_id: findSub("Economic")._id, subject_name: "Economic", marks_obtained: 85 },
    { student_id: student.student_id, class_id: cls._id, subject_id: findSub("Economic")._id, subject_name: "Economic", marks_obtained: 90 },
  ]);

  // Attendance overview
  await Attendance.create({
    student_id: student.student_id,
    class_id: cls._id,
    student_name: student.name,
    yearly_attendance: 85,
    monthly_attendance: 80,
    weekly_attendance: 78,
    total_working_days: 220,
    present_days: 187,
    absent_days: 33,
    late_arrivals: 3,
  });

  // Minimal events if empty
  const eventsCount = await Events.countDocuments({});
  if (eventsCount === 0) {
    await Events.insertMany([
      { title: "42nd Annual Day Celebrations", category: "Cultural", description: "Annual Day", location: "Kamarajar Arangam, Teynampet, Chennai", startDate: new Date("2024-11-15"), startTime: "3:00 PM", status: "Upcoming", actions: { rsvpRequired: true, remindAvailable: true, registerAvailable: true } },
      { title: "Mathematics Cluster Examinations", category: "Academic", description: "Cluster examinations.", location: "School Campus", startDate: new Date("2024-11-27"), startTime: "9:00 AM", endTime: "11:30 AM", status: "Upcoming", actions: { remindAvailable: true } },
      { title: "Parent-Teacher Meeting", category: "Academic", description: "Quarterly PTM", location: "School Auditorium", startDate: new Date("2025-01-14"), startTime: "10:00 AM", endTime: "1:00 PM", status: "Upcoming", actions: { rsvpRequired: true, remindAvailable: true, registerAvailable: true } },
      { title: "Summer Camp Registration", category: "Other", description: "Registration", location: "School Office", startDate: new Date("2025-01-11"), startTime: "9:00 AM", endTime: "12:00 PM", status: "Past", actions: { attended: true } },
      { title: "Field Trip to Museum", category: "Educational", description: "Field trip", location: "National Museum", startDate: new Date("2025-01-20"), startTime: "8:00 AM", endTime: "3:00 PM", status: "Past", actions: { attended: false } },
    ]);
  }

  console.log("✅ Demo seed completed");
  await mongoose.disconnect();
}

seedDemo().catch((e) => { console.error(e); process.exit(1); });