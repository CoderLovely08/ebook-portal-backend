import { Router } from "express";
import { higherOrderUserDataValidation } from "../../middlewares/validation.middleware.js";
import { ValidationSchema } from "../../schema/validation.schema.js";
import { PurchaseController } from "../../controllers/v1/Purchase.controller.js";
import { checkRole, validateToken } from "../../middlewares/auth.middleware.js";
import { USER_ROLES } from "../../utils/constants/app.constant.js";

const router = Router();

/**
 * Get all purchases for current user
 * Route: /api/v1/purchases
 */
router.get(
  "/",
  validateToken,
  checkRole([USER_ROLES.USER]),
  PurchaseController.handleGetUserPurchases
);

/**
 * Get purchase by id
 * Route: /api/v1/purchases/:id
 * Params: id
 */
router.get(
  "/:id",
  validateToken,
  checkRole([USER_ROLES.USER]),
  PurchaseController.handleGetPurchaseById
);

/**
 * Create a new purchase
 * Route: /api/v1/purchases
 * Body: bookId
 */
router.post(
  "/",
  validateToken,
  checkRole([USER_ROLES.USER]),
  higherOrderUserDataValidation(ValidationSchema.createPurchaseSchema),
  PurchaseController.handleCreatePurchase
);

/**
 * Update purchase status (Admin only)
 * Route: /api/v1/purchases/:id
 * Params: id
 * Body: status
 */
router.put(
  "/:id/status",
  validateToken,
  checkRole([USER_ROLES.ADMIN]),
  higherOrderUserDataValidation(ValidationSchema.updatePurchaseStatusSchema),
  PurchaseController.handleUpdatePurchaseStatus
);

export default router;
