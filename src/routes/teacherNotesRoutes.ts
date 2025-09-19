import express from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { supabaseAuth, supabaseAuthorize } from "../middleware/supabaseAuth";
import { TeacherNotesController } from "../controllers/TeacherNotesController";

const router = express.Router();

router.use(supabaseAuth);

router.get("/", supabaseAuthorize("student", "teacher", "admin", "super_admin"), asyncHandler(TeacherNotesController.list));
router.post("/", supabaseAuthorize("teacher", "admin", "super_admin"), asyncHandler(TeacherNotesController.create));
router.patch("/", supabaseAuthorize("teacher", "admin", "super_admin"), asyncHandler(TeacherNotesController.patch));
router.delete("/", supabaseAuthorize("teacher", "admin", "super_admin"), asyncHandler(TeacherNotesController.remove));

export default router;