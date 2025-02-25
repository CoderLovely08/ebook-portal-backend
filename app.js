import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

import { PrismaClient } from "@prisma/client";
import {
  createLogger,
  createRequestLogger,
  errorLoggingMiddleware,
  securityLoggingMiddleware,
} from "./middlewares/logging.middleware.js";

// Import routes
import v1Routes from "./routes/v1/index.js";
import { APPLICATION_ENV_TYPES } from "./utils/constants/app.constant.js";
import config from "./config/app.config.js";

// Initialize Prisma client
export const prisma = new PrismaClient({
  log:
    config.ENV === APPLICATION_ENV_TYPES.DEV
      ? ["query", "error", "warn"]
      : ["error"],
});

// Create environment-specific logger
const logger = createLogger(config.ENV);
const app = express();

const limiter = rateLimit(config.rateLimit);


// Environment-specific request logging
app.use(createRequestLogger(config.ENV, logger));

// Security and Performance Logging
app.use(securityLoggingMiddleware(logger));

// Custom logging middleware
app.use((req, res, next) => {
  req.logger = logger;
  next();
});

// Middleware
app.use(
  helmet({
    contentSecurityPolicy:
      config.ENV === APPLICATION_ENV_TYPES.PROD
        ? {
            /* strict CSP configuration */
          }
        : false,
  })
);
app.use(compression());
app.use(cors(config.cors));
app.use(
  express.json({
    limit: "1mb",
    strict: true,
  })
);
app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  })
);
app.use(limiter);
app.use(cookieParser());

// Startup Logging
logger.info("Application Starting", {
  environment: config.ENV,
  version: config.API_VERSION,
  timestamp: new Date().toISOString(),
});

// Routes
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: `Welcome to the API! 🚀`,
    environment: config.ENV,
    version: config.API_VERSION,
  });
});

// Auth Routes
app.use("/api/v1", v1Routes);

// Handle unhandled routes
app.use((req, res) => {
  logger.warn("Route Not Found", {
    method: req.method,
    path: req.path,
  });
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.url}`,
    error: "Not Found",
  });
});

// Enhanced Error Handler
app.use(errorLoggingMiddleware(logger));

// Server Startup
const startServer = async () => {
  try {
    app.listen(config.PORT, () => {
      logger.info(`Server Started, http://localhost:${config.PORT}`, {
        port: config.PORT,
        environment: config.ENV,
      });
    });
  } catch (error) {
    logger.error("Server Startup Failed", {
      message: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
};

startServer();
