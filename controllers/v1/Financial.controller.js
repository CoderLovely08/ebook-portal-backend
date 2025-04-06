import { APIResponse } from "../../service/core/CustomResponse.js";
import { FinancialService } from "../../service/v1/financial.service.js";

export class FinancialController {
    /**
     * Handle get financial overview
     * @description Get financial overview statistics (admin only)
     * @param {Object} req - The request object
     * @param {Object} res - The response object
     * @returns {Object} The response object
     */
    static async handleGetFinancialOverview(req, res) {
        try {
            const overview = await FinancialService.getFinancialOverview();
            return APIResponse.success(
                res,
                overview,
                "Financial overview retrieved successfully"
            );
        } catch (error) {
            return APIResponse.error(res, error.message, error.statusCode);
        }
    }

    /**
     * Handle get revenue trends
     * @description Get revenue trends for a specific time period (admin only)
     * @param {Object} req - The request object
     * @param {Object} res - The response object
     * @returns {Object} The response object
     */
    static async handleGetRevenueTrends(req, res) {
        try {
            const { startDate, endDate } = req.query;
            
            if (!startDate || !endDate) {
                return APIResponse.error(
                    res,
                    "Start date and end date are required",
                    400
                );
            }

            const trends = await FinancialService.getRevenueTrends(
                new Date(startDate),
                new Date(endDate)
            );

            return APIResponse.success(
                res,
                trends,
                "Revenue trends retrieved successfully"
            );
        } catch (error) {
            return APIResponse.error(res, error.message, error.statusCode);
        }
    }
} 