import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { StudentProfile } from "../models/StudentProfile";
import { ClassInfo } from "../models/ClassInfo";
import StudentTimetable from "../models/StudentTimetable";

const router = express.Router();

// GET /timetable/student/:studentId
// Returns the student's class timetable based on the student's class mapping
router.get(
  "/student/:studentId",
  authMiddleware(["student", "teacher", "admin", "super_admin"]),
  async (req, res) => {
    try {
      const { studentId } = req.params;

      // 1) Find student profile by custom student_id string
      const student = await StudentProfile.findOne({ student_id: studentId });
      if (!student) return res.status(404).json({ message: "Student not found" });

      if (!student.class_id) {
        return res.status(400).json({ message: "Student has no class assigned" });
      }

      // 2) Find class by class_id string
      const cls = await ClassInfo.findOne({ class_id: student.class_id });
      if (!cls) return res.status(404).json({ message: "Class not found for student" });

      // 3) Get timetable by ClassInfo _id
      const timetable = await StudentTimetable.findOne({ class_id: cls._id });
      if (!timetable) return res.status(404).json({ message: "Timetable not found" });

      return res.json({
        class: { id: cls._id, class_id: cls.class_id },
        school_name: timetable.school_name,
        slots: timetable.slots,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// GET /timetable/class/:classCode (classCode is ClassInfo.class_id string)
router.get(
  "/class/:classCode",
  authMiddleware(["student", "teacher", "admin", "super_admin"]),
  async (req, res) => {
    try {
      const { classCode } = req.params;
      const cls = await ClassInfo.findOne({ class_id: classCode });
      if (!cls) return res.status(404).json({ message: "Class not found" });

      const timetable = await StudentTimetable.findOne({ class_id: cls._id });
      if (!timetable)
        return res.status(404).json({ message: "Timetable not found for class" });

      return res.json({
        class: { id: cls._id, class_id: cls.class_id },
        school_name: timetable.school_name,
        slots: timetable.slots,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;