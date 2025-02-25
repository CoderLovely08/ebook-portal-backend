// Application Environment Types
export const APPLICATION_ENV_TYPES = Object.freeze({
  DEV: "development",
  TEST: "testing",
  PROD: "production",
});

// User Types
export const USER_TYPES = Object.freeze({
  SUPER_ADMIN: "SuperAdmin",
  ADMIN: "Admin",
  USER: "User",
});

// Token Types
export const TOKEN_TYPES = {
  ACCESS: "accessToken",
  REFRESH: "refreshToken",
};

// Server Responses
export const serverResponses = Object.freeze({
  INTERNAL_SERVER_ERROR: {
    message: "Internal server Error",
    status: 500,
  },
  BAD_REQUEST: {
    message: "Bad Request",
    status: 400,
  },
  NOT_FOUND: {
    message: "Not Found",
    status: 404,
  },
  FORBIDDEN: {
    message: "Forbidden",
    status: 403,
  },
  UNAUTHORIZED: {
    message: "Unauthorized",
    status: 401,
  },
  SUCCESS: {
    message: "Success",
    status: 200,
  },
  CREATED: {
    message: "Created",
    status: 201,
  },
  ACCEPTED: {
    message: "Accepted",
    status: 202,
  },
  NO_CONTENT: {
    message: "No Content",
    status: 204,
  },
  BAD_GATEWAY: {
    message: "Bad Gateway",
    status: 502,
  },
  SERVICE_UNAVAILABLE: {
    message: "Service Unavailable",
    status: 503,
  },
  GATEWAY_TIMEOUT: {
    message: "Gateway Timeout",
    status: 504,
  },
});

// Validation Types
export const VALIDATION_TYPES = Object.freeze({
  EMAIL: "email",
  PASSWORD: "passsword",
  PURE_NAME: "pure_name",
  ALPHA_NAME: "alpha_name",
  PHONE: "phone",
  JSON: "json",
  INTEGER: "integer",
  NUMBER: "number",
  STRING: "string",
  ARRAY: "array",
  DATETIME: "datetime",
  CUSTOM: "custom",
  OBJECT: "object",
  BOOLEAN: "boolean",
});

// Notification Channels
export const NOTIFICATION_CHANNEL = Object.freeze({
  EMAIL: "email",
  SMS: "sms",
  PUSH: "push",
  WHATSAPP: "whatsapp",
});

// Multer Config Types
export const MULTER_CONFIG_TYPES = {
  MEMORY: "memory",
  DISK: "disk",
};
