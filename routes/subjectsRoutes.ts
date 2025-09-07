import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { getClassSubjects } from "../controller/subjectsController";

const router = express.Router();

// GET /subjects/class/:classCode
router.get(
  "/class/:classCode",
  authMiddleware(["student", "teacher", "admin", "super_admin"]),
  getClassSubjects
);

export default router;