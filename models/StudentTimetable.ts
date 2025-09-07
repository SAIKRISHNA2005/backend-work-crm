import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITimetableSlot {
  day: string;
  subject_id?: mongoose.Types.ObjectId; // ref SubjectInfo
  subject_name?: string;
  teacher_id?: mongoose.Types.ObjectId; // ref TeacherProfile
  teacher_name?: string;
  class_type: "Theory" | "Lab" | "Activity" | "Break";
  start_time: string;
  end_time: string;
}

export interface IStudentTimetable extends Document {
  class_id: mongoose.Types.ObjectId; // ref ClassInfo
  school_name: string; // plain string now
  slots: ITimetableSlot[];
  createdAt?: Date;
  updatedAt?: Date;
}

const TimetableSlotSchema = new Schema<ITimetableSlot>(
  {
    day: { type: String, required: true },
    subject_id: { type: Schema.Types.ObjectId, ref: "SubjectInfo" },
    subject_name: String,
    teacher_id: { type: Schema.Types.ObjectId, ref: "TeacherProfile" },
    teacher_name: String,
    class_type: { type: String, enum: ["Theory", "Lab", "Activity", "Break"], required: true },
    start_time: { type: String, required: true },
    end_time: { type: String, required: true },
  },
  { _id: false }
);

const StudentTimetableSchema = new Schema<IStudentTimetable>(
  {
    class_id: { type: Schema.Types.ObjectId, ref: "ClassInfo", required: true },
    school_name: { type: String, required: true },
    slots: [TimetableSlotSchema],
  },
  { timestamps: true }
);

const StudentTimetable: Model<IStudentTimetable> =
  mongoose.model<IStudentTimetable>("StudentTimetable", StudentTimetableSchema);

export default StudentTimetable;
