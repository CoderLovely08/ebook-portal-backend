import { prisma } from "../../app.js";
import { CustomError } from "../core/CustomResponse.js";

export class ReviewService {

  /**
   * Get all reviews for a user
   * @param {number} userId - The user id
   * @returns {Promise<Array>} The reviews
   */
  static async getUserReviews(userId) {
    try {
      const reviews = await prisma.review.findMany({
        where: {
          userId,
        },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          book: {
            select: {
              id: true,
              title: true,
              author: true,
              coverImage: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return reviews;
    } catch (error) {
      throw new CustomError(`Error fetching user reviews: ${error.message}`);
    }
  }

  /**
   * Get all reviews for a book
   * @param {string} bookId - The book id
   * @returns {Promise<Array>} The reviews
   */
  static async getBookReviews(bookId) {
    try {
      // Check if the book exists
      const book = await prisma.book.findUnique({
        where: { id: bookId },
      });

      if (!book) {
        throw new CustomError("Book not found", 404);
      }

      const reviews = await prisma.review.findMany({
        where: {
          bookId,
        },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return reviews;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(`Error fetching book reviews: ${error.message}`);
    }
  }

  /**
   * Get a review by id
   * @param {string} id - The review id
   * @returns {Promise<Object>} The review
   */
  static async getReviewById(id) {
    try {
      const review = await prisma.review.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          book: {
            select: {
              id: true,
              title: true,
              author: true,
              coverImage: true,
            },
          },
        },
      });

      if (!review) {
        throw new CustomError("Review not found", 404);
      }

      return review;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(`Error fetching review: ${error.message}`);
    }
  }

  /**
   * Create a review
   * @param {Object} reviewData - The review data
   * @param {number} reviewData.userId - The user id
   * @param {string} reviewData.bookId - The book id
   * @param {number} reviewData.rating - The rating (1-5)
   * @param {string} reviewData.comment - The comment (optional)
   * @returns {Promise<Object>} The created review
   */
  static async createReview(reviewData) {
    try {
      const { userId, bookId, rating, comment } = reviewData;

      // Validate rating
      if (rating < 1 || rating > 5) {
        throw new CustomError("Rating must be between 1 and 5", 400);
      }

      // Check if the book exists
      const book = await prisma.book.findUnique({
        where: { id: bookId },
      });

      if (!book) {
        throw new CustomError("Book not found", 404);
      }

      // Check if the user has already reviewed this book
      const existingReview = await prisma.review.findUnique({
        where: {
          userId_bookId: {
            userId,
            bookId,
          },
        },
      });

      if (existingReview) {
        throw new CustomError("You have already reviewed this book", 400);
      }

      // Check if the user has the book in their library
      const libraryEntry = await prisma.userLibrary.findUnique({
        where: {
          userId_bookId: {
            userId,
            bookId,
          },
        },
      });

      if (!libraryEntry) {
        throw new CustomError("You need to add this book to your library before reviewing it", 400);
      }

      // Create the review
      const review = await prisma.review.create({
        data: {
          userId,
          bookId,
          rating,
          comment,
        },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          book: {
            select: {
              id: true,
              title: true,
              author: true,
              coverImage: true,
            },
          },
        },
      });

      return review;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(`Error creating review: ${error.message}`);
    }
  }

  /**
   * Update a review
   * @param {string} id - The review id
   * @param {number} userId - The user id
   * @param {Object} reviewData - The review data to update
   * @param {number} reviewData.rating - The rating (1-5) (optional)
   * @param {string} reviewData.comment - The comment (optional)
   * @returns {Promise<Object>} The updated review
   */
  static async updateReview(id, userId, reviewData) {
    try {
      const { rating, comment } = reviewData;

      // Check if the review exists
      const review = await prisma.review.findUnique({
        where: { id },
      });

      if (!review) {
        throw new CustomError("Review not found", 404);
      }

      // Check if the review belongs to the user
      if (review.userId !== userId) {
        throw new CustomError("You can only update your own reviews", 403);
      }

      // Validate rating if provided
      if (rating !== undefined && (rating < 1 || rating > 5)) {
        throw new CustomError("Rating must be between 1 and 5", 400);
      }

      // Remove undefined fields
      const updateData = {};
      if (rating !== undefined) updateData.rating = rating;
      if (comment !== undefined) updateData.comment = comment;

      // Update the review
      const updatedReview = await prisma.review.update({
        where: { id },
        data: updateData,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          book: {
            select: {
              id: true,
              title: true,
              author: true,
              coverImage: true,
            },
          },
        },
      });

      return updatedReview;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(`Error updating review: ${error.message}`);
    }
  }

  /**
   * Delete a review
   * @param {string} id - The review id
   * @param {number} userId - The user id
   * @returns {Promise<void>}
   */
  static async deleteReview(id, userId) {
    try {
      // Check if the review exists
      const review = await prisma.review.findUnique({
        where: { id },
      });

      if (!review) {
        throw new CustomError("Review not found", 404);
      }

      // Check if the review belongs to the user
      if (review.userId !== userId) {
        throw new CustomError("You can only delete your own reviews", 403);
      }

      // Delete the review
      await prisma.review.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(`Error deleting review: ${error.message}`);
    }
  }
} 