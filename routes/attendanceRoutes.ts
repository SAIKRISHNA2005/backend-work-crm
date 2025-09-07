import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { getStudentAttendanceOverview, updateClassAttendance } from "../controller/attendanceController";

const router = express.Router();

router.get(
  "/student/:studentId/overview",
  authMiddleware(["student", "teacher", "admin", "super_admin"]),
  getStudentAttendanceOverview
);

router.post(
  "/class/update",
  authMiddleware(["teacher", "admin", "super_admin"]),
  updateClassAttendance
);

export default router;