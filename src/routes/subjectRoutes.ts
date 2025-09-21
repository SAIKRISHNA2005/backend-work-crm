import express from "express";
import { SubjectController } from "../controllers/SubjectController";
import { authenticate, authorize } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";
import { commonValidations, handleValidationErrors } from "../middleware/validation";

const router = express.Router();

// Info endpoint (no auth required)
router.get("/info", (req, res) => {
  res.json({
    success: true,
    message: "Subject management endpoints",
    endpoints: {
      getAllSubjects: "GET /api/subjects",
      getSubjectById: "GET /api/subjects/:id",
      createSubject: "POST /api/subjects",
      updateSubject: "PUT /api/subjects/:id",
      getSubjectsByClass: "GET /api/subjects/class/:classId",
      getSubjectsBySchool: "GET /api/subjects/school/:schoolId",
      getSubjectStats: "GET /api/subjects/stats",
      deleteSubject: "DELETE /api/subjects/:id"
    }
  });
});

// All routes require authentication
router.use(authenticate);

// Subject routes
router.get("/", authorize("teacher", "admin"), asyncHandler(SubjectController.getAllSubjects));
router.get("/:id", authorize("teacher", "admin"), commonValidations.objectId("id"), handleValidationErrors, asyncHandler(SubjectController.getSubjectById));
router.post("/", authorize("admin"), asyncHandler(SubjectController.createSubject));
router.put("/:id", authorize("admin"), commonValidations.objectId("id"), handleValidationErrors, asyncHandler(SubjectController.updateSubject));
router.get("/class/:classId", authorize("teacher", "admin"), commonValidations.objectId("classId"), handleValidationErrors, asyncHandler(SubjectController.getSubjectsByClass));
router.get("/school/:schoolId", authorize("admin"), commonValidations.objectId("schoolId"), handleValidationErrors, asyncHandler(SubjectController.getSubjectsBySchool));
router.get("/stats", authorize("admin"), asyncHandler(SubjectController.getSubjectStats));
router.delete("/:id", authorize("admin"), commonValidations.objectId("id"), handleValidationErrors, asyncHandler(SubjectController.deleteSubject));

export default router;
