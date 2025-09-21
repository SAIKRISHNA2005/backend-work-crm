import express from "express";
import { TeacherController } from "../controllers/TeacherController";
import { authenticate, authorize } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";
import { teacherValidations, commonValidations, handleValidationErrors } from "../middleware/validation";

const router = express.Router();

// Info route (before authentication)
router.get("/info", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Teacher management endpoints",
    endpoints: {
      getAllTeachers: "GET /api/teachers",
      getTeacherProfile: "GET /api/teachers/profile/:id",
      updateTeacherProfile: "PUT /api/teachers/profile/:id",
      createTeacher: "POST /api/teachers",
      searchTeachers: "GET /api/teachers/search",
      getTeachersBySchool: "GET /api/teachers/school/:schoolId",
      getTeacherStats: "GET /api/teachers/stats",
      deleteTeacher: "DELETE /api/teachers/:id"
    }
  });
});

// All routes require authentication
router.use(authenticate);

// Teacher profile routes (all authenticated users can view teacher profiles)
router.get("/profile/:id", authorize("student", "teacher", "admin"), commonValidations.objectId("id"), handleValidationErrors, asyncHandler(TeacherController.getProfile));
router.put("/profile/:id", authorize("teacher", "admin"), commonValidations.objectId("id"), teacherValidations.update, handleValidationErrors, asyncHandler(TeacherController.updateProfile));

// Teacher management routes (teacher and admin)
router.get("/", authorize("teacher", "admin"), asyncHandler(TeacherController.getAllTeachers));
router.post("/", authorize("admin"), teacherValidations.create, handleValidationErrors, asyncHandler(TeacherController.createTeacher));
router.get("/search", authorize("admin"), asyncHandler(TeacherController.searchTeachers));
router.get("/school/:schoolId", authorize("admin"), commonValidations.objectId("schoolId"), handleValidationErrors, asyncHandler(TeacherController.getTeachersBySchool));

// Teacher statistics
router.get("/stats", authorize("admin"), asyncHandler(TeacherController.getTeacherStats));
router.get("/count", authorize("admin"), asyncHandler(TeacherController.getTeacherCount));

// Teacher deletion (admin only)
router.delete("/:id", authorize("admin"), commonValidations.objectId("id"), handleValidationErrors, asyncHandler(TeacherController.deleteTeacher));

export default router;
