import express from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { supabaseAuth, supabaseAuthorize } from "../middleware/supabaseAuth";
import { ExamsController } from "../controllers/ExamsController";

const router = express.Router();

router.use(supabaseAuth);

router.get("/", supabaseAuthorize("student", "teacher", "admin", "super_admin"), asyncHandler(ExamsController.list));
router.post("/", supabaseAuthorize("teacher", "admin", "super_admin"), asyncHandler(ExamsController.create));
router.patch("/", supabaseAuthorize("teacher", "admin", "super_admin"), asyncHandler(ExamsController.patch));
router.delete("/", supabaseAuthorize("teacher", "admin", "super_admin"), asyncHandler(ExamsController.remove));

export default router;