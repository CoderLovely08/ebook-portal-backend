import { APIResponse } from "../../service/core/CustomResponse.js";
import userService from "../../service/v1/user.service.js";

class UserController {
  async getUserStats(req, res) {
    try {
      const userId = req.user.id;
      const stats = await userService.getUserStats(userId);
      return APIResponse.success(res, stats, "User statistics fetched successfully");
    } catch (error) {
      return APIResponse.error(res, error.message, error.status || 500);
    }
  }
}

export default new UserController(); 