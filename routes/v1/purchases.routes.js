import { Router } from "express";
import { higherOrderUserDataValidation } from "../../middlewares/validation.middleware.js";
import { ValidationSchema } from "../../schema/validation.schema.js";
import { PurchaseController } from "../../controllers/v1/Purchase.controller.js";

const router = Router();

/**
 * Get all purchases for current user
 * Route: /api/v1/purchases
 */
router.get("/", PurchaseController.handleGetUserPurchases);

/**
 * Get purchase by id
 * Route: /api/v1/purchases/:id
 * Params: id
 */
router.get("/:id", PurchaseController.handleGetPurchaseById);

/**
 * Create a new purchase
 * Route: /api/v1/purchases
 * Body: bookId
 */
router.post(
  "/",

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
  higherOrderUserDataValidation(ValidationSchema.updatePurchaseStatusSchema),
  PurchaseController.handleUpdatePurchaseStatus
);

export default router;
