import { APIResponse } from "../../service/core/CustomResponse.js";
import { LibraryService } from "../../service/v1/library.service.js";

export class LibraryController {
  /**
   * Handle get user library
   * @description Get all books in a user's library
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @returns {Object} The response object
   */
  static async handleGetUserLibrary(req, res) {
    try {
      const userId = req.user.userId;

      const library = await LibraryService.getUserLibrary(userId);      

      return APIResponse.success(
        res,
        library,
        "User library retrieved successfully"
      );
    } catch (error) {
      return APIResponse.error(res, error.message, error.statusCode);
    }
  }

  /**
   * Handle add book to library
   * @description Add a book to a user's library
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @returns {Object} The response object
   */
  static async handleAddBookToLibrary(req, res) {
    try {
      const { bookId } = req.body;
      const userId = req.user.userId;

      const result = await LibraryService.addBookToLibrary(userId, bookId);

      return APIResponse.success(
        res,
        result,
        "Book added to library successfully"
      );
    } catch (error) {
      return APIResponse.error(res, error.message, error.statusCode);
    }
  }

  /**
   * Handle remove book from library
   * @description Remove a book from a user's library
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @returns {Object} The response object
   */
  static async handleRemoveBookFromLibrary(req, res) {
    try {
      const { bookId } = req.params;
      const userId = req.user.userId;

      await LibraryService.removeBookFromLibrary(userId, bookId);

      return APIResponse.success(
        res,
        null,
        "Book removed from library successfully"
      );
    } catch (error) {
      return APIResponse.error(res, error.message, error.statusCode);
    }
  }
}
