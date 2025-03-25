import { APIResponse } from "../../service/core/CustomResponse.js";
import { PurchaseService } from "../../service/v1/purchase.service.js";

export class PurchaseController {
  /**
   * Handle get user purchases
   * @description Get all purchases for the current user
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @returns {Object} The response object
   */
  static async handleGetUserPurchases(req, res) {
    try {
      const userId = req.user.userId;

      const purchases = await PurchaseService.getUserPurchases(userId);

      return APIResponse.success(
        res,
        purchases,
        "Purchases retrieved successfully"
      );
    } catch (error) {
      return APIResponse.error(res, error.message, error.statusCode);
    }
  }

  /**
   * Handle get purchase by id
   * @description Get a purchase by id
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @returns {Object} The response object
   */
  static async handleGetPurchaseById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      const purchase = await PurchaseService.getPurchaseById(id, userId);

      return APIResponse.success(
        res,
        purchase,
        "Purchase retrieved successfully"
      );
    } catch (error) {
      return APIResponse.error(res, error.message, error.statusCode);
    }
  }

  /**
   * Handle create purchase
   * @description Create a new purchase
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @returns {Object} The response object
   */
  static async handleCreatePurchase(req, res) {
    try {
      const { bookId } = req.body;
      const userId = req.user.userId;

      const purchase = await PurchaseService.createPurchase(userId, bookId);

      return APIResponse.success(
        res,
        purchase,
        "Purchase created successfully"
      );
    } catch (error) {
      return APIResponse.error(res, error.message, error.statusCode);
    }
  }

  /**
   * Handle update purchase status
   * @description Update a purchase status (admin only)
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @returns {Object} The response object
   */
  static async handleUpdatePurchaseStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const purchase = await PurchaseService.updatePurchaseStatus(id, status);

      return APIResponse.success(
        res,
        purchase,
        "Purchase status updated successfully"
      );
    } catch (error) {
      return APIResponse.error(res, error.message, error.statusCode);
    }
  }
}
