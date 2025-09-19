import express from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { supabaseAuth, supabaseAuthorize } from "../middleware/supabaseAuth";
import { ExamSubjectsController } from "../controllers/ExamSubjectsController";

const router = express.Router();

router.use(supabaseAuth);

router.get("/", supabaseAuthorize("student", "teacher", "admin", "super_admin"), asyncHandler(ExamSubjectsController.list));
router.post("/", supabaseAuthorize("teacher", "admin", "super_admin"), asyncHandler(ExamSubjectsController.create));
router.patch("/", supabaseAuthorize("teacher", "admin", "super_admin"), asyncHandler(ExamSubjectsController.patch));
router.delete("/", supabaseAuthorize("teacher", "admin", "super_admin"), asyncHandler(ExamSubjectsController.remove));

export default router;