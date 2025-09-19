import express from "express";
import { AuthController } from "../controllers/AuthController";
import { authenticate } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";
import { authValidations, handleValidationErrors } from "../middleware/validation";

const router = express.Router();

// Public routes
router.post("/login", authValidations.login, handleValidationErrors, asyncHandler(AuthController.login));
router.post("/register", authValidations.register, handleValidationErrors, asyncHandler(AuthController.register));

// Protected routes
router.get("/profile", authenticate, asyncHandler(AuthController.getProfile));
router.put("/profile", authenticate, asyncHandler(AuthController.updateProfile));
router.put("/change-password", authenticate, asyncHandler(AuthController.changePassword));
router.post("/logout", authenticate, asyncHandler(AuthController.logout));
router.get("/verify", authenticate, asyncHandler(AuthController.verifyToken));

export default router;
