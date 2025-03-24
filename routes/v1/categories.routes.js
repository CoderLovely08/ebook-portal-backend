import { Router } from "express";
import { higherOrderUserDataValidation } from "../../middlewares/validation.middleware.js";
import { ValidationSchema } from "../../schema/validation.schema.js";
import { CategoryController } from "../../controllers/v1/Category.controller.js";
import { checkRole, validateToken } from "../../middlewares/auth.middleware.js";
import { USER_ROLES } from "../../utils/constants/app.constant.js";

const router = Router();

/**
 * Get all categories
 * Route: /api/v1/categories
 */
router.get("/", CategoryController.handleGetAllCategories);

/**
 * Get category by id
 * Route: /api/v1/categories/:id
 * Params: id
 */
router.get("/:id", CategoryController.handleGetCategoryById);

/**
 * Get books by category
 * Route: /api/v1/categories/:id/books
 * Params: id
 */
router.get("/:id/books", CategoryController.handleGetBooksByCategory);

/**
 * Create a new category (Admin only)
 * Route: /api/v1/categories
 * Body: name, description
 */
router.post(
  "/",
  validateToken,
  checkRole([USER_ROLES.ADMIN]),
  higherOrderUserDataValidation(ValidationSchema.createCategorySchema),
  CategoryController.handleCreateCategory
);

/**
 * Update a category (Admin only)
 * Route: /api/v1/categories/:id
 * Params: id
 * Body: name, description
 */
router.put(
  "/:id",
  validateToken,
  checkRole([USER_ROLES.ADMIN]),
  higherOrderUserDataValidation(ValidationSchema.updateCategorySchema),
  CategoryController.handleUpdateCategory
);

/**
 * Delete a category (Admin only)
 * Route: /api/v1/categories/:id
 * Params: id
 */
router.delete(
  "/:id",
  validateToken,
  checkRole([USER_ROLES.ADMIN]),
  CategoryController.handleDeleteCategory
);

export default router;
