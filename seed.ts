// import mongoose from "mongoose";
// import { faker } from "@faker-js/faker";
// import { TeacherProfile } from "./models/TeacherProfile";
// import { ClassInfo } from "./models/ClassInfo";
// import { StudentProfile } from "./models/StudentProfile";
// import { SubjectInfo } from "./models/SubjectInfo";
// require("dotenv").config();
// const MONGO_URI: string = process.env.DB_URL || "";

// async function seed() {
//     try {
//         await mongoose.connect(MONGO_URI);
//         console.log("MongoDB connected");

//         // Clear old data
//         await TeacherProfile.deleteMany({});
//         await ClassInfo.deleteMany({});
//         await StudentProfile.deleteMany({});
//         await SubjectInfo.deleteMany({});

//         // 1. Create 2 classes
//         const classes = await ClassInfo.insertMany([
//             { class_id: "Class1", classroom_number: "101", home_class_teacher_name: "" },
//             { class_id: "Class2", classroom_number: "102", home_class_teacher_name: "" }
//         ]);
//         console.log("Classes created");

//         // 2. Create 20 teachers
//         const teachers = await TeacherProfile.insertMany(
//             Array.from({ length: 20 }).map((_, i) => ({
//                 teacherId: `T${i + 1}`,
//                 name: faker.person.fullName(),
//                 phoneNumber: faker.phone.number(),
//                 email: faker.internet.email(),
//                 address: faker.location.streetAddress(),
//                 bloodGroup: faker.helpers.arrayElement(["A+", "B+", "O+", "AB+"]),
//                 handlingClassIds: [faker.helpers.arrayElement(classes).class_id],
//                 homeClassId: faker.helpers.arrayElement(classes).class_id,
//                 handlingSubjects: [],
//                 personalAttendancePercent: faker.number.int({ min: 80, max: 100 }),
//                 numberOfLeaves: faker.number.int({ min: 0, max: 5 }),
//                 salaryStatus: faker.helpers.arrayElement(["credited", "pending"]),
//             }))
//         );
//         console.log("Teachers created");

//         // Update home_class_teacher_name in ClassInfo
//         for (let i = 0; i < classes.length; i++) {
//             const randomTeacher = faker.helpers.arrayElement(teachers);
//             await ClassInfo.findByIdAndUpdate(classes[i]._id, { home_class_teacher_name: randomTeacher.name });
//         }

//         // 3. Create 5 subjects (each linked to a teacher + class)
//         const subjects = await SubjectInfo.insertMany(
//             Array.from({ length: 5 }).map((_, i) => {
//                 const teacher = faker.helpers.arrayElement(teachers);
//                 const cls = faker.helpers.arrayElement(classes);
//                 return {
//                     subject_id: `S${i + 1}`,
//                     subject_name: faker.helpers.arrayElement(["Math", "Science", "English", "History", "Geography"]),
//                     class_id: cls._id,
//                     teacher_id: teacher._id,
//                     teacher_name: teacher.name,
//                 };
//             })
//         );
//         console.log("Subjects created");

//         // Update teacher handlingSubjects
//         for (let subj of subjects) {
//             await TeacherProfile.findByIdAndUpdate(subj.teacher_id, {
//                 $push: { handlingSubjects: subj.subject_id }
//             });
//         }

//         // 4. Create 200 students
//         const students = await StudentProfile.insertMany(
//             Array.from({ length: 200 }).map((_, i) => {
//                 const cls = faker.helpers.arrayElement(classes);
//                 return {
//                     student_id: `STU${i + 1}`,
//                     class_id: cls._id,
//                     name: faker.person.fullName(),
//                     roll_number: `${i + 1}`,
//                     class_section: faker.helpers.arrayElement(["A", "B"]),
//                     school_name: "Greenwood High School",
//                     phone_number: faker.phone.number(),
//                     email: faker.internet.email(),
//                     aadhar_number: faker.string.numeric(12),
//                     father_name: faker.person.fullName(),
//                     mother_name: faker.person.fullName(),
//                     blood_group: faker.helpers.arrayElement(["A+", "B+", "O+", "AB+"]),
//                     fee_payment_status: faker.helpers.arrayElement(["paid", "pending", "partial"]),
//                     school_address: faker.location.streetAddress(),
//                 };
//             })
//         );
//         console.log("Students created");

//         console.log("Database seeding completed ✅");
//         mongoose.disconnect();
//     } catch (err) {
//         console.error("Error seeding database:", err);
//         mongoose.disconnect();
//     }
// }

// seed();
// import mongoose from "mongoose";
// import { Attendance } from "./models/Attendance";
// import { StudentProfile } from "./models/StudentProfile";
// import { ClassInfo } from "./models/ClassInfo";
// import { TeacherProfile } from "./models/TeacherProfile";
// require("dotenv").config()
// const MONGO_URI: string = process.env.DB_URL || "";

// async function seedAttendance() {
//     try {
//         await mongoose.connect(MONGO_URI);
//         console.log("✅ Connected to MongoDB");

//         const students = await StudentProfile.find({});
//         const classInfo = await ClassInfo.findOne();
//         const teacher = await TeacherProfile.findOne();

//         if (!classInfo || !teacher) {
//             console.log("⚠️ Missing ClassInfo, TeacherProfile, or School. Please seed them first.");
//             return;
//         }

//         const attendanceDocs = students.map((student) => ({
//             student_id: student.student_id, // ✅ string from StudentProfile
//             class_id: classInfo._id,
//             teacher_id: teacher._id,
//             student_name: student.name,
//             home_class_teacher_name: teacher.name,
//             yearly_attendance: Math.floor(Math.random() * 200),
//             monthly_attendance: Math.floor(Math.random() * 30),
//             weekly_attendance: Math.floor(Math.random() * 7),
//             total_working_days: 200,
//             present_days: Math.floor(Math.random() * 200),
//             absent_days: Math.floor(Math.random() * 50),
//             late_arrivals: Math.floor(Math.random() * 10),
//             leave_request_status: ["accepted", "rejected", "pending"][Math.floor(Math.random() * 3)],
//         }));

//         await Attendance.insertMany(attendanceDocs);
//         console.log(`✅ Inserted ${attendanceDocs.length} attendance records`);

//         await mongoose.disconnect();
//         console.log("🔌 Disconnected from MongoDB");
//     } catch (error) {
//         console.error("❌ Error seeding attendance:", error);
//         await mongoose.disconnect();
//     }
// }

// seedAttendance();
// import mongoose from "mongoose";
// import { Marks } from "./models/Marks";
// import { StudentProfile } from "./models/StudentProfile";
// import { SubjectInfo } from "./models/SubjectInfo";
// import { ClassInfo } from "./models/ClassInfo";

// require("dotenv").config()

// const MONGO_URI: string = process.env.DB_URL || "";

// // Utility function to calculate grade
// function calculateGrade(marks: number): string {
//     if (marks >= 90) return "A+";
//     if (marks >= 80) return "A";
//     if (marks >= 70) return "B";
//     if (marks >= 60) return "C";
//     if (marks >= 50) return "D";
//     return "F";
// }

// async function seedMarks() {
//     try {
//         await mongoose.connect(MONGO_URI);
//         console.log("✅ Connected to MongoDB");

//         const students = await StudentProfile.find().limit(200);
//         const subjects = await SubjectInfo.find();
//         const classInfo = await ClassInfo.findOne();

//         if (!students.length) throw new Error("No students found");
//         if (!subjects.length) throw new Error("No subjects found");
//         if (!classInfo) throw new Error("Class/School not found");

//         const marksData: any[] = [];

//         for (const student of students) {
//             for (const subject of subjects) {
//                 const obtained = Math.floor(Math.random() * 101); // 0 - 100
//                 const percentage = obtained; // out of 100
//                 const grade = calculateGrade(obtained);
//                 const cgpa = Math.round((percentage / 10) * 100) / 100; // simple cgpa logic

//                 marksData.push({
//                     student_id: student.student_id, // StudentProfile has string student_id
//                     class_id: classInfo._id,
//                     subject_id: subject._id,
//                     subject_name: subject.subject_name,
//                     marks_obtained: obtained,
//                     grade,
//                     percentage,
//                     cgpa,
//                 });
//             }
//         }

//         await Marks.insertMany(marksData);
//         console.log(`✅ Inserted ${marksData.length} marks records`);
//     } catch (err) {
//         console.error("❌ Error seeding marks:", err);
//     } finally {
//         await mongoose.disconnect();
//     }
// }

// seedMarks();

// import mongoose from "mongoose";
// import { StudentProfile } from "./models/StudentProfile"; // adjust path if needed
// import dotenv from "dotenv";

// dotenv.config();

// const MONGO_URI = process.env.DB_URL || "";

// async function updatePasswords() {
//     try {
//         await mongoose.connect(MONGO_URI);

//         // Update all students missing password field
//         const result = await StudentProfile.updateMany(
//             { password: { $exists: false } }, // only those missing password
//             { $set: { password: "p123" } }
//         );

//         console.log(`✅ Updated ${result.modifiedCount} students with default password "p123".`);

//         await mongoose.disconnect();
//     } catch (error) {
//         console.error("❌ Error updating passwords:", error);
//         process.exit(1);
//     }
// }

// updatePasswords();
