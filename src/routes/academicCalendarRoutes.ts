import express from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { supabaseAuth, supabaseAuthorize } from "../middleware/supabaseAuth";
import { AcademicCalendarController } from "../controllers/AcademicCalendarController";

const router = express.Router();

router.use(supabaseAuth);

router.get("/", supabaseAuthorize("student", "teacher", "admin", "super_admin"), asyncHandler(AcademicCalendarController.list));
router.post("/", supabaseAuthorize("teacher", "admin", "super_admin"), asyncHandler(AcademicCalendarController.create));
router.patch("/", supabaseAuthorize("teacher", "admin", "super_admin"), asyncHandler(AcademicCalendarController.patch));
router.delete("/", supabaseAuthorize("teacher", "admin", "super_admin"), asyncHandler(AcademicCalendarController.remove));

export default router;