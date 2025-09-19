import express from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { supabaseAuth, supabaseAuthorize } from "../middleware/supabaseAuth";
import { SubjectController } from "../controllers/SubjectController";

const router = express.Router();

router.use(supabaseAuth);

router.get("/", supabaseAuthorize("teacher", "admin", "super_admin", "student"), asyncHandler(SubjectController.list));
router.get("/class/:className", supabaseAuthorize("student", "teacher", "admin", "super_admin"), asyncHandler(SubjectController.listByClassName));
router.post("/", supabaseAuthorize("teacher", "admin", "super_admin"), asyncHandler(SubjectController.create));
router.patch("/", supabaseAuthorize("teacher", "admin", "super_admin"), asyncHandler(SubjectController.patch));
router.delete("/", supabaseAuthorize("teacher", "admin", "super_admin"), asyncHandler(SubjectController.remove));

export default router;
