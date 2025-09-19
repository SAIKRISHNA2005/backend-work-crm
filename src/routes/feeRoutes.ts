import express from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { supabaseAuth, supabaseAuthorize } from "../middleware/supabaseAuth";
import { FeeStructureController, FeePaymentsController } from "../controllers/FeesController";

const router = express.Router();

router.use(supabaseAuth);

// Fee Structure
router.get("/structure", supabaseAuthorize("teacher", "admin", "super_admin", "student"), asyncHandler(FeeStructureController.list));
router.post("/structure", supabaseAuthorize("teacher", "admin", "super_admin"), asyncHandler(FeeStructureController.create));
router.patch("/structure", supabaseAuthorize("teacher", "admin", "super_admin"), asyncHandler(FeeStructureController.patch));
router.delete("/structure", supabaseAuthorize("teacher", "admin", "super_admin"), asyncHandler(FeeStructureController.remove));

// Fee Payments
router.get("/payments", supabaseAuthorize("teacher", "admin", "super_admin", "student"), asyncHandler(FeePaymentsController.list));
router.post("/payments", supabaseAuthorize("teacher", "admin", "super_admin"), asyncHandler(FeePaymentsController.create));
router.patch("/payments", supabaseAuthorize("teacher", "admin", "super_admin"), asyncHandler(FeePaymentsController.patch));
router.delete("/payments", supabaseAuthorize("teacher", "admin", "super_admin"), asyncHandler(FeePaymentsController.remove));

export default router;