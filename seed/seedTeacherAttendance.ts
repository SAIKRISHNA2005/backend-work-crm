import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import { ClassAttendance, PersonalAttendance } from "../models/TeacherAttendance";

const MONGO_URI: string = "mongodb+srv://saikrishnaab12b319_db_user:qMbqgwjB6OCDgOo3@cluster0.banvdul.mongodb.net/";

async function seedTeacherAttendance() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await ClassAttendance.deleteMany({});
    await PersonalAttendance.deleteMany({});
    console.log("🧹 Cleared old attendance records");

    const classAttendanceData = [];
    const personalAttendanceData = [];

    for (let i = 0; i < 20; i++) {
      const totalWorkingDays = faker.number.int({ min: 180, max: 220 });
      const presentDays = faker.number.int({ min: 100, max: totalWorkingDays });
      const absentDays = totalWorkingDays - presentDays;
      const lateArrivals = faker.number.int({ min: 0, max: 15 });

      const yearlyPercent = Math.round((presentDays / totalWorkingDays) * 100);
      const monthlyPercent = faker.number.int({ min: 70, max: 100 });
      const weeklyPercent = faker.number.int({ min: 60, max: 100 });

      // --- Class Attendance ---
      classAttendanceData.push({
        classId: `CLASS-${faker.string.alphanumeric(5)}`,
        teacherId: `TEACH-${faker.string.alphanumeric(5)}`,
        yearlyAttendancePercent: yearlyPercent,
        monthlyAttendancePercent: monthlyPercent,
        weeklyAttendancePercent: weeklyPercent,
        studentLeaveStatus: faker.helpers.arrayElement(["accepted", "rejected", "pending"]),
        totalWorkingDays,
        presentDays,
        absentDays,
        lateArrivals,
      });

      // --- Personal Attendance ---
      personalAttendanceData.push({
        teacherId: `TEACH-${faker.string.alphanumeric(5)}`,
        teacherName: faker.person.fullName(),
        yearlyAttendancePercent: yearlyPercent,
        monthlyAttendancePercent: monthlyPercent,
        weeklyAttendancePercent: weeklyPercent,
        leaveRequestStatus: faker.helpers.arrayElement(["accepted", "rejected", "pending"]),
        totalWorkingDays,
        presentDays,
        absentDays,
        lateArrivals,
        leaveDates: [
          {
            startDate: faker.date.past({ years: 1 }),
            endDate: faker.date.past({ years: 1 }),
          },
        ],
      });
    }

    await ClassAttendance.insertMany(classAttendanceData);
    await PersonalAttendance.insertMany(personalAttendanceData);

    console.log(`✅ Inserted ${classAttendanceData.length} ClassAttendance records`);
    console.log(`✅ Inserted ${personalAttendanceData.length} PersonalAttendance records`);

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  } catch (err) {
    console.error("❌ Error seeding teacher attendance:", err);
    process.exit(1);
  }
}

seedTeacherAttendance();
