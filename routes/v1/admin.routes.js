import { Router } from "express";
import { AdminController } from "../../controllers/v1/Admin.controller.js";
// Import admin middleware that will be created

const router = Router();

/**
 * Get all users (Admin only)
 * Route: /api/v1/admin/users
 */
router.get("/users", AdminController.handleGetAllUsers);

/**
 * Get all purchases (Admin only)
 * Route: /api/v1/admin/purchases
 */
router.get("/purchases", AdminController.handleGetAllPurchases);

/**
 * Dashboard stats (Admin only)
 * Route: /api/v1/admin/stats
 */
router.get("/stats", AdminController.handleGetStats);

export default router;
