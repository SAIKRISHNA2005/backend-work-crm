import mongoose, { Schema, Document } from "mongoose";

export interface ICalendar extends Document {
  role: "teacher" | "student"; // differentiate if needed
  month: number; // 1–12
  year: number;
  days: {
    date: Date;
    dayOfWeek: string;
    type: "working" | "holiday" | "event" | "exam";
    title?: string;   // New Year, Republic Day, etc.
    description?: string;
  }[];
  keyDates: {
    date: Date;
    title: string;
    type: "holiday" | "event" | "exam";
  }[];
}

const calendarSchema = new Schema<ICalendar>(
  {
    role: { type: String, enum: ["teacher", "student"], required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    days: [
      {
        date: { type: Date, required: true },
        dayOfWeek: { type: String, required: true },
        type: { type: String, enum: ["working", "holiday", "event", "exam"], required: true },
        title: { type: String },
        description: { type: String },
      },
    ],
    keyDates: [
      {
        date: { type: Date, required: true },
        title: { type: String, required: true },
        type: { type: String, enum: ["holiday", "event", "exam"], required: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<ICalendar>("Calendar", calendarSchema);
