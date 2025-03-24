import { Router } from "express";
import authRoutes from "./auth.routes.js";
import booksRoutes from "./books.routes.js";
import categoriesRoutes from "./categories.routes.js";
import purchasesRoutes from "./purchases.routes.js";
import libraryRoutes from "./library.routes.js";
import reviewsRoutes from "./reviews.routes.js";
import adminRoutes from "./admin.routes.js";
import { checkRole, validateToken } from "../../middlewares/auth.middleware.js";
import { USER_ROLES } from "../../utils/constants/app.constant.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/books", booksRoutes);
router.use("/categories", categoriesRoutes);
router.use("/purchases", purchasesRoutes);
router.use("/library", libraryRoutes);
router.use("/reviews", reviewsRoutes);
router.use("/admin", validateToken, checkRole([USER_ROLES.ADMIN]), adminRoutes);

export default router;
