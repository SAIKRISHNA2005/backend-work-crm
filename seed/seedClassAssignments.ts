import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import { ClassAssignment } from "../models/classAssignment";

require("dotenv").config();
const MONGO_URI = "mongodb+srv://saikrishnaab12b319_db_user:qMbqgwjB6OCDgOo3@cluster0.banvdul.mongodb.net/";

const seedClassAssignments = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await ClassAssignment.deleteMany({}); // clear old data

    const assignments: any[] = [];

    // 🔹 2 Home Classes
    for (let i = 1; i <= 2; i++) {
      const studentIds: string[] = [];
      const studentNames: string[] = [];

      const studentCount = faker.number.int({ min: 20, max: 40 });
      for (let j = 0; j < studentCount; j++) {
        studentIds.push(`STU${i}${j}`);
        studentNames.push(faker.person.fullName());
      }

      assignments.push({
        classId: `HomeClass${i}`,
        teacherId: `T${i}`,
        studentIds,
        studentNames,
        type: "home",
        classFeePaymentPercent: faker.number.int({ min: 70, max: 100 }),
      });
    }

    // 🔹 6 Handling Classes
    for (let i = 1; i <= 6; i++) {
      const studentIds: string[] = [];
      const studentNames: string[] = [];

      const studentCount = faker.number.int({ min: 10, max: 25 });
      for (let j = 0; j < studentCount; j++) {
        studentIds.push(`HSTU${i}${j}`);
        studentNames.push(faker.person.fullName());
      }

      assignments.push({
        classId: `HandlingClass${i}`,
        teacherId: `T${i + 2}`, // different teachers
        studentIds,
        studentNames,
        type: "handling",
      });
    }

    await ClassAssignment.insertMany(assignments);

    console.log("🎉 Inserted dummy data for 2 HomeClasses & 6 HandlingClasses");
  } catch (err) {
    console.error("❌ Error seeding ClassAssignments:", err);
  } finally {
    await mongoose.disconnect();
  }
};

seedClassAssignments();
