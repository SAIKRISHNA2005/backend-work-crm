import express from "express";
import { StudentController } from "../controllers/StudentController";
import { authenticate, authorize } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";
import { studentValidations, commonValidations, handleValidationErrors } from "../middleware/validation";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Student profile routes
router.get("/profile/:id", authorize("student", "teacher", "admin"), commonValidations.objectId("id"), handleValidationErrors, asyncHandler(StudentController.getProfile));
router.put("/profile/:id", authorize("student", "teacher", "admin"), commonValidations.objectId("id"), studentValidations.update, handleValidationErrors, asyncHandler(StudentController.updateProfile));

// Student management routes (admin/teacher only)
router.get("/", authorize("teacher", "admin"), asyncHandler(StudentController.getAllStudents));
router.post("/", authorize("admin"), studentValidations.create, handleValidationErrors, asyncHandler(StudentController.createStudent));
router.get("/search", authorize("teacher", "admin"), asyncHandler(StudentController.searchStudents));
router.get("/class/:classId", authorize("teacher", "admin"), commonValidations.objectId("classId"), handleValidationErrors, asyncHandler(StudentController.getStudentsByClass));
router.get("/school/:schoolId", authorize("admin"), commonValidations.objectId("schoolId"), handleValidationErrors, asyncHandler(StudentController.getStudentsBySchool));

// Student statistics
router.get("/stats", authorize("teacher", "admin"), asyncHandler(StudentController.getStudentStats));
router.get("/count", authorize("teacher", "admin"), asyncHandler(StudentController.getStudentCount));

// Student deletion (admin only)
router.delete("/:id", authorize("admin"), commonValidations.objectId("id"), handleValidationErrors, asyncHandler(StudentController.deleteStudent));

export default router;
