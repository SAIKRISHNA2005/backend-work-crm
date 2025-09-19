import express from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { supabaseAuth, supabaseAuthorize } from "../middleware/supabaseAuth";
import { TimetableController } from "../controllers/TimetableController";

const router = express.Router();

router.use(supabaseAuth);

router.get("/student", supabaseAuthorize("student", "teacher", "admin", "super_admin"), asyncHandler(TimetableController.student));
router.get("/teacher", supabaseAuthorize("teacher", "admin", "super_admin"), asyncHandler(TimetableController.teacher));

export default router;
