import express from "express";
import { authenticate, authorize } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Placeholder routes - implement ClassController later
router.get("/", authorize("teacher", "admin"), asyncHandler(async (req, res) => {
  res.json({ message: "Classes endpoint - to be implemented" });
}));

export default router;
