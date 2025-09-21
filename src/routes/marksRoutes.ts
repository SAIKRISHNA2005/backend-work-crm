import express from "express";
import { MarksController } from "../controllers/MarksController";
import { authenticate, authorize } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";
import { marksValidations, commonValidations, handleValidationErrors } from "../middleware/validation";

const router = express.Router();

// Info endpoint (no auth required)
router.get("/info", (req, res) => {
  res.json({
    success: true,
    message: "Marks management endpoints",
    endpoints: {
      getMarks: "GET /api/marks",
      createMarks: "POST /api/marks",
      updateMarks: "PUT /api/marks/:id",
      getMarksByStudent: "GET /api/marks/student/:studentId",
      getMarksBySubject: "GET /api/marks/subject/:subjectId",
      getMarksStats: "GET /api/marks/stats",
      deleteMarks: "DELETE /api/marks/:id"
    }
  });
});

// All routes require authentication
router.use(authenticate);

// Marks routes
router.get("/", authorize("student", "teacher", "admin"), asyncHandler(MarksController.getMarks));
router.post("/", authorize("teacher", "admin"), marksValidations.create, handleValidationErrors, asyncHandler(MarksController.createMarks));
router.put("/:id", authorize("teacher", "admin"), commonValidations.objectId("id"), handleValidationErrors, asyncHandler(MarksController.updateMarks));
router.get("/student/:studentId", authorize("student", "teacher", "admin"), commonValidations.objectId("studentId"), handleValidationErrors, asyncHandler(MarksController.getMarksByStudent));
router.get("/stats", authorize("teacher", "admin"), asyncHandler(MarksController.getMarksStats));
router.delete("/:id", authorize("admin"), commonValidations.objectId("id"), handleValidationErrors, asyncHandler(MarksController.deleteMarks));

export default router;
