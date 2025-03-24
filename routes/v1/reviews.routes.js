import { Router } from "express";
import { higherOrderUserDataValidation } from "../../middlewares/validation.middleware.js";
import { ValidationSchema } from "../../schema/validation.schema.js";
import { ReviewController } from "../../controllers/v1/Review.controller.js";

const router = Router();

/**
 * Get all reviews for a book
 * Route: /api/v1/reviews/book/:bookId
 * Params: bookId
 */
router.get("/book/:bookId", ReviewController.handleGetBookReviews);

/**
 * Get review by id
 * Route: /api/v1/reviews/:id
 * Params: id
 */
router.get("/:id", ReviewController.handleGetReviewById);

/**
 * Create a new review
 * Route: /api/v1/reviews
 * Body: bookId, rating, comment
 */
router.post(
  "/",

  higherOrderUserDataValidation(ValidationSchema.createReviewSchema),
  ReviewController.handleCreateReview
);

/**
 * Update a review
 * Route: /api/v1/reviews/:id
 * Params: id
 * Body: rating, comment
 */
router.put(
  "/:id",

  higherOrderUserDataValidation(ValidationSchema.updateReviewSchema),
  ReviewController.handleUpdateReview
);

/**
 * Delete a review
 * Route: /api/v1/reviews/:id
 * Params: id
 */
router.delete(
  "/:id",

  ReviewController.handleDeleteReview
);

export default router;
