import mongoose from "mongoose";
import Calendar from "../models/Calendar";

require("dotenv").config();
const MONGO_URI: string = "mongodb+srv://saikrishnaab12b319_db_user:qMbqgwjB6OCDgOo3@cluster0.banvdul.mongodb.net/";

// Fixed holidays/events for 2025
const HOLIDAYS_2025: Record<string, { title: string; type: "holiday" | "event" }[]> = {
  "01-01": [{ title: "New Year", type: "holiday" }],
  "01-26": [{ title: "Republic Day", type: "holiday" }],
  "03-08": [{ title: "Women's Day", type: "event" }],
  "08-15": [{ title: "Independence Day", type: "holiday" }],
  "10-02": [{ title: "Gandhi Jayanti", type: "holiday" }],
  "12-25": [{ title: "Christmas", type: "holiday" }],
};

// Example student events/exams
const STUDENT_EVENTS: Record<string, { title: string; type: "event" | "exam" }[]> = {
  "01-11": [{ title: "Summer Camp Registration", type: "event" }],
  "01-14": [{ title: "Parent-Teacher Meeting", type: "event" }],
  "01-15": [{ title: "Annual Day Rehearsals Begin", type: "event" }],
  "01-16": [{ title: "Computer Science Exam", type: "exam" }],
  "01-20": [{ title: "Field Trip to Museum", type: "event" }],
};

function generateMonthCalendar(year: number, month: number, role: "teacher" | "student") {
  const days: any[] = [];
  const keyDates: any[] = [];

  const date = new Date(year, month - 1, 1);
  while (date.getMonth() === month - 1) {
    const dayOfWeek = date.toLocaleString("en-US", { weekday: "long" });
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(month).padStart(2, "0");
    const key = `${mm}-${dd}`;

    let type: "working" | "holiday" | "event" | "exam" = "working";
    let title: string | undefined;

    // Weekends default to holiday
    if (dayOfWeek === "Sunday") {
      type = "holiday";
      title = "Holiday";
    }

    // Add fixed holidays
    if (HOLIDAYS_2025[key]) {
      HOLIDAYS_2025[key].forEach((h) => {
        type = h.type;
        title = h.title;
        keyDates.push({ date: new Date(date), title: h.title, type: h.type });
      });
    }

    // Add role-specific events
    if (role === "student" && STUDENT_EVENTS[key]) {
      STUDENT_EVENTS[key].forEach((e) => {
        type = e.type;
        title = e.title;
        keyDates.push({ date: new Date(date), title: e.title, type: e.type });
      });
    }

    days.push({
      date: new Date(date),
      dayOfWeek,
      type,
      title,
    });

    date.setDate(date.getDate() + 1);
  }

  return { month, year, role, days, keyDates };
}

async function seedCalendar() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to DB");

    await Calendar.deleteMany({});
    console.log("🗑️ Cleared old Calendar");

    const year = 2025;
    const roles: ("teacher" | "student")[] = ["teacher", "student"];

    for (const role of roles) {
      for (let month = 1; month <= 12; month++) {
        const cal = generateMonthCalendar(year, month, role);
        await Calendar.create(cal);
      }
    }

    console.log("🎉 Calendar seeded successfully");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedCalendar();
