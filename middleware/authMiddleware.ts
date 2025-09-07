import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

interface JwtPayload {
    id: string;
    role: string;
}

export const authMiddleware = (roles: string[] = []) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            // 1️⃣ Get token from Authorization header (Bearer <token>) OR cookie
            let token: string | undefined;

            if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
                token = req.headers.authorization.split(" ")[1];
            } else if (req.cookies?.token) {
                token = req.cookies.token;
            }

            if (!token) {
                return res.status(401).json({ message: "Unauthorized, no token provided" });
            }

            // 2️⃣ Verify token
            const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

            // 3️⃣ Attach user info to request
            (req as any).user = decoded;

            // 4️⃣ Role check
            if (roles.length > 0 && !roles.includes(decoded.role)) {
                return res.status(403).json({ message: "Forbidden: insufficient role" });
            }

            next();
        } catch (error) {
            console.error("Auth error:", error);
            return res.status(401).json({ message: "Invalid or expired token" });
        }
    };
};
