import { Router } from "express";
import { LibraryController } from "../../controllers/v1/Library.controller.js";
import { higherOrderUserDataValidation } from "../../middlewares/validation.middleware.js";
import { ValidationSchema } from "../../schema/validation.schema.js";

const router = Router();

/**
 * Get all books in user's library
 * Route: /api/v1/library
 */
router.get("/", LibraryController.handleGetUserLibrary);

/**
 * Add a book to user's library
 * Route: /api/v1/library
 * Body: bookId
 */
router.post(
  "/",

  higherOrderUserDataValidation(ValidationSchema.addToLibrarySchema),
  LibraryController.handleAddBookToLibrary
);

/**
 * Remove a book from user's library
 * Route: /api/v1/library/:bookId
 * Params: bookId
 */
router.delete(
  "/:bookId",

  LibraryController.handleRemoveBookFromLibrary
);

export default router;
