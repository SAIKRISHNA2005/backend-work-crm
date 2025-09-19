import express from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { supabaseAuth, supabaseAuthorize } from "../middleware/supabaseAuth";
import { EventController } from "../controllers/EventController";

const router = express.Router();

router.use(supabaseAuth);

router.get("/", supabaseAuthorize("student", "teacher", "admin", "super_admin"), asyncHandler(EventController.list));
router.post("/", supabaseAuthorize("admin", "super_admin"), asyncHandler(EventController.create));
router.patch("/", supabaseAuthorize("admin", "super_admin"), asyncHandler(EventController.patch));
router.delete("/", supabaseAuthorize("admin", "super_admin"), asyncHandler(EventController.remove));

export default router;
