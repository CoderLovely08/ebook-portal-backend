import { APIResponse } from "../../service/core/CustomResponse.js";
import { CategoryService } from "../../service/v1/category.service.js";

export class CategoryController {
  /**
   * Handle get all categories
   * @description Get all categories
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @returns {Object} The response object
   */
  static async handleGetAllCategories(req, res) {
    try {
      const categories = await CategoryService.getAllCategories();

      return APIResponse.success(res, categories, "Categories retrieved successfully");
    } catch (error) {
      return APIResponse.error(res, error.message, error.statusCode);
    }
  }

  /**
   * Handle get category by id
   * @description Get a category by id
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @returns {Object} The response object
   */
  static async handleGetCategoryById(req, res) {
    try {
      const { id } = req.params;
      
      const category = await CategoryService.getCategoryById(id);

      return APIResponse.success(res, category, "Category retrieved successfully");
    } catch (error) {
      return APIResponse.error(res, error.message, error.statusCode);
    }
  }

  /**
   * Handle get books by category
   * @description Get all books by category id
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @returns {Object} The response object
   */
  static async handleGetBooksByCategory(req, res) {
    try {
      const { id } = req.params;
      const { limit, page } = req.query;
      
      const books = await CategoryService.getBooksByCategory(id, {
        limit: limit ? parseInt(limit) : 10,
        page: page ? parseInt(page) : 1,
      });

      return APIResponse.success(res, books, "Books retrieved successfully");
    } catch (error) {
      return APIResponse.error(res, error.message, error.statusCode);
    }
  }

  /**
   * Handle create category
   * @description Create a new category
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @returns {Object} The response object
   */
  static async handleCreateCategory(req, res) {
    try {
      const { name, description } = req.body;
      
      const category = await CategoryService.createCategory({
        name,
        description,
      });

      return APIResponse.success(res, category, "Category created successfully");
    } catch (error) {
      return APIResponse.error(res, error.message, error.statusCode);
    }
  }

  /**
   * Handle update category
   * @description Update a category
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @returns {Object} The response object
   */
  static async handleUpdateCategory(req, res) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      
      const category = await CategoryService.updateCategory(id, {
        name,
        description,
      });

      return APIResponse.success(res, category, "Category updated successfully");
    } catch (error) {
      return APIResponse.error(res, error.message, error.statusCode);
    }
  }

  /**
   * Handle delete category
   * @description Delete a category
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @returns {Object} The response object
   */
  static async handleDeleteCategory(req, res) {
    try {
      const { id } = req.params;
      
      await CategoryService.deleteCategory(id);

      return APIResponse.success(res, null, "Category deleted successfully");
    } catch (error) {
      return APIResponse.error(res, error.message, error.statusCode);
    }
  }
} 