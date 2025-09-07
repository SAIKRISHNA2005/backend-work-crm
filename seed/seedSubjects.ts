import mongoose from "mongoose";
import { SubjectInfo } from "../models/SubjectInfo";

const MONGO_URI = "mongodb+srv://saikrishnaab12b319_db_user:qMbqgwjB6OCDgOo3@cluster0.banvdul.mongodb.net/";

async function seedSubjects() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await SubjectInfo.deleteMany({});
    console.log("🧹 Old SubjectInfo cleared");

    // Dummy IDs for classes, school, teachers
    const dummyClassIds = [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()];
    const dummySchoolId = new mongoose.Types.ObjectId();
    const dummyTeacherIds = [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()];

    const subjectsData = [
      {
        subject_id: "MATH101",
        subject_name: "Mathematics",
        class_id: dummyClassIds[0],
        school_id: dummySchoolId,
        teacher_id: dummyTeacherIds[0],
        teacher_name: "Mr. Ravi"
      },
      {
        subject_id: "SCI101",
        subject_name: "Science",
        class_id: dummyClassIds[0],
        school_id: dummySchoolId,
        teacher_id: dummyTeacherIds[1],
        teacher_name: "Ms. Ananya"
      },
      {
        subject_id: "ENG101",
        subject_name: "English",
        class_id: dummyClassIds[1],
        school_id: dummySchoolId,
        teacher_id: dummyTeacherIds[0],
        teacher_name: "Mr. Ravi"
      },
      {
        subject_id: "HIST101",
        subject_name: "History",
        class_id: dummyClassIds[1],
        school_id: dummySchoolId,
        teacher_id: dummyTeacherIds[1],
        teacher_name: "Ms. Ananya"
      },
      {
        subject_id: "GEOG101",
        subject_name: "Geography",
        class_id: dummyClassIds[1],
        school_id: dummySchoolId,
        teacher_id: dummyTeacherIds[0],
        teacher_name: "Mr. Ravi"
      },
    ];

    const createdSubjects = await SubjectInfo.insertMany(subjectsData);
    console.log(`✅ Inserted ${createdSubjects.length} subjects`);

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  } catch (err) {
    console.error("❌ Error seeding SubjectInfo:", err);
    process.exit(1);
  }
}

seedSubjects();
