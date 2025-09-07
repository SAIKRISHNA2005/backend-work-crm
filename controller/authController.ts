import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { StudentProfile } from "../models/StudentProfile";
import { TeacherProfile } from "../models/TeacherProfile";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

const generateToken = (id: string, role: string) => {
    return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: "7d" });
};

export const login = async (req: Request, res: Response) => {
    try {
        const { accId, password, role } = req.body;

        if (!accId || !password || !role) {
            return res.status(400).json({ message: "Email, password and role required" });
        }

        let user: any;
        if (role === "student") {
            user = await StudentProfile.findOne({ student_id: accId });
        } else if (role === "teacher") {
            user = await TeacherProfile.findOne({ teacherId: accId });
        } else {
            return res.status(400).json({ message: "Invalid role" });
        }

        if (!user) return res.status(404).json({ message: "User not found" });

        // (⚡ right now no bcrypt check, just plain password check)
        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateToken(accId, role);

        // ✅ Set cookie for persistence
        res.cookie("token", token, {
            httpOnly: true,      // JS can't access -> safer
            secure: process.env.NODE_ENV === "production", // use HTTPS in production
            sameSite: "strict",  // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(200).json({
            message: "Login successful",
            user: { id: accId, name: user.name, role }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
