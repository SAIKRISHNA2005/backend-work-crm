import express from "express";
import { authenticate, authorize } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Placeholder routes - implement NoteController later
router.get("/", authorize("student", "teacher", "admin"), asyncHandler(async (req, res) => {
  res.json({ message: "Notes endpoint - to be implemented" });
}));

export default router;
