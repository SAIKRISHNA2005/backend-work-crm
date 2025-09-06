import mongoose, { Schema, Document, Model } from "mongoose";

interface IExaminationSubject {
  subject_id: mongoose.Types.ObjectId;
  subject_name: string;
  subject_exam_start_date: Date;
  subject_exam_end_date: Date;
}

export interface IExaminationInfo extends Document {
  class_id: mongoose.Types.ObjectId;
  school_id: mongoose.Types.ObjectId;
  exam_name: string;
  exam_start_date: Date;
  exam_end_date: Date;
  subjects: IExaminationSubject[];
  createdAt?: Date;
  updatedAt?: Date;
}

const ExaminationSubjectSchema: Schema<IExaminationSubject> = new Schema(
  {
    subject_id: { type: Schema.Types.ObjectId, ref: "SubjectInfo", required: true },
    subject_name: { type: String, required: true },
    subject_exam_start_date: { type: Date, required: true },
    subject_exam_end_date: { type: Date, required: true },
  },
  { _id: false } // prevent creating _id for each subdocument
);

const ExaminationInfoSchema: Schema<IExaminationInfo> = new Schema(
  {
    class_id: { type: Schema.Types.ObjectId, ref: "ClassInfo", required: true },
    school_id: { type: Schema.Types.ObjectId, ref: "School", required: true },
    exam_name: { type: String, required: true },
    exam_start_date: { type: Date, required: true },
    exam_end_date: { type: Date, required: true },
    subjects: [ExaminationSubjectSchema],
  },
  { timestamps: true }
);

const ExaminationInfo: Model<IExaminationInfo> = mongoose.model<IExaminationInfo>(
  "ExaminationInfo",
  ExaminationInfoSchema
);

export default ExaminationInfo;
