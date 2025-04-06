import { prisma } from "../../app.js";
import { CustomError } from "../core/CustomResponse.js";
import { PRISMA_ERROR_CODES } from "../../utils/constants/app.constant.js";
import { SupabaseService } from "../common/Supabase.service.js";

export class BookService {
  /**
   * Get all books
   * @param {Object} options - The options object
   * @param {string} options.category - The category to filter by
   * @param {boolean} options.isFree - Filter by free books
   * @param {string} options.search - Search term for title or author
   * @param {string} options.sort - Sort field and direction (e.g. "title:asc")
   * @param {number} options.limit - Number of books to return
   * @param {number} options.page - Page number for pagination
   * @returns {Promise<Array>} The books
   */
  static async getAllBooks({
    category,
    type,
    search,
    sort,
    limit = 10,
    page = 1,
  }) {
    console.log(category, type, search, sort, limit, page);

    try {
      const skip = (page - 1) * limit;

      // Build the where clause
      const where = {};

      if (type !== undefined) {
        where.isFree = type
      }

      if (search) {
        where.OR = [
          { title: { contains: search, mode: "insensitive" } },
          { author: { contains: search, mode: "insensitive" } },
        ];
      }

      // Handle category filter through the join table
      if (category) {
        where.categories = {
          some: {
            category: {
              name: {
                contains: category,
                mode: "insensitive",
              },
            },
          },
        };
      }

      // Build the orderBy clause
      let orderBy = { createdAt: "desc" };

      if (sort) {
        const [field, direction] = sort.split(":");
        if (field && direction) {
          orderBy = { [field]: direction.toLowerCase() };
        }
      }

      // Fetch books with their categories
      const books = await prisma.book.findMany({
        where,
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
        orderBy,
        skip,
        take: limit,
      });

      // Transform the data to simplify the response
      const formattedBooks = books.map((book) => {
        // Calculate average rating
        const avgRating =
          book.reviews.length > 0
            ? book.reviews.reduce((sum, review) => sum + review.rating, 0) /
              book.reviews.length
            : 0;

        // Extract category names
        const categories = book.categories.map((c) => c.category);

        return {
          ...book,
          categories,
          avgRating,
          reviewCount: book.reviews.length,
          reviews: undefined, // Remove the raw reviews data
        };
      });

      // Count total books for pagination
      const total = await prisma.book.count({ where });

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
      throw new CustomError(`Error fetching books: ${error.message}`);
    }
  }

  /**
   * Get book by id
   * @param {string} id - The book id
   * @returns {Promise<Object>} The book
   */
  static async getBookById(id) {
    try {
      const book = await prisma.book.findUnique({
        where: { id },
        include: {
          categories: {
            include: {
              category: true,
            },
          },
          reviews: {
            include: {
              user: {
                select: {
                  id: true,
                  fullName: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      if (!book) {
        throw new CustomError("Book not found", 404);
      }

      // Calculate average rating
      const avgRating =
        book.reviews.length > 0
          ? book.reviews.reduce((sum, review) => sum + review.rating, 0) /
            book.reviews.length
          : 0;

      // Extract category names
      const categories = book.categories.map((c) => c.category);

      return {
        ...book,
        categories,
        avgRating,
        reviewCount: book.reviews.length,
      };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(`Error fetching book: ${error.message}`);
    }
  }

  /**
   * Create a book
   * @param {Object} bookData - The book data
   * @returns {Promise<Object>} The created book
   */
  static async createBook(bookData) {
    try {
      const { categories, ...restBookData } = bookData;

      // Demo categories
      const demoCategories = [
        "c1388601-cfa9-46e7-b24c-5ac7d573d1d8",
        "c3359d3e-bbeb-4843-9e7f-a48825948689",
      ];

      return await prisma.$transaction(async (tx) => {
        // Create the book
        const book = await tx.book.create({
          data: {
            ...restBookData,
          },
        });

        // Add categories if provided
        if (demoCategories && demoCategories.length > 0) {
          for (const categoryId of demoCategories) {
            await tx.categoriesOnBooks.create({
              data: {
                bookId: book.id,
                categoryId,
              },
            });
          }
        }

        // Return the created book with categories
        return await tx.book.findUnique({
          where: { id: book.id },
          include: {
            categories: {
              include: {
                category: true,
              },
            },
          },
        });
      });
    } catch (error) {
      if (error.code === PRISMA_ERROR_CODES.P2025.code) {
        throw new CustomError("One or more categories not found", 400);
      }

      throw new CustomError(`Error creating book: ${error.message}`);
    }
  }

  /**
   * Update a book
   * @param {string} id - The book id
   * @param {Object} bookData - The book data to update
   * @returns {Promise<Object>} The updated book
   */
  static async updateBook(id, bookData) {
    try {
      const { categories, ...restBookData } = bookData;

      // Remove undefined fields
      Object.keys(restBookData).forEach((key) => {
        if (restBookData[key] === undefined) {
          delete restBookData[key];
        }
      });

      return await prisma.$transaction(async (tx) => {
        // Check if book exists
        const existingBook = await tx.book.findUnique({
          where: { id },
        });

        if (!existingBook) {
          throw new CustomError("Book not found", 404);
        }

        // Update the book
        const updatedBook = await tx.book.update({
          where: { id },
          data: restBookData,
        });

        // Update categories if provided
        if (categories && categories.length > 0) {
          // Delete existing categories
          await tx.categoriesOnBooks.deleteMany({
            where: { bookId: id },
          });

          // Add new categories
          for (const categoryId of categories) {
            await tx.categoriesOnBooks.create({
              data: {
                bookId: id,
                categoryId,
              },
            });
          }
        }

        // Return the updated book with categories
        return await tx.book.findUnique({
          where: { id },
          include: {
            categories: {
              include: {
                category: true,
              },
            },
          },
        });
      });
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }

      if (error.code === PRISMA_ERROR_CODES.P2025.code) {
        throw new CustomError("Book or one or more categories not found", 400);
      }

      throw new CustomError(`Error updating book: ${error.message}`);
    }
  }

  /**
   * Delete a book
   * @param {string} id - The book id
   * @returns {Promise<void>}
   */
  static async deleteBook(id) {
    try {
      // Check if book exists
      const existingBook = await prisma.book.findUnique({
        where: { id },
      });

      if (!existingBook) {
        throw new CustomError("Book not found", 404);
      }

      // Delete the book (cascades will handle related records)
      await prisma.book.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }

      throw new CustomError(`Error deleting book: ${error.message}`);
    }
  }

  /**
   * Update a book cover image
   * @param {string} id - The book id
   * @param {Object} coverImage - The cover image
   * @returns {Promise<Object>} The updated book
   */
  static async updateBookCoverImage(id, coverImage) {
    try {
      const book = await prisma.book.findUnique({
        where: { id },
      });

      if (!book) {
        throw new CustomError("Book not found", 404);
      }

      // Delete the existing cover image
      if (book.coverImage) {
        await SupabaseService.supabaseDeleteFile(book.coverImage);
      }

      const updatedBook = await prisma.book.update({
        where: { id },
        data: { coverImage },
      });

      return updatedBook;
    } catch (error) {
      throw new CustomError(
        `Error updating book cover image: ${error.message}`
      );
    }
  }

  /**
   * Update a book file path
   * @param {string} id - The book id
   * @param {Object} filePath - The file path
   * @returns {Promise<Object>} The updated book
   */
  static async updateBookFilePath(id, filePath) {
    try {
      const book = await prisma.book.findUnique({
        where: { id },
      });

      if (!book) {
        throw new CustomError("Book not found", 404);
      }

      // Delete the existing file path
      if (book.filePath) {
        await SupabaseService.supabaseDeleteFile(book.filePath);
      }

      const updatedBook = await prisma.book.update({
        where: { id },
        data: { filePath },
      });

      return updatedBook;
    } catch (error) {
      throw new CustomError(`Error updating book file path: ${error.message}`);
    }
  }
}
