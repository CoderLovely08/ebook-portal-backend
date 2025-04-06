import { APIResponse, CustomError } from "../../service/core/CustomResponse.js";
import { BookService } from "../../service/v1/book.service.js";

export class BookController {
  /**
   * Handle get all books
   * @description Get all books with optional filters
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @returns {Object} The response object
   */
  static async handleGetAllBooks(req, res) {
    try {
      const { category, type, search, sort, limit, page } = req.query;

      const books = await BookService.getAllBooks({
        category: category === "all" ? undefined : category,
        type: type === "free" ? true : type === "paid" ? false : undefined,
        search,
        sort,
        limit: limit ? parseInt(limit) : 10,
        page: page ? parseInt(page) : 1,
      });

      return APIResponse.success(res, books, "Books retrieved successfully");
    } catch (error) {
      return APIResponse.error(res, error.message, error.statusCode);
    }
  }

  /**
   * Handle get book by id
   * @description Get a book by id
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @returns {Object} The response object
   */
  static async handleGetBookById(req, res) {
    try {
      const { id } = req.params;

      const book = await BookService.getBookById(id);

      return APIResponse.success(res, book, "Book retrieved successfully");
    } catch (error) {
      return APIResponse.error(res, error.message, error.statusCode);
    }
  }

  /**
   * Handle create book
   * @description Create a new book
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @returns {Object} The response object
   */
  static async handleCreateBook(req, res) {
    try {
      const {
        title,
        author,
        description,
        price,
        isFree,
        publishedDate,
        categories,
      } = req.body;

      const coverImage = req.files?.coverImage;
      const filePath = req.files?.filePath;

      const isBookFree = isFree === "true";
      const bookPrice = parseFloat(price);
      if (!isBookFree && bookPrice <= 0) {
        throw new CustomError("Price must be greater than 0", 400);
      }

      const book = await BookService.createBook({
        title,
        author,
        description,
        coverImage: coverImage.fileUrl,
        filePath: filePath.fileUrl,
        price: parseFloat(price),
        isFree: isBookFree,
        publishedDate: new Date(publishedDate),
        categories,
      });

      return APIResponse.success(res, book, "Book created successfully");
    } catch (error) {
      return APIResponse.error(res, error.message, error.statusCode);
    }
  }

  /**
   * Handle update book
   * @description Update a book
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @returns {Object} The response object
   */
  static async handleUpdateBook(req, res) {
    try {
      const { id } = req.params;
      const {
        title,
        author,
        description,
        price,
        isFree,
        publishedDate,
        categories,
      } = req.body;

      const book = await BookService.updateBook(id, {
        title,
        author,
        description,
        price: price ? parseFloat(price) : undefined,
        isFree: isFree !== undefined ? Boolean(isFree) : undefined,
        publishedDate: publishedDate ? new Date(publishedDate) : undefined,
        categories,
      });

      return APIResponse.success(res, book, "Book updated successfully");
    } catch (error) {
      return APIResponse.error(res, error.message, error.statusCode);
    }
  }

  /**
   * Handle delete book
   * @description Delete a book
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @returns {Object} The response object
   */
  static async handleDeleteBook(req, res) {
    try {
      const { id } = req.params;

      await BookService.deleteBook(id);

      return APIResponse.success(res, null, "Book deleted successfully");
    } catch (error) {
      return APIResponse.error(res, error.message, error.statusCode);
    }
  }

  /**
   * Handle update book cover image
   * @description Update a book cover image
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @returns {Object} The response object
   */
  static async handleUpdateBookCoverImage(req, res) {
    try {
      const { id } = req.params;
      const { coverImage } = req.files;

      const book = await BookService.updateBookCoverImage(
        id,
        coverImage.fileUrl
      );

      return APIResponse.success(
        res,
        book,
        "Book cover image updated successfully"
      );
    } catch (error) {
      return APIResponse.error(res, error.message, error.statusCode);
    }
  }

  /**
   * Handle update book file path
   * @description Update a book file path
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @returns {Object} The response object
   */
  static async handleUpdateBookFilePath(req, res) {
    try {
      const { id } = req.params;
      const { filePath } = req.files;

      const book = await BookService.updateBookFilePath(id, filePath.fileUrl);

      return APIResponse.success(
        res,
        book,
        "Book file path updated successfully"
      );
    } catch (error) {
      return APIResponse.error(res, error.message, error.statusCode);
    }
  }
}
