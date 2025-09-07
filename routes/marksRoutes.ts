import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { getStudentMarks, submitStudentMark } from "../controller/marksController";

const router = express.Router();

// GET /marks/student/:studentId
router.get(
  "/student/:studentId",
  authMiddleware(["student", "teacher", "admin", "super_admin"]),
  getStudentMarks
);

// POST /marks
router.post(
  "/",
  authMiddleware(["teacher", "admin", "super_admin"]),
  submitStudentMark
);

export default router;