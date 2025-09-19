import express from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { supabaseAuth, supabaseAuthorize } from "../middleware/supabaseAuth";
import { MarksController } from "../controllers/MarksController";

const router = express.Router();

// All routes require Supabase authentication
router.use(supabaseAuth);

router.get("/", supabaseAuthorize("student", "teacher", "admin", "super_admin"), asyncHandler(MarksController.list));
router.post("/", supabaseAuthorize("teacher", "admin", "super_admin"), asyncHandler(MarksController.create));
router.patch("/", supabaseAuthorize("teacher", "admin", "super_admin"), asyncHandler(MarksController.patch));
router.delete("/", supabaseAuthorize("teacher", "admin", "super_admin"), asyncHandler(MarksController.remove));

export default router;
