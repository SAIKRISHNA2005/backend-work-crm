import express from "express";
import { ClassController } from "../controllers/ClassController";
import { authenticate, authorize } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";
import { commonValidations, handleValidationErrors } from "../middleware/validation";

const router = express.Router();

// Info endpoint (no auth required)
router.get("/info", (req, res) => {
  res.json({
    success: true,
    message: "Class management endpoints",
    endpoints: {
      getAllClasses: "GET /api/classes",
      getClassById: "GET /api/classes/:id",
      createClass: "POST /api/classes",
      updateClass: "PUT /api/classes/:id",
      getClassesBySchool: "GET /api/classes/school/:schoolId",
      getClassStats: "GET /api/classes/stats",
      deleteClass: "DELETE /api/classes/:id"
    }
  });
});

// All routes require authentication
router.use(authenticate);

// Class routes
router.get("/", authorize("teacher", "admin"), asyncHandler(ClassController.getAllClasses));
router.get("/:id", authorize("teacher", "admin"), commonValidations.objectId("id"), handleValidationErrors, asyncHandler(ClassController.getClassById));
router.post("/", authorize("admin"), asyncHandler(ClassController.createClass));
router.put("/:id", authorize("admin"), commonValidations.objectId("id"), handleValidationErrors, asyncHandler(ClassController.updateClass));
router.get("/school/:schoolId", authorize("admin"), commonValidations.objectId("schoolId"), handleValidationErrors, asyncHandler(ClassController.getClassesBySchool));
router.get("/stats", authorize("admin"), asyncHandler(ClassController.getClassStats));
router.delete("/:id", authorize("admin"), commonValidations.objectId("id"), handleValidationErrors, asyncHandler(ClassController.deleteClass));

export default router;
