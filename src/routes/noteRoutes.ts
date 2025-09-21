import express from "express";
import { NoteController } from "../controllers/NoteController";
import { authenticate, authorize } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";
import { commonValidations, handleValidationErrors } from "../middleware/validation";

const router = express.Router();

// Info endpoint (no auth required)
router.get("/info", (req, res) => {
  res.json({
    success: true,
    message: "Notes management endpoints",
    endpoints: {
      getNotes: "GET /api/notes",
      createNote: "POST /api/notes",
      updateNote: "PUT /api/notes/:id",
      getNoteById: "GET /api/notes/:id",
      getNotesBySubject: "GET /api/notes/subject/:subjectId",
      getNotesByClass: "GET /api/notes/class/:classId",
      deleteNote: "DELETE /api/notes/:id"
    }
  });
});

// All routes require authentication
router.use(authenticate);

// Note routes
router.get("/", authorize("student", "teacher", "admin"), asyncHandler(NoteController.getAllNotes));
router.get("/published", authorize("student", "teacher", "admin"), asyncHandler(NoteController.getPublishedNotes));
router.get("/:id", authorize("student", "teacher", "admin"), commonValidations.objectId("id"), handleValidationErrors, asyncHandler(NoteController.getNoteById));
router.post("/", authorize("teacher", "admin"), asyncHandler(NoteController.createNote));
router.put("/:id", authorize("teacher", "admin"), commonValidations.objectId("id"), handleValidationErrors, asyncHandler(NoteController.updateNote));
router.put("/:id/publish", authorize("teacher", "admin"), commonValidations.objectId("id"), handleValidationErrors, asyncHandler(NoteController.toggleNotePublish));
router.get("/teacher/:teacherId", authorize("teacher", "admin"), commonValidations.objectId("teacherId"), handleValidationErrors, asyncHandler(NoteController.getNotesByTeacher));
router.get("/class/:classId", authorize("student", "teacher", "admin"), commonValidations.objectId("classId"), handleValidationErrors, asyncHandler(NoteController.getNotesByClass));
router.get("/stats", authorize("teacher", "admin"), asyncHandler(NoteController.getNoteStats));
router.delete("/:id", authorize("admin"), commonValidations.objectId("id"), handleValidationErrors, asyncHandler(NoteController.deleteNote));

export default router;
