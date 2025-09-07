import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { listEvents, createEvent } from "../controller/eventsController";

const router = express.Router();

router.get("/", authMiddleware(["student", "teacher", "admin", "super_admin"]), listEvents);
router.post("/", authMiddleware(["admin", "super_admin"]), createEvent);

export default router;