import mongoose from "mongoose";
import { Events } from "../models/EventsSchema";

const MONGO_URI: string = "mongodb+srv://saikrishnaab12b319_db_user:qMbqgwjB6OCDgOo3@cluster0.banvdul.mongodb.net/";

async function seedEvents() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await Events.deleteMany({});
    console.log("🧹 Old events cleared");

    const eventsData = [
      // --- Upcoming Events ---
      {
        title: "42nd Annual Day Celebrations",
        category: "Cultural",
        description: "Dear Parents, We cordially invite you to join us for our 42nd Annual Day Celebrations.",
        location: "Kamarajar Arangam, Teynampet, Chennai",
        startDate: new Date("2024-11-15"),
        startTime: "3:00 PM",
        status: "Upcoming",
        actions: { rsvpRequired: true, remindAvailable: true, registerAvailable: true },
      },
      {
        title: "Mathematics Cluster Examinations",
        category: "Academic",
        description: "Cluster examinations for all classes. Bring your own calculators.",
        location: "School Campus",
        startDate: new Date("2024-11-27"),
        startTime: "9:00 AM",
        endTime: "11:30 AM",
        status: "Upcoming",
        actions: { remindAvailable: true },
      },
      {
        title: "Parent-Teacher Meeting",
        category: "Academic",
        description: "Quarterly parent-teacher meeting to discuss student progress.",
        location: "School Auditorium",
        startDate: new Date("2025-01-14"),
        startTime: "10:00 AM",
        endTime: "1:00 PM",
        status: "Upcoming",
        actions: { rsvpRequired: true, remindAvailable: true, registerAvailable: true },
      },

      // --- Past Events ---
      {
        title: "Summer Camp Registration",
        category: "Other",
        description: "Registration for summer camp activities.",
        location: "School Office",
        startDate: new Date("2025-01-11"),
        startTime: "9:00 AM",
        endTime: "12:00 PM",
        status: "Past",
        actions: { attended: true },
      },
      {
        title: "Field Trip to Museum",
        category: "Educational",
        description: "Educational field trip for history classes.",
        location: "National Museum",
        startDate: new Date("2025-01-20"),
        startTime: "8:00 AM",
        endTime: "3:00 PM",
        status: "Past",
        actions: { attended: false },
      },
    ];

    await Events.insertMany(eventsData);
    console.log(`✅ Inserted ${eventsData.length} events`);

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  } catch (err) {
    console.error("❌ Error seeding events:", err);
    process.exit(1);
  }
}

seedEvents();
