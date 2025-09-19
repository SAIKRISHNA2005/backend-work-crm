import express from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { supabaseAuth, supabaseAuthorize } from "../middleware/supabaseAuth";
import { EnquiriesController } from "../controllers/EnquiriesController";

const router = express.Router();

router.use(supabaseAuth);

router.get("/", supabaseAuthorize("student", "teacher", "admin", "super_admin"), asyncHandler(EnquiriesController.list));
router.post("/", supabaseAuthorize("student", "teacher", "admin", "super_admin"), asyncHandler(EnquiriesController.create));
router.patch("/", supabaseAuthorize("teacher", "admin", "super_admin"), asyncHandler(EnquiriesController.patch));
router.delete("/", supabaseAuthorize("teacher", "admin", "super_admin"), asyncHandler(EnquiriesController.remove));

export default router;