import { Schema, model, Document } from "mongoose";

export interface ITeacherCalendar extends Document {
  classId: string;
  schoolId: string;
  month: string;
  events: string[];
  holidays: string[];
  examDates: { examName: string; date: Date }[];
  parentTeacherMeetingDates: Date[];
}

const TeacherCalendarSchema = new Schema<ITeacherCalendar>({
  classId: { type: String },
  schoolId: { type: String },
  month: { type: String, required: true },
  events: [{ type: String }],
  holidays: [{ type: String }],
  examDates: [{
    examName: { type: String },
    date: { type: Date }
  }],
  parentTeacherMeetingDates: [{ type: Date }],
}, { timestamps: true });

export const TeacherCalendar = model<ITeacherCalendar>("TeacherCalendar", TeacherCalendarSchema);
