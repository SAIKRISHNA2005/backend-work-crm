import express from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { supabaseAuth, supabaseAuthorize } from "../middleware/supabaseAuth";
import { AttendanceController } from "../controllers/AttendanceController";

const router = express.Router();

router.use(supabaseAuth);

router.post("/", supabaseAuthorize("teacher", "admin", "super_admin"), asyncHandler(AttendanceController.upsert));

export default router;
