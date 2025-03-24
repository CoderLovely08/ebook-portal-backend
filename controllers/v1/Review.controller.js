import { APIResponse } from "../../service/core/CustomResponse.js";
import { ReviewService } from "../../service/v1/review.service.js";

export class ReviewController {
  /**
   * Handle get book reviews
   * @description Get all reviews for a book
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @returns {Object} The response object
   */
  static async handleGetBookReviews(req, res) {
    try {
      const { bookId } = req.params;
      
      const reviews = await ReviewService.getBookReviews(bookId);

      return APIResponse.success(res, reviews, "Book reviews retrieved successfully");
    } catch (error) {
      return APIResponse.error(res, error.message, error.statusCode);
    }
  }

  /**
   * Handle get review by id
   * @description Get a review by id
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @returns {Object} The response object
   */
  static async handleGetReviewById(req, res) {
    try {
      const { id } = req.params;
      
      const review = await ReviewService.getReviewById(id);

      return APIResponse.success(res, review, "Review retrieved successfully");
    } catch (error) {
      return APIResponse.error(res, error.message, error.statusCode);
    }
  }

  /**
   * Handle create review
   * @description Create a new review
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @returns {Object} The response object
   */
  static async handleCreateReview(req, res) {
    try {
      const { bookId, rating, comment } = req.body;
      const userId = req.user.userId;
      
      const review = await ReviewService.createReview({
        userId,
        bookId,
        rating: parseInt(rating),
        comment,
      });

      return APIResponse.success(res, review, "Review created successfully");
    } catch (error) {
      return APIResponse.error(res, error.message, error.statusCode);
    }
  }

  /**
   * Handle update review
   * @description Update a review
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @returns {Object} The response object
   */
  static async handleUpdateReview(req, res) {
    try {
      const { id } = req.params;
      const { rating, comment } = req.body;
      const userId = req.user.userId;
      
      const review = await ReviewService.updateReview(id, userId, {
        rating: rating ? parseInt(rating) : undefined,
        comment,
      });

      return APIResponse.success(res, review, "Review updated successfully");
    } catch (error) {
      return APIResponse.error(res, error.message, error.statusCode);
    }
  }

  /**
   * Handle delete review
   * @description Delete a review
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @returns {Object} The response object
   */
  static async handleDeleteReview(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;
      
      await ReviewService.deleteReview(id, userId);

      return APIResponse.success(res, null, "Review deleted successfully");
    } catch (error) {
      return APIResponse.error(res, error.message, error.statusCode);
    }
  }
} 