import express from "express";
import { TimetableController } from "../controllers/TimetableController";
import { authenticate, authorize } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";
import { commonValidations, handleValidationErrors } from "../middleware/validation";

const router = express.Router();

// Info endpoint (no auth required)
router.get("/info", (req, res) => {
  res.json({
    success: true,
    message: "Timetable management endpoints",
    endpoints: {
      getTimetable: "GET /api/timetable",
      createTimetable: "POST /api/timetable",
      updateTimetable: "PUT /api/timetable/:id",
      getTimetableByClass: "GET /api/timetable/class/:classId",
      getTimetableByTeacher: "GET /api/timetable/teacher/:teacherId",
      deleteTimetable: "DELETE /api/timetable/:id"
    }
  });
});

// All routes require authentication
router.use(authenticate);

// Timetable routes (placeholder - requires timetable table in database)
router.get("/", authorize("student", "teacher", "admin"), asyncHandler(TimetableController.getTimetable));
router.post("/", authorize("admin"), asyncHandler(TimetableController.createTimetableEntry));
router.put("/:id", authorize("admin"), commonValidations.objectId("id"), handleValidationErrors, asyncHandler(TimetableController.updateTimetableEntry));
router.get("/class/:classId", authorize("student", "teacher", "admin"), commonValidations.objectId("classId"), handleValidationErrors, asyncHandler(TimetableController.getTimetableByClass));
router.get("/teacher/:teacherId", authorize("teacher", "admin"), commonValidations.objectId("teacherId"), handleValidationErrors, asyncHandler(TimetableController.getTimetableByTeacher));
router.delete("/:id", authorize("admin"), commonValidations.objectId("id"), handleValidationErrors, asyncHandler(TimetableController.deleteTimetableEntry));

export default router;
