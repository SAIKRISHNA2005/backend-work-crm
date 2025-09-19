import express from "express";
import { TeacherController } from "../controllers/TeacherController";
import { authenticate, authorize } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";
import { teacherValidations, commonValidations, handleValidationErrors } from "../middleware/validation";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Teacher profile routes
router.get("/profile/:id", authorize("teacher", "admin"), commonValidations.objectId("id"), handleValidationErrors, asyncHandler(TeacherController.getProfile));
router.put("/profile/:id", authorize("teacher", "admin"), commonValidations.objectId("id"), teacherValidations.update, handleValidationErrors, asyncHandler(TeacherController.updateProfile));

// Teacher management routes (admin only)
router.get("/", authorize("admin"), asyncHandler(TeacherController.getAllTeachers));
router.post("/", authorize("admin"), teacherValidations.create, handleValidationErrors, asyncHandler(TeacherController.createTeacher));
router.get("/search", authorize("admin"), asyncHandler(TeacherController.searchTeachers));
router.get("/school/:schoolId", authorize("admin"), commonValidations.objectId("schoolId"), handleValidationErrors, asyncHandler(TeacherController.getTeachersBySchool));

// Teacher statistics
router.get("/stats", authorize("admin"), asyncHandler(TeacherController.getTeacherStats));
router.get("/count", authorize("admin"), asyncHandler(TeacherController.getTeacherCount));

// Teacher deletion (admin only)
router.delete("/:id", authorize("admin"), commonValidations.objectId("id"), handleValidationErrors, asyncHandler(TeacherController.deleteTeacher));

export default router;
