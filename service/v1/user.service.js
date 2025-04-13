import { prisma } from "../../app.js";
import { CustomError } from "../core/CustomResponse.js";

class UserService {
  async getUserStats(userId) {
    try {
      // Get user's library count
      const libraryCount = await prisma.userLibrary.count({
        where: { userId },
      });

      // Get user's purchases count
      const purchasesCount = await prisma.purchaseOrder.count({
        where: { userId },
      });

      // Get user's reviews count
      const reviewsCount = await prisma.review.count({
        where: { userId },
      });

      // Get user's total spent
      const totalSpent = await prisma.purchaseOrder.aggregate({
        where: {
          userId,
          status: "COMPLETED"
        },
        _sum: {
          amount: true
        }
      });

      return {
        libraryCount,
        purchasesCount,
        reviewsCount,
        totalSpent: totalSpent._sum.amount || 0
      };
    } catch (error) {
      console.log(error);

      throw new CustomError("Failed to fetch user statistics", 500);
    }
  }
}

export default new UserService(); 