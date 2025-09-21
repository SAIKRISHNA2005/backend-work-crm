import { Request, Response, NextFunction } from "express";
import { body, param, query, validationResult } from "express-validator";
import { CustomError } from "./errorHandler";

// Validation result handler
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.type === "field" ? (error as any).path : "unknown",
      message: error.msg,
      value: error.type === "field" ? (error as any).value : undefined,
    }));
    
    throw new CustomError(`Validation failed: ${errorMessages.map(e => e.message).join(", ")}`, 400);
  }
  next();
};

// Common validation rules
export const commonValidations = {
  // ID validation (for PostgreSQL integer IDs)
  objectId: (field: string) => param(field).isInt({ min: 1 }).withMessage(`Invalid ${field} format`),
  
  // String validation
  requiredString: (field: string, minLength: number = 1, maxLength: number = 255) =>
    body(field)
      .trim()
      .isLength({ min: minLength, max: maxLength })
      .withMessage(`${field} must be between ${minLength} and ${maxLength} characters`),
  
  // Optional string validation
  optionalString: (field: string, maxLength: number = 255) =>
    body(field)
      .optional()
      .trim()
      .isLength({ max: maxLength })
      .withMessage(`${field} must not exceed ${maxLength} characters`),
  
  // Email validation
  email: (field: string = "email") =>
    body(field)
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email address"),
  
  // Phone number validation
  phoneNumber: (field: string = "phoneNumber") =>
    body(field)
      .matches(/^[0-9]{10}$/)
      .withMessage("Phone number must be exactly 10 digits"),
  
  // Password validation
  password: (field: string = "password") =>
    body(field)
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage("Password must contain at least one lowercase letter, one uppercase letter, and one number"),
  
  // Date validation
  date: (field: string) =>
    body(field)
      .isISO8601()
      .withMessage(`${field} must be a valid date`),
  
  // Number validation
  number: (field: string, min?: number, max?: number) => {
    let validator = body(field).isNumeric().withMessage(`${field} must be a number`);
    if (min !== undefined) {
      validator = validator.isFloat({ min }).withMessage(`${field} must be at least ${min}`);
    }
    if (max !== undefined) {
      validator = validator.isFloat({ max }).withMessage(`${field} must not exceed ${max}`);
    }
    return validator;
  },
  
  // Pagination validation
  pagination: () => [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be between 1 and 100"),
    query("sort")
      .optional()
      .isIn(["createdAt", "updatedAt", "name", "email"])
      .withMessage("Invalid sort field"),
    query("order")
      .optional()
      .isIn(["asc", "desc"])
      .withMessage("Order must be either 'asc' or 'desc'"),
  ],
};

// Specific validation rules for different entities
export const authValidations = {
  login: [
    body("accId").notEmpty().withMessage("Account ID (username) is required"),
    body("password").notEmpty().withMessage("Password is required"),
    body("role").isIn(["student", "teacher", "admin", "super_admin"]).withMessage("Invalid role"),
  ],
  
  register: [
    body("username").notEmpty().withMessage("Username is required"),
    body("email").optional().isEmail().normalizeEmail().withMessage("Please provide a valid email"),
    body("phone").optional().matches(/^[0-9]{10}$/).withMessage("Phone number must be exactly 10 digits"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    body("role").isIn(["student", "teacher", "admin", "super_admin"]).withMessage("Invalid role"),
  ],
};

export const studentValidations = {
  create: [
    body("student_id").notEmpty().withMessage("Student ID is required"),
    body("name").trim().isLength({ min: 2, max: 100 }).withMessage("Name must be between 2 and 100 characters"),
    body("roll_number").notEmpty().withMessage("Roll number is required"),
    body("phone_number").matches(/^[0-9]{10}$/).withMessage("Phone number must be exactly 10 digits"),
    body("class_id").notEmpty().withMessage("Class ID is required"),
    body("email").optional().isEmail().normalizeEmail().withMessage("Please provide a valid email"),
  ],
  
  update: [
    body("name").optional().trim().isLength({ min: 2, max: 100 }).withMessage("Name must be between 2 and 100 characters"),
    body("email").optional().isEmail().normalizeEmail().withMessage("Please provide a valid email"),
    body("phone_number").optional().matches(/^[0-9]{10}$/).withMessage("Phone number must be exactly 10 digits"),
  ],
};

export const teacherValidations = {
  create: [
    body("teacherId").notEmpty().withMessage("Teacher ID is required"),
    body("name").trim().isLength({ min: 2, max: 100 }).withMessage("Name must be between 2 and 100 characters"),
    body("phoneNumber").matches(/^[0-9]{10}$/).withMessage("Phone number must be exactly 10 digits"),
    body("email").optional().isEmail().normalizeEmail().withMessage("Please provide a valid email"),
    body("homeClassId").notEmpty().withMessage("Home class ID is required"),
  ],
  
  update: [
    body("name").optional().trim().isLength({ min: 2, max: 100 }).withMessage("Name must be between 2 and 100 characters"),
    body("email").optional().isEmail().normalizeEmail().withMessage("Please provide a valid email"),
    body("phoneNumber").optional().matches(/^[0-9]{10}$/).withMessage("Phone number must be exactly 10 digits"),
  ],
};

export const marksValidations = {
  create: [
    body("student_id").isInt({ min: 1 }).withMessage("Student ID is required"),
    body("subject_id").isInt({ min: 1 }).withMessage("Invalid subject ID"),
    body("marks_obtained").isFloat({ min: 0, max: 100 }).withMessage("Marks must be between 0 and 100"),
    body("class_code").notEmpty().withMessage("Class code is required"),
  ],
};

export const attendanceValidations = {
  update: [
    body("classCode").notEmpty().withMessage("Class code is required"),
    body("date").isISO8601().withMessage("Date must be a valid date"),
    body("present").isArray().withMessage("Present list must be an array"),
  ],
};

export const eventValidations = {
  create: [
    body("title").trim().isLength({ min: 3, max: 200 }).withMessage("Title must be between 3 and 200 characters"),
    body("category").isIn(["Cultural", "Academic", "Educational", "Sports", "Other"]).withMessage("Invalid category"),
    body("location").trim().isLength({ min: 3, max: 200 }).withMessage("Location must be between 3 and 200 characters"),
    body("startDate").isISO8601().withMessage("Start date must be a valid date"),
    body("endDate").optional().isISO8601().withMessage("End date must be a valid date"),
  ],
};
