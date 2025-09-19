import { Request, Response, NextFunction } from "express";
import { supabase } from "../config/database";
import { Database } from "../types/database";
import { AuthenticatedRequest, UserRole } from "../types";
import { CustomError } from "./errorHandler";

// Validate Supabase access token and map to application user (users table)
export const supabaseAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      throw new CustomError("Access denied. No token provided.", 401);
    }

    // Validate token with Supabase
    const { data: userData, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userData?.user) {
      throw new CustomError("Invalid token", 401);
    }

    const email = userData.user.email;
    if (!email) throw new CustomError("No email on token user", 401);

    // Map to our app user by email
    const { data: appUser, error } = await supabase
      .from("users")
      .select("id, email, role, status")
      .eq("email", email)
      .single<Database['public']['Tables']['users']['Row']>();

    if (error || !appUser) throw new CustomError("User record not found", 403);
    if (appUser.status !== "active") throw new CustomError("User inactive", 403);

    // Attach app user to request
    req.user = { id: String(appUser.id), role: appUser.role as UserRole };
    next();
  } catch (err) {
    next(err);
  }
};

// Role guard compatible with req.user populated by supabaseAuth
export const supabaseAuthorize = (...roles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) return next(new CustomError("Authentication required", 401));
    if (!roles.includes(req.user.role as UserRole)) {
      return next(new CustomError("Insufficient permissions", 403));
    }
    next();
  };
};