import mongoose from "mongoose";
import { SubjectInfo } from "../models/SubjectInfo";
import { ExaminationInfo } from "../models/ExaminationInfo";

const MONGO_URI = "mongodb+srv://saikrishnaab12b319_db_user:qMbqgwjB6OCDgOo3@cluster0.banvdul.mongodb.net/";

async function seedExams() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await ExaminationInfo.deleteMany({});
    console.log("🧹 Old ExaminationInfo cleared");

    // Get all subjects to map them
    const subjects = await SubjectInfo.find({});
    if (!subjects.length) {
      console.error("❌ No subjects found. Please seed subjects first.");
      process.exit(1);
    }

    // Group subjects by class
    const classMap: Record<string, any[]> = {};
    subjects.forEach(sub => {
      const classId = sub.class_id.toString();
      if (!classMap[classId]) classMap[classId] = [];
      classMap[classId].push(sub);
    });

    const examsData: any[] = [];

    for (const [classId, classSubjects] of Object.entries(classMap)) {
      examsData.push({
        class_id: classId,
        school_id: (classSubjects[0] as any).school_id,
        exam_name: "Mid-Term Examinations",
        exam_start_date: new Date("2024-12-01"),
        exam_end_date: new Date("2024-12-07"),
        subjects: (classSubjects as any[]).map(sub => ({
          subject_id: sub._id,
          subject_name: sub.subject_name,
          subject_exam_start_date: new Date("2024-12-01"),
          subject_exam_end_date: new Date("2024-12-02"),
        })),
      });

      examsData.push({
        class_id: classId,
        school_id: (classSubjects[0] as any).school_id,
        exam_name: "Final Examinations",
        exam_start_date: new Date("2025-03-01"),
        exam_end_date: new Date("2025-03-07"),
        subjects: (classSubjects as any[]).map(sub => ({
          subject_id: sub._id,
          subject_name: sub.subject_name,
          subject_exam_start_date: new Date("2025-03-01"),
          subject_exam_end_date: new Date("2025-03-02"),
        })),
      });
    }

    const createdExams = await ExaminationInfo.insertMany(examsData);
    console.log(`✅ Inserted ${createdExams.length} examination schedules`);

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  } catch (err) {
    console.error("❌ Error seeding ExaminationInfo:", err);
    process.exit(1);
  }
}

seedExams();
