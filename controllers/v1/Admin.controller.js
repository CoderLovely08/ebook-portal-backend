import { APIResponse } from "../../service/core/CustomResponse.js";
import { AdminService } from "../../service/v1/admin.service.js";

export class AdminController {
  /**
   * Handle get all users
   * @description Get all users (admin only)
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @returns {Object} The response object
   */
  static async handleGetAllUsers(req, res) {
    try {
      const { page, limit, search } = req.query;
      
      const users = await AdminService.getAllUsers({
        search,
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 10,
      });

      return APIResponse.success(res, users, "Users retrieved successfully");
    } catch (error) {
      return APIResponse.error(res, error.message, error.statusCode);
    }
  }

  /**
   * Handle get all purchases
   * @description Get all purchases (admin only)
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @returns {Object} The response object
   */
  static async handleGetAllPurchases(req, res) {
    try {
      const { page, limit, status } = req.query;
      
      const purchases = await AdminService.getAllPurchases({
        status,
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 10,
      });

      return APIResponse.success(res, purchases, "Purchases retrieved successfully");
    } catch (error) {
      return APIResponse.error(res, error.message, error.statusCode);
    }
  }

  /**
   * Handle get stats
   * @description Get dashboard stats (admin only)
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @returns {Object} The response object
   */
  static async handleGetStats(req, res) {
    try {
      const stats = await AdminService.getDashboardStats();

      return APIResponse.success(res, stats, "Stats retrieved successfully");
    } catch (error) {
      return APIResponse.error(res, error.message, error.statusCode);
    }
  }
} 