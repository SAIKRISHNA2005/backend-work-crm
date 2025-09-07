import { Request, Response } from "express";
import { ClassInfo } from "../models/ClassInfo";
import { SubjectInfo } from "../models/SubjectInfo";

export const getClassSubjects = async (req: Request, res: Response) => {
  try {
    const { classCode } = req.params; // ClassInfo.class_id string
    const cls = await ClassInfo.findOne({ class_id: classCode });
    if (!cls) return res.status(404).json({ message: "Class not found" });

    const subjects = await SubjectInfo.find({ class_id: cls._id }).lean();

    return res.json({
      class: { id: cls._id, class_id: cls.class_id },
      subjects: subjects.map((s) => ({
        id: s._id,
        subject_id: s.subject_id,
        subject_name: s.subject_name,
        teacher_id: s.teacher_id,
        teacher_name: s.teacher_name,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};