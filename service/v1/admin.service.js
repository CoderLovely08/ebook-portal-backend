import { prisma } from "../../app.js";
import { CustomError } from "../core/CustomResponse.js";

export class AdminService {
  /**
   * Get all users
   * @param {Object} options - The options object
   * @param {string} options.search - Search term for user email or name
   * @param {number} options.page - Page number for pagination
   * @param {number} options.limit - Number of users to return
   * @returns {Promise<Object>} The users with pagination info
   */
  static async getAllUsers({ search, page = 1, limit = 10 }) {
    try {
      const skip = (page - 1) * limit;
      
      // Build the where clause
      const where = {
        userType: {
          id: 2,
        },
      };
      
      if (search) {
        where.OR = [
          { email: { contains: search, mode: 'insensitive' } },
          { fullName: { contains: search, mode: 'insensitive' } },
        ];
      }
      
      const users = await prisma.systemUsersInfo.findMany({
        where,
        select: {
          id: true,
          email: true,
          fullName: true,
          userType: {
            select: {
              id: true,
              name: true,
            },
          },
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      });
      
      // Count total users for pagination
      const total = await prisma.systemUsersInfo.count({ where });
      
      return {
        data: users,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new CustomError(`Error fetching users: ${error.message}`);
    }
  }

  /**
   * Get all purchases
   * @param {Object} options - The options object
   * @param {string} options.status - Filter by status
   * @param {number} options.page - Page number for pagination
   * @param {number} options.limit - Number of purchases to return
   * @returns {Promise<Object>} The purchases with pagination info
   */
  static async getAllPurchases({ status, page = 1, limit = 10 }) {
    try {
      const skip = (page - 1) * limit;
      
      // Build the where clause
      const where = {};
      
      if (status) {
        where.status = status;
      }
      
      const purchases = await prisma.purchaseOrder.findMany({
        where,
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
              price: true,
              isFree: true,
            },
          },
        },
        orderBy: {
          purchaseDate: 'desc',
        },
        skip,
        take: limit,
      });
      
      // Count total purchases for pagination
      const total = await prisma.purchaseOrder.count({ where });
      
      return {
        data: purchases,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new CustomError(`Error fetching purchases: ${error.message}`);
    }
  }

  /**
   * Get dashboard stats
   * @returns {Promise<Object>} The dashboard stats
   */
  static async getDashboardStats() {
    try {
      // Get total users
      const totalUsers = await prisma.systemUsersInfo.count();
      
      // Get total books
      const totalBooks = await prisma.book.count();
      
      // Get total free books
      const totalFreeBooks = await prisma.book.count({
        where: { isFree: true },
      });
      
      // Get total paid books
      const totalPaidBooks = await prisma.book.count({
        where: { isFree: false },
      });
      
      // Get total categories
      const totalCategories = await prisma.category.count();
      
      // Get total purchases
      const totalPurchases = await prisma.purchaseOrder.count();
      
      // Get pending purchases
      const pendingPurchases = await prisma.purchaseOrder.count({
        where: { status: 'PENDING' },
      });
      
      // Get completed purchases
      const completedPurchases = await prisma.purchaseOrder.count({
        where: { status: 'COMPLETED' },
      });
      
      // Get cancelled purchases
      const cancelledPurchases = await prisma.purchaseOrder.count({
        where: { status: 'CANCELLED' },
      });
      
      // Get recent users
      const recentUsers = await prisma.systemUsersInfo.findMany({
        select: {
          id: true,
          email: true,
          fullName: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 5,
      });
      
      // Get recent purchases
      const recentPurchases = await prisma.purchaseOrder.findMany({
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
            },
          },
        },
        orderBy: {
          purchaseDate: 'desc',
        },
        take: 5,
      });
      
      // Get total books in libraries
      const totalLibraryEntries = await prisma.userLibrary.count();
      
      // Get total reviews
      const totalReviews = await prisma.review.count();
      
      // Calculate average rating across all books
      const reviewStats = await prisma.review.aggregate({
        _avg: {
          rating: true,
        },
        _count: {
          rating: true,
        },
      });
      
      const avgRating = reviewStats._avg.rating || 0;
      
      return {
        counts: {
          users: totalUsers,
          books: totalBooks,
          freeBooks: totalFreeBooks,
          paidBooks: totalPaidBooks,
          categories: totalCategories,
          purchases: totalPurchases,
          pendingPurchases,
          completedPurchases,
          cancelledPurchases,
          libraryEntries: totalLibraryEntries,
          reviews: totalReviews,
        },
        rating: {
          average: avgRating,
          count: reviewStats._count.rating,
        },
        recent: {
          users: recentUsers,
          purchases: recentPurchases,
        },
      };
    } catch (error) {
      throw new CustomError(`Error fetching dashboard stats: ${error.message}`);
    }
  }
} 