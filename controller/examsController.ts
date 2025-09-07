import { Request, Response } from "express";
import { ClassInfo } from "../models/ClassInfo";
import { ExaminationInfo } from "../models/ExaminationInfo";

export const getClassExams = async (req: Request, res: Response) => {
  try {
    const { classCode } = req.params; // ClassInfo.class_id string
    const cls = await ClassInfo.findOne({ class_id: classCode });
    if (!cls) return res.status(404).json({ message: "Class not found" });

    const exams = await ExaminationInfo.find({ class_id: cls._id })
      .sort({ exam_start_date: 1 })
      .lean();

    return res.json({
      class: { id: cls._id, class_id: cls.class_id },
      exams: exams.map((e) => ({
        id: e._id,
        exam_name: e.exam_name,
        exam_start_date: e.exam_start_date,
        exam_end_date: e.exam_end_date,
        subjects: e.subjects?.map((s) => ({
          subject_id: s.subject_id,
          subject_name: s.subject_name,
          subject_exam_start_date: s.subject_exam_start_date,
          subject_exam_end_date: s.subject_exam_end_date,
        })),
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};