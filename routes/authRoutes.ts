import express from "express";
import { login } from "../controller/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/login", login);

// Protected routes
router.get("/student-only", authMiddleware(["student"]), (req, res) => {
    res.json({ message: "Hello Student" });
});

router.get("/teacher-only", authMiddleware(["teacher"]), (req, res) => {
    res.json({ message: "Hello Teacher" });
});

export default router;
