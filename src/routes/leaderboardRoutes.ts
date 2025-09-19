import express from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { supabaseAuth, supabaseAuthorize } from "../middleware/supabaseAuth";
import { LeaderboardController } from "../controllers/LeaderboardController";

const router = express.Router();

router.use(supabaseAuth);

router.get("/", supabaseAuthorize("student", "teacher", "admin", "super_admin"), asyncHandler(LeaderboardController.list));
router.post("/upsert", supabaseAuthorize("teacher", "admin", "super_admin"), asyncHandler(LeaderboardController.upsert));
router.delete("/", supabaseAuthorize("teacher", "admin", "super_admin"), asyncHandler(LeaderboardController.remove));

export default router;