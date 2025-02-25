/**
 * @description Custom Error class
 * @class CustomError
 */
export class CustomError extends Error {
  /**
   * @description Constructor
   * @param {string} message - Message
   * @param {number} statusCode - Status code
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

/**
 * @description API Response class
 * @class APIResponse
 */
export class APIResponse {
  /**
   * @description Success response
   * @param {Object} res - Response object
   * @param {Object} data - Data to send in response
   * @param {string} message - Message to send in response
   * @param {number} statusCode - Status code
   * @returns {Object} Response object
   */
  static success(res, data, message, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      data,
      message,
    });
  }

  /**
   * @description Error response
   * @param {Object} res - Response object
   * @param {string} message - Message to send in response
   * @param {number} statusCode - Status code
   * @returns {Object} Response object
   */
  static error(res, message = "Internal Server Error", statusCode = 500) {
    return res.status(statusCode).json({
      success: false,
      message,
    });
  }
}
