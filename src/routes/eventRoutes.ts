import express from "express";
import { EventController } from "../controllers/EventController";
import { authenticate, authorize } from "../middleware/auth";
import { asyncHandler } from "../middleware/errorHandler";
import { eventValidations, commonValidations, handleValidationErrors } from "../middleware/validation";

const router = express.Router();

// Info endpoint (no auth required)
router.get("/info", (req, res) => {
  res.json({
    success: true,
    message: "Event management endpoints",
    endpoints: {
      getEvents: "GET /api/events",
      createEvent: "POST /api/events",
      updateEvent: "PUT /api/events/:id",
      getEventById: "GET /api/events/:id",
      registerForEvent: "POST /api/events/:id/register",
      getEventRegistrations: "GET /api/events/:id/registrations",
      deleteEvent: "DELETE /api/events/:id"
    }
  });
});

// All routes require authentication
router.use(authenticate);

// Event routes
router.get("/", authorize("student", "teacher", "admin"), asyncHandler(EventController.getAllEvents));
router.get("/upcoming", authorize("student", "teacher", "admin"), asyncHandler(EventController.getUpcomingEvents));
router.get("/:id", authorize("student", "teacher", "admin"), commonValidations.objectId("id"), handleValidationErrors, asyncHandler(EventController.getEventById));
router.post("/", authorize("admin"), eventValidations.create, handleValidationErrors, asyncHandler(EventController.createEvent));
router.put("/:id", authorize("admin"), commonValidations.objectId("id"), handleValidationErrors, asyncHandler(EventController.updateEvent));
router.get("/school/:schoolId", authorize("student", "teacher", "admin"), commonValidations.objectId("schoolId"), handleValidationErrors, asyncHandler(EventController.getEventsBySchool));
router.get("/stats", authorize("admin"), asyncHandler(EventController.getEventStats));
router.delete("/:id", authorize("admin"), commonValidations.objectId("id"), handleValidationErrors, asyncHandler(EventController.deleteEvent));

export default router;
