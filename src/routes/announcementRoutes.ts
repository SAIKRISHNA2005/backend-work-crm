import express from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { supabaseAuth, supabaseAuthorize } from "../middleware/supabaseAuth";
import { AnnouncementsController } from "../controllers/AnnouncementsController";

const router = express.Router();

router.use(supabaseAuth);

router.get("/", supabaseAuthorize("student", "teacher", "admin", "super_admin"), asyncHandler(AnnouncementsController.list));
router.post("/", supabaseAuthorize("teacher", "admin", "super_admin"), asyncHandler(AnnouncementsController.create));
router.patch("/", supabaseAuthorize("teacher", "admin", "super_admin"), asyncHandler(AnnouncementsController.patch));
router.delete("/", supabaseAuthorize("teacher", "admin", "super_admin"), asyncHandler(AnnouncementsController.remove));

export default router;