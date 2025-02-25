import winston from "winston";
import morgan from "morgan";
import config from "../config/app.config.js";
const APPLICATION_ENV_TYPES = Object.freeze({
  DEV: "development",
  TEST: "testing",
  PROD: "production",
});

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Create logger with dynamic configuration
export const createLogger = (env) => {
  const transports = [
    // Always have console transport
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ];

  // Add file transports for production and testing
  if (
    env === APPLICATION_ENV_TYPES.PROD ||
    env === APPLICATION_ENV_TYPES.TEST
  ) {
    transports.push(
      // Error logs
      new winston.transports.File({
        filename: "logs/error.log",
        level: "error",
        format: logFormat,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
      }),
      // Combined logs
      new winston.transports.File({
        filename: "logs/combined.log",
        format: logFormat,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
      })
    );
  }

  return winston.createLogger({
    level:
      env === APPLICATION_ENV_TYPES.PROD
        ? "error" // Only critical errors in production
        : "debug", // More verbose in dev/test
    format: logFormat,
    transports: transports,
    exceptionHandlers: [
      new winston.transports.File({
        filename: "logs/exceptions.log",
        format: logFormat,
      }),
    ],
    rejectionHandlers: [
      new winston.transports.File({
        filename: "logs/rejections.log",
        format: logFormat,
      }),
    ],
  });
};

// Production-specific request logging middleware
export const createRequestLogger = (env, logger) => {
  // Different logging formats based on environment
  if (env === APPLICATION_ENV_TYPES.PROD) {
    return morgan("combined", {
      stream: {
        write: (message) => logger.info(message.trim()),
      },
      skip: (req, res) => res.statusCode < 400, // Only log errors in production
    });
  }

  // More detailed logging for dev/test
  return morgan("dev");
};

// Enhanced error logging middleware
export const errorLoggingMiddleware = (logger) => (error, req, res, next) => {
  // Log the full error details
  logger.error("Unhandled Error", {
    message: error.message,
    stack: error.stack,
    method: req.method,
    path: req.path,
    body: req.body,
    query: req.query,
    user: req.user?.id, // If authentication middleware is used
  });

  // Respond with minimal information in production
  res.status(error.status || 500).json({
    success: false,
    message:
      config.NODE_ENV === APPLICATION_ENV_TYPES.PROD
        ? "An unexpected error occurred"
        : error.message,
  });
};

// Security and Performance Logging
export const securityLoggingMiddleware = (logger) => (req, res, next) => {
  // Log potential security events
  const ipAddress = req.ip;
  const userAgent = req.get("User-Agent");

  // Log suspicious activities
  if (
    req.headers["x-forwarded-for"] &&
    req.headers["x-forwarded-for"].split(",").length > 1
  ) {
    logger.warn("Potential IP Spoofing Attempt", {
      ip: ipAddress,
      forwardedIps: req.headers["x-forwarded-for"],
    });
  }

  // Log unusual user agents or request patterns
  if (
    userAgent &&
    userAgent.includes("python") &&
    config.ENV === APPLICATION_ENV_TYPES.PROD
  ) {
    logger.warn("Unusual User Agent", {
      ip: ipAddress,
      userAgent: userAgent,
    });
  }

  next();
};

// Custom logger for testing
const createCustomLogger = () => {
  const transport = new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  });

  const fileTransport = new winston.transports.File({
    filename: "logs/customError.log",
    level: "error",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  });

  return winston.createLogger({
    level: "info",
    format: winston.format.combine(winston.format.timestamp(), logFormat),
    transports: [transport, fileTransport],
  });
};

export const customLogger = createCustomLogger();