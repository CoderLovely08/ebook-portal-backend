import { Router } from "express";
import { AuthController } from "../../controllers/v1/Auth.controller.js";
import { higherOrderUserDataValidation } from "../../middlewares/validation.middleware.js";
import { ValidationSchema } from "../../schema/validation.schema.js";

const router = Router();

/**
 * Handle post system user login
 * Route: /api/v1/auth/login
 * body: {
 *  email: string,
 *  password: string
 * }
 */
router.post(
  "/login",
  higherOrderUserDataValidation(ValidationSchema.loginSchema),
  AuthController.handlePostSystemUserLogin
);

/**
 * Handle post system user registration
 * Route: /api/v1/auth/register
 * body: {
 *  email: string,
 *  password: string,
 *  fullName: string
 * }
 */
router.post(
  "/register",
  higherOrderUserDataValidation(ValidationSchema.simpleUserOnboardingSchema),
  AuthController.handlePostSystemUserRegistration
);

export default router;
