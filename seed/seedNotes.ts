import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import { TeacherNotes } from "../models/TeacherNotes";
import { StudentNotes } from "../models/StudentNotes";

// ⚡ Replace with your MongoDB URL
const MONGO_URI: string = "mongodb+srv://saikrishnaab12b319_db_user:qMbqgwjB6OCDgOo3@cluster0.banvdul.mongodb.net/";

async function seedNotes() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // --- Clean old data
    await TeacherNotes.deleteMany({});
    await StudentNotes.deleteMany({});
    console.log("🧹 Old notes cleared");

    // Dummy IDs (you should replace these with real Student/Teacher/Class/Subject IDs from your DB)
    const dummyTeacherId = new mongoose.Types.ObjectId();
    const dummyClassId = new mongoose.Types.ObjectId();
    const dummySectionId = new mongoose.Types.ObjectId();
    const dummySubjectId = new mongoose.Types.ObjectId();
    const dummyStudentIds = Array.from({ length: 5 }, () => new mongoose.Types.ObjectId());

    // --- Create Teacher Notes
    const teacherNotesData = Array.from({ length: 3 }, () => ({
      teacherId: dummyTeacherId.toString(),
      classId: dummyClassId.toString(),
      sectionId: dummySectionId.toString(),
      subjectId: dummySubjectId.toString(),
      subjectName: faker.helpers.arrayElement(["Math", "Science", "History", "English"]),
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      fileUrl: faker.internet.url(),
      fileType: faker.helpers.arrayElement(["pdf", "docx", "pptx"]),
      uploadedAt: faker.date.recent(),
      isPublished: faker.datatype.boolean(),
      visibilityLevel: faker.helpers.arrayElement(["class", "section", "all"]),
      availableFrom: faker.date.recent(),
      availableUntil: faker.date.soon(),
      tags: [faker.word.noun(), faker.word.adjective()],
    }));

    const createdTeacherNotes = await TeacherNotes.insertMany(teacherNotesData);
    console.log(`✅ Inserted ${createdTeacherNotes.length} Teacher Notes`);

    // --- Map Teacher Notes to Students
    const studentNotesData = [];
    for (const note of createdTeacherNotes) {
      for (const studentId of dummyStudentIds) {
        studentNotesData.push({
          studentId,
          noteId: note._id,
          subjectId: note.subjectId,
          subjectName: note.subjectName,
          title: note.title,
          description: note.description,
          fileUrl: note.fileUrl,
          fileType: note.fileType,
          uploadedAt: note.uploadedAt,
          teacherId: note.teacherId,
          isImportant: faker.datatype.boolean(),
          lastSeenAt: faker.date.recent(),
          addedToDashboardAt: new Date(),
          visibilityLevel: note.visibilityLevel,
          availableFrom: note.availableFrom,
          availableUntil: note.availableUntil,
          tags: note.tags,
        });
      }
    }

    await StudentNotes.insertMany(studentNotesData);
    console.log(`✅ Inserted ${studentNotesData.length} Student Notes`);

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  } catch (err) {
    console.error("❌ Error seeding notes:", err);
    process.exit(1);
  }
}

seedNotes();
