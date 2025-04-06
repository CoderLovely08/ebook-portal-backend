import { prisma } from "../../app.js";
import {
    ORDER_STATUS,
    USER_TYPES,
} from "../../utils/constants/app.constant.js";
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
                    id: 4,
                },
            };

            if (search) {
                where.OR = [
                    { email: { contains: search, mode: "insensitive" } },
                    { fullName: { contains: search, mode: "insensitive" } },
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
                    createdAt: "desc",
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
                    purchaseDate: "desc",
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
            const [
                users,
                books,
                categories,
                purchases,
                libraries,
                reviews,
                recentUsers,
                recentBooks,
                recentPurchases,
            ] = await prisma.$transaction([
                // Get all users
                prisma.systemUsersInfo.count({
                    where: {
                        userType: {
                            name: USER_TYPES.USER,
                        },
                    },
                }),
                // Get all books
                prisma.book.findMany({
                    select: { id: true, isFree: true, price: true },
                }),
                // Get all categories
                prisma.category.findMany({ select: { id: true } }),
                // Get all purchases
                prisma.purchaseOrder.findMany({
                    include: { book: { select: { price: true } } },
                }),
                // Get all libraries
                prisma.userLibrary.findMany({ select: { id: true } }),
                // Get all reviews
                prisma.review.findMany({ select: { rating: true } }),
                // Get all recent users
                prisma.systemUsersInfo.findMany({
                    where: {
                        userType: {
                            name: USER_TYPES.USER,
                        },
                    },
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                        createdAt: true,
                    },
                    orderBy: { createdAt: "desc" },
                    take: 5,
                }),
                // Get all recent books
                prisma.book.findMany({
                    select: {
                        id: true,
                        title: true,
                        author: true,
                        coverImage: true,
                        price: true,
                        isFree: true,
                        createdAt: true,
                        publishedDate: true,
                    },
                    orderBy: { createdAt: "desc" },
                    take: 5,
                }),
                // Get all recent purchases
                prisma.purchaseOrder.findMany({
                    select: {
                        id: true,
                        purchaseDate: true,
                        book: {
                            select: {
                                id: true,
                                title: true,
                                price: true,
                            },
                        },
                        user: {
                            select: {
                                fullName: true,
                            },
                        },
                        status: true,
                    },
                    orderBy: { purchaseDate: "desc" },
                    take: 5,
                }),
            ]);

            // Derive counts and stats
            const totalUsers = users;
            const totalBooks = books.length;
            const totalFreeBooks = books.filter((b) => b.isFree).length;
            const totalPaidBooks = totalBooks - totalFreeBooks;
            const totalCategories = categories.length;
            const totalPurchases = purchases.length;
            const pendingPurchases = purchases.filter(
                (p) => p.status === "PENDING"
            ).length;
            const completedPurchases = purchases.filter(
                (p) => p.status === "COMPLETED"
            ).length;
            const cancelledPurchases = purchases.filter(
                (p) => p.status === "CANCELLED"
            ).length;
            const totalLibraryEntries = libraries.length;
            const totalReviews = reviews.length;

            const totalRevenue = purchases.reduce((sum, order) => {
                return sum + (order.book?.price || 0);
            }, 0);

            const ratingSum = reviews.reduce((sum, r) => sum + r.rating, 0);
            const avgRating = reviews.length ? ratingSum / reviews.length : 0;

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
                    count: totalReviews,
                },
                recent: {
                    users: recentUsers,
                    books: recentBooks,
                    purchases: recentPurchases,
                },
                revenue: totalRevenue,
            };
        } catch (error) {
            throw new CustomError(
                `Error fetching dashboard stats: ${error.message}`
            );
        }
    }
}
