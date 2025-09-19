import express from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { supabaseAuth, supabaseAuthorize } from "../middleware/supabaseAuth";
import { AchievementsController } from "../controllers/AchievementsController";

const router = express.Router();

router.use(supabaseAuth);

router.get("/", supabaseAuthorize("student", "teacher", "admin", "super_admin"), asyncHandler(AchievementsController.list));
router.post("/", supabaseAuthorize("teacher", "admin", "super_admin"), asyncHandler(AchievementsController.create));
router.patch("/", supabaseAuthorize("teacher", "admin", "super_admin"), asyncHandler(AchievementsController.patch));
router.delete("/", supabaseAuthorize("teacher", "admin", "super_admin"), asyncHandler(AchievementsController.remove));

export default router;