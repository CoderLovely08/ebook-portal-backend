import express from "express";
import userController from "../../controllers/v1/user.controller.js";

const router = express.Router();

// Get user statistics
router.get("/stats", userController.getUserStats);

export default router;
