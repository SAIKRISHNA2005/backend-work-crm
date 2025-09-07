import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { getClassExams } from "../controller/examsController";

const router = express.Router();

router.get("/class/:classCode", authMiddleware(["student", "teacher", "admin", "super_admin"]), getClassExams);

export default router;