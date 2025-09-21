import express from "express";
import { AttendanceController } from "../controllers/AttendanceController";
import { authenticate, authorize } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";
import { attendanceValidations, commonValidations, handleValidationErrors } from "../middleware/validation";

const router = express.Router();

// Info endpoint (no auth required)
router.get("/info", (req, res) => {
  res.json({
    success: true,
    message: "Attendance management endpoints",
    endpoints: {
      getAttendance: "GET /api/attendance",
      createAttendance: "POST /api/attendance",
      updateAttendance: "PUT /api/attendance/:id",
      bulkUpdateAttendance: "POST /api/attendance/bulk",
      getAttendanceStats: "GET /api/attendance/stats",
      deleteAttendance: "DELETE /api/attendance/:id"
    }
  });
});

// All routes require authentication
router.use(authenticate);

// Attendance routes
router.get("/", authorize("teacher", "admin"), asyncHandler(AttendanceController.getAttendance));
router.post("/", authorize("teacher", "admin"), attendanceValidations.update, handleValidationErrors, asyncHandler(AttendanceController.createAttendance));
router.put("/:id", authorize("teacher", "admin"), commonValidations.objectId("id"), handleValidationErrors, asyncHandler(AttendanceController.updateAttendance));
router.post("/bulk", authorize("teacher", "admin"), attendanceValidations.update, handleValidationErrors, asyncHandler(AttendanceController.bulkUpdateAttendance));
router.get("/stats", authorize("teacher", "admin"), asyncHandler(AttendanceController.getAttendanceStats));
router.delete("/:id", authorize("admin"), commonValidations.objectId("id"), handleValidationErrors, asyncHandler(AttendanceController.deleteAttendance));

export default router;
