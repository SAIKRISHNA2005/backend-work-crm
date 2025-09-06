import mongoose, { Schema, Document, Model } from "mongoose";

interface IAcademicCalendar extends Document {
  class_id: mongoose.Types.ObjectId;
  school_id: mongoose.Types.ObjectId;
  month?: string;
  events?: string[];
  holidays?: Date[];
  exam_dates?: mongoose.Types.ObjectId[];
  parent_teacher_meeting_date?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const AcademicCalendarSchema: Schema<IAcademicCalendar> = new Schema(
  {
    class_id: {
      type: Schema.Types.ObjectId,
      ref: "ClassInfo",
      required: true,
    },
    school_id: {
      type: Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    month: { type: String },
    events: [{ type: String }],
    holidays: [{ type: Date }],
    exam_dates: [{ type: Schema.Types.ObjectId, ref: "ExaminationInfo" }],
    parent_teacher_meeting_date: { type: Date },
  },
  { timestamps: true }
);

const AcademicCalendar: Model<IAcademicCalendar> = mongoose.model<IAcademicCalendar>(
  "AcademicCalendar",
  AcademicCalendarSchema
);

export default AcademicCalendar;
