import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/environment";
import { AuthenticatedRequest, JwtPayload, UserRole } from "../types";
import { CustomError } from "./errorHandler";
import { logger } from "../utils/logger";

// Generate JWT token
export const generateToken = (id: string, role: UserRole): string => {
  return jwt.sign({ id, role }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

// Verify JWT token
export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, config.jwt.secret) as JwtPayload;
  } catch (error) {
    throw new CustomError("Invalid or expired token", 401);
  }
};

// Authentication middleware
export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    // Get token from Authorization header or cookie
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      throw new CustomError("Access denied. No token provided.", 401);
    }

    // Verify token
    const decoded = verifyToken(token);
    
    // Attach user info to request
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    logger.debug(`User authenticated: ${decoded.id} (${decoded.role})`);
    next();
  } catch (error) {
    next(error);
  }
};

// Role-based authorization middleware
export const authorize = (...roles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new CustomError("Authentication required", 401);
    }

    if (!roles.includes(req.user.role as UserRole)) {
      logger.warn(`Unauthorized access attempt by user ${req.user.id} with role ${req.user.role}`);
      throw new CustomError("Insufficient permissions", 403);
    }

    next();
  };
};

// Optional authentication middleware (doesn't throw error if no token)
export const optionalAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (token) {
      const decoded = verifyToken(token);
      req.user = {
        id: decoded.id,
        role: decoded.role,
      };
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};
