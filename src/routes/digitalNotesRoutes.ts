import express from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { supabaseAuth, supabaseAuthorize } from "../middleware/supabaseAuth";
import { DigitalNotesController } from "../controllers/DigitalNotesController";

const router = express.Router();

router.use(supabaseAuth);

router.get("/", supabaseAuthorize("student", "teacher", "admin", "super_admin"), asyncHandler(DigitalNotesController.list));
router.post("/", supabaseAuthorize("teacher", "admin", "super_admin"), asyncHandler(DigitalNotesController.create));
router.patch("/", supabaseAuthorize("teacher", "admin", "super_admin"), asyncHandler(DigitalNotesController.patch));
router.delete("/", supabaseAuthorize("teacher", "admin", "super_admin"), asyncHandler(DigitalNotesController.remove));

export default router;