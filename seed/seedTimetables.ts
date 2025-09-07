import mongoose from "mongoose";
import dotenv from "dotenv";
import ClassInfo from "../models/ClassInfo";
import SubjectInfo from "../models/SubjectInfo";
import { TeacherProfile } from "../models/TeacherProfile";
import StudentTimetable from "../models/StudentTimetable";
import TeacherTimetable from "../models/TeacherTimetable";

dotenv.config();
const MONGO_URI: string = "mongodb+srv://saikrishnaab12b319_db_user:qMbqgwjB6OCDgOo3@cluster0.banvdul.mongodb.net/";

async function seedTimetables() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const classes = await ClassInfo.find();
    const subjects = await SubjectInfo.find();
    const teachers = await TeacherProfile.find();

    if (!classes.length || !subjects.length || !teachers.length) {
      throw new Error("⚠️ Seed ClassInfo, SubjectInfo, TeacherProfile first.");
    }

    await StudentTimetable.deleteMany();
    await TeacherTimetable.deleteMany();

    const schoolName = "Green Valley School"; // static string

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    const slotsTemplate = [
      { subject: "Mathematics", type: "Theory", start: "07:30", end: "08:10" },
      { subject: "Economics", type: "Theory", start: "08:15", end: "08:50" },
      { subject: "Business Studies", type: "Theory", start: "08:55", end: "09:30" },
      { subject: "Short Break", type: "Break", start: "09:30", end: "09:40" },
      { subject: "Computer Science", type: "Lab", start: "09:45", end: "10:20" },
      { subject: "Computer Science", type: "Lab", start: "10:25", end: "11:05" },
      { subject: "English", type: "Theory", start: "11:10", end: "11:40" },
      { subject: "Lunch Break", type: "Break", start: "11:40", end: "12:10" },
      { subject: "Physical Education", type: "Activity", start: "12:15", end: "12:50" },
      { subject: "Physical Education", type: "Activity", start: "12:55", end: "01:25" },
      { subject: "Accountancy", type: "Theory", start: "01:30", end: "02:10" },
    ];

    const studentTimetables: any[] = [];
    const teacherTimetables: any[] = [];

    for (const cls of classes) {
      const studentSlots: any[] = [];

      for (const day of days) {
        for (const slot of slotsTemplate) {
          const subj = subjects.find((s) => s.subject_name === slot.subject);
          const teacher = teachers[Math.floor(Math.random() * teachers.length)];

          studentSlots.push({
            day,
            subject_id: subj?._id,
            subject_name: subj?.subject_name || slot.subject,
            teacher_id: teacher?._id,
            teacher_name: teacher?.name || "TBD",
            class_type: slot.type,
            start_time: slot.start,
            end_time: slot.end,
          });

          teacherTimetables.push({
            teacher_id: teacher?._id,
            school_name: schoolName,
            slots: [
              {
                day,
                subject_id: subj?._id,
                subject_name: subj?.subject_name || slot.subject,
                class_id: cls._id,
                // class_name: cls.class_name || "TBD",
                class_type: slot.type,
                start_time: slot.start,
                end_time: slot.end,
              },
            ],
          });
        }
      }

      studentTimetables.push({
        class_id: cls._id,
        school_name: schoolName,
        slots: studentSlots,
      });
    }

    await StudentTimetable.insertMany(studentTimetables);

    const teacherMap = new Map();
    for (const t of teacherTimetables) {
      if (!teacherMap.has(t.teacher_id.toString())) {
        teacherMap.set(t.teacher_id.toString(), {
          teacher_id: t.teacher_id,
          school_name: schoolName,
          slots: [],
        });
      }
      teacherMap.get(t.teacher_id.toString()).slots.push(...t.slots);
    }

    const mergedTeacherTimetables = Array.from(teacherMap.values());
    await TeacherTimetable.insertMany(mergedTeacherTimetables);

    console.log(
      `✅ Seeded ${studentTimetables.length} student timetables & ${mergedTeacherTimetables.length} teacher timetables!`
    );

    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error seeding timetables:", error);
    process.exit(1);
  }
}

seedTimetables();
