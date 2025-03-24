import { prisma } from "../../app.js";
import { CustomError } from "../core/CustomResponse.js";
import { ORDER_STATUS, PRISMA_ERROR_CODES } from "../../utils/constants/app.constant.js";

export class PurchaseService {
  /**
   * Get all purchases for a user
   * @param {number} userId - The user id
   * @returns {Promise<Array>} The purchases
   */
  static async getUserPurchases(userId) {
    try {
      const purchases = await prisma.purchaseOrder.findMany({
        where: {
          userId,
        },
        include: {
          book: {
            select: {
              id: true,
              title: true,
              author: true,
              coverImage: true,
              price: true,
              isFree: true,
            },
          },
        },
        orderBy: {
          purchaseDate: 'desc',
        },
      });

      return purchases;
    } catch (error) {
      throw new CustomError(`Error fetching user purchases: ${error.message}`);
    }
  }

  /**
   * Get purchase by id
   * @param {string} id - The purchase id
   * @param {number} userId - The user id
   * @returns {Promise<Object>} The purchase
   */
  static async getPurchaseById(id, userId) {
    try {
      const purchase = await prisma.purchaseOrder.findUnique({
        where: { id },
        include: {
          book: true,
        },
      });

      if (!purchase) {
        throw new CustomError("Purchase not found", 404);
      }

      // Make sure the purchase belongs to the user (admin can see all purchases)
      if (purchase.userId !== userId) {
        throw new CustomError("You do not have permission to view this purchase", 403);
      }

      return purchase;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(`Error fetching purchase: ${error.message}`);
    }
  }

  /**
   * Create a purchase
   * @param {number} userId - The user id
   * @param {string} bookId - The book id
   * @returns {Promise<Object>} The created purchase
   */
  static async createPurchase(userId, bookId) {
    try {
      // Check if book exists
      const book = await prisma.book.findUnique({
        where: { id: bookId },
      });

      if (!book) {
        throw new CustomError("Book not found", 404);
      }

      // Check if the book is already purchased
      const existingPurchase = await prisma.purchaseOrder.findFirst({
        where: {
          userId,
          bookId,
          status: {
            in: [ORDER_STATUS.PENDING, ORDER_STATUS.COMPLETED],
          },
        },
      });

      if (existingPurchase) {
        throw new CustomError("You have already purchased this book", 400);
      }

      return await prisma.$transaction(async (tx) => {
        // Create the purchase
        const purchase = await tx.purchaseOrder.create({
          data: {
            userId,
            bookId,
            status: book.isFree ? ORDER_STATUS.COMPLETED : ORDER_STATUS.PENDING,
          },
          include: {
            book: {
              select: {
                id: true,
                title: true,
                author: true,
                coverImage: true,
                price: true,
                isFree: true,
              },
            },
          },
        });

        // If the book is free, add it to the user's library immediately
        if (book.isFree) {
          await tx.userLibrary.create({
            data: {
              userId,
              bookId,
            },
          });
        }

        return purchase;
      });
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      
      throw new CustomError(`Error creating purchase: ${error.message}`);
    }
  }

  /**
   * Update purchase status
   * @param {string} id - The purchase id
   * @param {string} status - The new status
   * @returns {Promise<Object>} The updated purchase
   */
  static async updatePurchaseStatus(id, status) {
    try {
      // Validate status
      const validStatuses = Object.values(ORDER_STATUS);
      if (!validStatuses.includes(status)) {
        throw new CustomError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
      }

      // Check if purchase exists
      const purchase = await prisma.purchaseOrder.findUnique({
        where: { id },
        include: {
          book: true,
        },
      });

      if (!purchase) {
        throw new CustomError("Purchase not found", 404);
      }

      return await prisma.$transaction(async (tx) => {
        // Update the purchase status
        const updatedPurchase = await tx.purchaseOrder.update({
          where: { id },
          data: {
            status,
          },
          include: {
            book: true,
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        });

        // If the status is changed to COMPLETED, add the book to the user's library
        if (status === ORDER_STATUS.COMPLETED && purchase.status !== ORDER_STATUS.COMPLETED) {
          // Check if the book is already in the user's library
          const existingLibraryEntry = await tx.userLibrary.findUnique({
            where: {
              userId_bookId: {
                userId: purchase.userId,
                bookId: purchase.bookId,
              },
            },
          });

          if (!existingLibraryEntry) {
            await tx.userLibrary.create({
              data: {
                userId: purchase.userId,
                bookId: purchase.bookId,
              },
            });
          }
        }

        return updatedPurchase;
      });
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      
      throw new CustomError(`Error updating purchase status: ${error.message}`);
    }
  }
} 