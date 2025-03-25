import { Router } from "express";
import { BookController } from "../../controllers/v1/Book.controller.js";
import { higherOrderUserDataValidation } from "../../middlewares/validation.middleware.js";
import { ValidationSchema } from "../../schema/validation.schema.js";
import { checkRole, validateToken } from "../../middlewares/auth.middleware.js";
import { USER_ROLES } from "../../utils/constants/app.constant.js";
import upload from "../../config/multer.config.js";
import { CommonController } from "../../controllers/common/Common.controller.js";

const router = Router();

/**
 * Get all books with optional filters
 * Route: /api/v1/books
 * Query params: category, isFree, search, sort, limit, page
 */
router.get("/", BookController.handleGetAllBooks);

/**
 * Get book by id
 * Route: /api/v1/books/:id
 * Params: id
 */
router.get("/:id", BookController.handleGetBookById);

/**
 * Create a new book (Admin only)
 * Route: /api/v1/books
 * Body: title, author, description, coverImage, filePath, price, categories, etc.
 */
router.post(
  "/",
  validateToken,
  checkRole([USER_ROLES.ADMIN]),
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "filePath", maxCount: 1 },
  ]),
  higherOrderUserDataValidation(ValidationSchema.createBookSchema),
  CommonController.handleUploadFile("coverImage"),
  CommonController.handleUploadFile("filePath"),
  BookController.handleCreateBook
);

/**
 * Update a book (Admin only)
 * Route: /api/v1/books/:id
 * Params: id
 * Body: title, author, description, coverImage, filePath, price, categories, etc.
 */
router.put(
  "/:id",
  validateToken,
  checkRole([USER_ROLES.ADMIN]),
  higherOrderUserDataValidation(ValidationSchema.updateBookSchema),
  BookController.handleUpdateBook
);

router.put(
  "/:id/cover-image",
  validateToken,
  checkRole([USER_ROLES.ADMIN]),
  upload.single("coverImage"),
  CommonController.handleUploadFile("coverImage"),
  BookController.handleUpdateBookCoverImage
);

/**
 * Delete a book (Admin only)
 * Route: /api/v1/books/:id
 * Params: id
 */
router.delete(
  "/:id",
  validateToken,
  checkRole([USER_ROLES.ADMIN]),
  BookController.handleDeleteBook
);

export default router;
