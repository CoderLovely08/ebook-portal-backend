import { prisma } from "../../app.js";
import { CustomError } from "../core/CustomResponse.js";
import { ORDER_STATUS } from "../../utils/constants/app.constant.js";

export class LibraryService {
  /**
   * Get user's library
   * @param {number} userId - The user id
   * @returns {Promise<Array>} The user's library books
   */
  static async getUserLibrary(userId) {
    try {
      const libraryEntries = await prisma.userLibrary.findMany({
        where: {
          userId,
        },
        include: {
          book: {
            include: {
              categories: {
                include: {
                  category: true,
                },
              },
              reviews: {
                select: {
                  rating: true,
                },
              },
            },
          },
        },
        orderBy: {
          addedDate: 'desc',
        },
      });

      // Transform the data to simplify the response
      const formattedBooks = libraryEntries.map(entry => {
        const { book } = entry;
        
        // Calculate average rating
        const avgRating = book.reviews.length > 0
          ? book.reviews.reduce((sum, review) => sum + review.rating, 0) / book.reviews.length
          : 0;
          
        // Extract category names
        const categories = book.categories.map(c => c.category);
        
        return {
          ...book,
          addedToLibraryAt: entry.addedDate,
          categories,
          avgRating,
          reviewCount: book.reviews.length,
          reviews: undefined, // Remove the raw reviews data
        };
      });

      return formattedBooks;
    } catch (error) {
      throw new CustomError(`Error fetching user library: ${error.message}`);
    }
  }

  /**
   * Add a book to user's library
   * @param {number} userId - The user id
   * @param {string} bookId - The book id
   * @returns {Promise<Object>} The library entry or null if automatic for purchase
   */
  static async addBookToLibrary(userId, bookId) {
    try {
      // Check if book exists
      const book = await prisma.book.findUnique({
        where: { id: bookId },
      });

      if (!book) {
        throw new CustomError("Book not found", 404);
      }

      // Check if the book is already in the user's library
      const existingEntry = await prisma.userLibrary.findUnique({
        where: {
          userId_bookId: {
            userId,
            bookId,
          },
        },
      });

      if (existingEntry) {
        throw new CustomError("This book is already in your library", 400);
      }

      // For free books, directly add to library
      if (book.isFree) {
        // Create the library entry
        const libraryEntry = await prisma.userLibrary.create({
          data: {
            userId,
            bookId,
          },
        });

        return libraryEntry;
      } else {
        // For paid books, check if the user has purchased and completed the purchase
        const purchase = await prisma.purchaseOrder.findFirst({
          where: {
            userId,
            bookId,
            status: ORDER_STATUS.COMPLETED,
          },
        });

        if (!purchase) {
          throw new CustomError("You need to purchase this book first", 400);
        }

        // Create the library entry
        const libraryEntry = await prisma.userLibrary.create({
          data: {
            userId,
            bookId,
          },
        });

        return libraryEntry;
      }
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      
      throw new CustomError(`Error adding book to library: ${error.message}`);
    }
  }

  /**
   * Remove a book from user's library
   * @param {number} userId - The user id
   * @param {string} bookId - The book id
   * @returns {Promise<void>}
   */
  static async removeBookFromLibrary(userId, bookId) {
    try {
      // Check if the book is in the user's library
      const libraryEntry = await prisma.userLibrary.findUnique({
        where: {
          userId_bookId: {
            userId,
            bookId,
          },
        },
      });

      if (!libraryEntry) {
        throw new CustomError("This book is not in your library", 404);
      }

      // Delete the library entry
      await prisma.userLibrary.delete({
        where: {
          id: libraryEntry.id,
        },
      });
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      
      throw new CustomError(`Error removing book from library: ${error.message}`);
    }
  }
} 