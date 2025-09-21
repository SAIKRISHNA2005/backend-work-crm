import express from "express";
import { StudentController } from "../controllers/StudentController";
import { authenticate, authorize } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";
import { studentValidations, commonValidations, handleValidationErrors } from "../middleware/validation";

const router = express.Router();

// Info route (before authentication)
router.get("/info", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Student management endpoints",
    endpoints: {
      getAllStudents: "GET /api/students",
      getStudentProfile: "GET /api/students/profile/:id",
      updateStudentProfile: "PUT /api/students/profile/:id",
      createStudent: "POST /api/students",
      searchStudents: "GET /api/students/search",
      getStudentsByClass: "GET /api/students/class/:classId",
      getStudentsBySchool: "GET /api/students/school/:schoolId",
      getStudentStats: "GET /api/students/stats",
      getStudentCount: "GET /api/students/count",
      deleteStudent: "DELETE /api/students/:id"
    }
  });
});

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
