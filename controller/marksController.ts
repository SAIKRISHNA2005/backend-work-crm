import { Request, Response } from "express";
import { Marks } from "../models/Marks";
import { ClassInfo } from "../models/ClassInfo";

// Map raw marks into test buckets (FT1..FT4) by document order if test not provided
const DEFAULT_TESTS = ["FT1", "FT2", "FT3", "FT4"];

export const getStudentMarks = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params; // StudentProfile.student_id string
    const marks = await Marks.find({ student_id: studentId }).sort({ createdAt: 1 }).lean();

    const subjectsSet = new Set<string>();
    const subjectScores: Record<string, number[]> = {};

    for (const m of marks) {
      subjectsSet.add(m.subject_name);
      if (!subjectScores[m.subject_name]) subjectScores[m.subject_name] = [];
      subjectScores[m.subject_name].push(m.marks_obtained);
    }

    // Normalize arrays to DEFAULT_TESTS length, pad with nulls
    for (const key of Object.keys(subjectScores)) {
      const arr = subjectScores[key];
      subjectScores[key] = DEFAULT_TESTS.map((_, idx) => arr[idx] ?? null);
    }

    res.json({
      student_id: studentId,
      tests: DEFAULT_TESTS,
      subjects: Array.from(subjectsSet),
      scores: subjectScores, // { subject: number[] | nulls }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const submitStudentMark = async (req: Request, res: Response) => {
  try {
    const { student_id, class_code, subject_name, subject_id, marks_obtained } = req.body;
    if (!student_id || !class_code || !subject_name || !subject_id || marks_obtained == null) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const cls = await ClassInfo.findOne({ class_id: class_code });
    if (!cls) return res.status(404).json({ message: "Class not found" });

    const mark = await Marks.create({
      student_id,
      class_id: cls._id,
      subject_id,
      subject_name,
      marks_obtained,
    });

    res.status(201).json({ message: "Mark recorded", mark });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};