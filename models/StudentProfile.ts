import mongoose, { Schema, Document, Model } from "mongoose";

type FeeStatus = "paid" | "pending" | "partial";

export interface IStudentProfile extends Document {
  student_id: string;
  class_id: string;
  password: string;
  name: string;
  roll_number: string;
  class_section?: string;
  school_name?: string;
  phone_number: string;
  email?: string;
  current_mission?: string;
  bio?: string;
  superpowers?: string[];
  active_courses?: string[];
  side_quests?: string[];
  classwise_leaderboard_rank?: number | null;
  overall_leaderboard_rank?: number | null;
  aadhar_number?: string;
  father_name?: string;
  mother_name?: string;
  father_occupation?: string;
  mother_occupation?: string;
  father_contact?: string;
  mother_contact?: string;
  blood_group?: string;
  fee_payment_status?: FeeStatus;
  event_registration_info?: string[];
  joined_on?: Date;
  school_address?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const StudentProfileSchema: Schema<IStudentProfile> = new Schema(
  {
    student_id: { type: String, required: true, unique: true },
    class_id: { type: String },
    password: { type: String, required: true },
    name: { type: String, required: true },
    roll_number: { type: String, required: true },
    class_section: { type: String },
    school_name: { type: String },
    phone_number: { type: String, required: true },
    email: { type: String },
    current_mission: { type: String },
    bio: { type: String },
    superpowers: [{ type: String }],
    active_courses: [{ type: String }],
    side_quests: [{ type: String }],
    classwise_leaderboard_rank: { type: Number, default: null },
    overall_leaderboard_rank: { type: Number, default: null },
    aadhar_number: { type: String, unique: true, sparse: true },
    father_name: { type: String },
    mother_name: { type: String },
    father_occupation: { type: String },
    mother_occupation: { type: String },
    father_contact: { type: String },
    mother_contact: { type: String },
    blood_group: { type: String },
    fee_payment_status: {
      type: String,
      enum: ["paid", "pending", "partial"],
      default: "pending",
    },
    event_registration_info: [{ type: String }],
    joined_on: { type: Date, default: Date.now },
    school_address: { type: String },
  },
  { timestamps: true }
);

export const StudentProfile: Model<IStudentProfile> = mongoose.model<IStudentProfile>(
  "StudentProfile",
  StudentProfileSchema
);

