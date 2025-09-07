import mongoose, { Schema, Document } from "mongoose";

export interface ITimetable extends Document {
  school_id: mongoose.Types.ObjectId;
  class_id: mongoose.Types.ObjectId;
  day: string; // "Monday", "Tuesday", etc.
  periods: {
    period_number: number; // 1, 2, 3, ...
    start_time: string; // "09:00"
    end_time: string;   // "09:45"
    subject_id: mongoose.Types.ObjectId;
    teacher_id: mongoose.Types.ObjectId;
    room_number?: string;
  }[];
}

const TimetableSchema: Schema = new Schema<ITimetable>({
  school_id: { type: Schema.Types.ObjectId, ref: "School", required: true },
  class_id: { type: Schema.Types.ObjectId, ref: "ClassInfo", required: true },
  day: { type: String, required: true, enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  periods: [
    {
      period_number: { type: Number, required: true },
      start_time: { type: String, required: true },
      end_time: { type: String, required: true },
      subject_id: { type: Schema.Types.ObjectId, ref: "SubjectInfo", required: true },
      teacher_id: { type: Schema.Types.ObjectId, ref: "TeacherProfile", required: true },
      room_number: { type: String }
    }
  ]
}, { timestamps: true });

export const Timetable = mongoose.model<ITimetable>("Timetable", TimetableSchema);
