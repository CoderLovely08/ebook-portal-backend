import { SupabaseService } from "../../service/common/Supabase.service.js";
import { APIResponse, CustomError } from "../../service/core/CustomResponse.js";

export class CommonController {
  /**
   * @description Upload a file to Supabase Storage
   * @param {string} fieldName - The name of the field to upload
   * @returns {Function} Middleware function
   */
  static handleUploadFile(fieldName) {
    return async (req, res, next) => {
      try {
        console.log(fieldName);

        const fileItem = req.files[fieldName];

        if (!fileItem) {
          throw new CustomError(`${fieldName} file is required`, 400);
        }

        const file = fileItem[0];

        const originalFileName = file.originalname;
        const fileBuffer = file.buffer;
        const fileType = file.mimetype;

        const uploadedFile = await SupabaseService.supabaseUploadFile(
          originalFileName,
          fileBuffer,
          fileType
        );

        // Store uploaded file path in req.files
        if (!req.files) req.files = {};
        req.files[fieldName] = uploadedFile;

        next();
      } catch (error) {
        return APIResponse.error(res, error.message, error.statusCode);
      }
    };
  }
}
