import { prisma } from "../../app.js";
import { CustomError } from "../core/CustomResponse.js";
import { PRISMA_ERROR_CODES } from "../../utils/constants/app.constant.js";

export class CategoryService {
  /**
   * Get all categories
   * @returns {Promise<Array>} The categories
   */
  static async getAllCategories() {
    try {
      const categories = await prisma.category.findMany({
        orderBy: {
          name: 'asc',
        },
      });

      return categories;
    } catch (error) {
      throw new CustomError(`Error fetching categories: ${error.message}`);
    }
  }

  /**
   * Get category by id
   * @param {string} id - The category id
   * @returns {Promise<Object>} The category
   */
  static async getCategoryById(id) {
    try {
      const category = await prisma.category.findUnique({
        where: { id },
      });

      if (!category) {
        throw new CustomError("Category not found", 404);
      }

      return category;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(`Error fetching category: ${error.message}`);
    }
  }

  /**
   * Get books by category
   * @param {string} categoryId - The category id
   * @param {Object} options - The options object
   * @param {number} options.limit - Number of books to return
   * @param {number} options.page - Page number for pagination
   * @returns {Promise<Object>} The books with pagination info
   */
  static async getBooksByCategory(categoryId, { limit = 10, page = 1 }) {
    try {
      // Check if category exists
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        throw new CustomError("Category not found", 404);
      }

      const skip = (page - 1) * limit;

      // Get books by category through the join table
      const books = await prisma.book.findMany({
        where: {
          categories: {
            some: {
              categoryId,
            },
          },
        },
        include: {
          categories: {
            include: {
              category: true,
            },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      });

      // Transform the data to simplify the response
      const formattedBooks = books.map(book => {
        // Calculate average rating
        const avgRating = book.reviews.length > 0
          ? book.reviews.reduce((sum, review) => sum + review.rating, 0) / book.reviews.length
          : 0;
          
        // Extract category names
        const categories = book.categories.map(c => c.category);
        
        return {
          ...book,
          categories,
          avgRating,
          reviewCount: book.reviews.length,
          reviews: undefined, // Remove the raw reviews data
        };
      });

      // Count total books for pagination
      const total = await prisma.book.count({
        where: {
          categories: {
            some: {
              categoryId,
            },
          },
        },
      });
      
      return {
        data: formattedBooks,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(`Error fetching books by category: ${error.message}`);
    }
  }

  /**
   * Create a category
   * @param {Object} categoryData - The category data
   * @param {string} categoryData.name - The category name
   * @param {string} categoryData.description - The category description
   * @returns {Promise<Object>} The created category
   */
  static async createCategory(categoryData) {
    try {
      const category = await prisma.category.create({
        data: categoryData,
      });

      return category;
    } catch (error) {
      if (error.code === PRISMA_ERROR_CODES.P2002.code) {
        throw new CustomError("Category with this name already exists", 400);
      }
      
      throw new CustomError(`Error creating category: ${error.message}`);
    }
  }

  /**
   * Update a category
   * @param {string} id - The category id
   * @param {Object} categoryData - The category data to update
   * @param {string} categoryData.name - The category name
   * @param {string} categoryData.description - The category description
   * @returns {Promise<Object>} The updated category
   */
  static async updateCategory(id, categoryData) {
    try {
      // Remove undefined fields
      Object.keys(categoryData).forEach(key => {
        if (categoryData[key] === undefined) {
          delete categoryData[key];
        }
      });

      // Check if category exists
      const category = await prisma.category.findUnique({
        where: { id },
      });

      if (!category) {
        throw new CustomError("Category not found", 404);
      }

      // Update the category
      const updatedCategory = await prisma.category.update({
        where: { id },
        data: categoryData,
      });

      return updatedCategory;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }

      if (error.code === PRISMA_ERROR_CODES.P2002.code) {
        throw new CustomError("Category with this name already exists", 400);
      }
      
      throw new CustomError(`Error updating category: ${error.message}`);
    }
  }

  /**
   * Delete a category
   * @param {string} id - The category id
   * @returns {Promise<void>}
   */
  static async deleteCategory(id) {
    try {
      // Check if category exists
      const category = await prisma.category.findUnique({
        where: { id },
      });

      if (!category) {
        throw new CustomError("Category not found", 404);
      }

      // Delete the category
      await prisma.category.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      
      throw new CustomError(`Error deleting category: ${error.message}`);
    }
  }
} 