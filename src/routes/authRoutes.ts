import express from "express";
import { AuthController } from "../controllers/AuthController";
import { authenticate } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";
import { authValidations, handleValidationErrors } from "../middleware/validation";

const router = express.Router();

// Info route
router.get("/info", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Authentication endpoints",
    endpoints: {
      login: "POST /api/auth/login",
      register: "POST /api/auth/register",
      profile: "GET /api/auth/profile",
      updateProfile: "PUT /api/auth/profile",
      changePassword: "PUT /api/auth/change-password",
      logout: "POST /api/auth/logout",
      verify: "GET /api/auth/verify"
    }
  });
});

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
