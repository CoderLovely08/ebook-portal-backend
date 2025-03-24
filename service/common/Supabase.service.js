// services/supabase.service.js

import config from "../../config/app.config.js";
import { supabaseClient } from "../../config/supabase.config.js";
import { getFilePathFromUrl } from "../../utils/helpers/app.helpers.js";
import { CustomError } from "../core/CustomResponse.js";

export class SupabaseService {
  /**
   * Uploads a file to Supabase Storage
   * @param {string} originalFileName - The original name of the file
   * @param {Buffer} fileBuffer - The file content as a buffer
   * @param {string} fileType - The type of the file (e.g., 'image/jpeg')
   * @param {string} folderName - The name of the folder to store the file in
   * @returns {Object|Error|boolean} - Returns uploaded data if successful, error object if failed, or false if an exception occurred
   */
  static async supabaseUploadFile(
    originalFileName,
    fileBuffer,
    fileType,
    folderName = config.SUPABASE.FOLDER_NAME
  ) {
    try {
      // Get the file extension
      const fileExtension = originalFileName.split(".").pop();

      // Generate a random filename
      const randomFileName = `${originalFileName
        .split(".")[0]
        .replaceAll(" ", "_")}_${Date.now()}.${fileExtension}`;

      const filePath = `${folderName}/${randomFileName}`; // Specify the path of the file in the bucket

      // Upload file to Supabase Storage
      const { data, error } = await supabaseClient.storage
        .from(config.SUPABASE.BUCKET_NAME) // Access the specified bucket
        .upload(`${filePath}`, fileBuffer, {
          // Upload the file
          contentType: fileType, // Specify content type of the file
        });

      // Construct the file URL
      const fileUrl = `${config.SUPABASE.URL}/storage/v1/object/public/${config.SUPABASE.BUCKET_NAME}${filePath}`;

      // Check if upload was successful
      if (data) {
        return {
          fileSrc: filePath,
          fileUrl,
          fileName: randomFileName,
        }; // Return uploaded data
      } else {
        throw new CustomError(`Error uploading file: ${error.message}`, 500);
      }
    } catch (error) {
      throw new CustomError(`Error uploading file: ${error.message}`, 500);
    }
  }

  /**
   * Retrieves a file from Supabase Storage
   * @param {string} fileName - The name of the file to retrieve
   * @returns {Object} - Returns the public URL of the file if successful, or error object if failed
   */
  static async supabaseGetFile(fileUrl) {
    try {
      const fileSrc = getFilePathFromUrl(fileUrl); // Get the file path from the URL

      // Extract the folder name and file name from the fileSrc
      const folderName = fileSrc.split("/")[0];
      const fileName = fileSrc.split("/")[1];
      // Retrieve public URL of the file from Supabase Storage
      const { data } = supabaseClient.storage
        .from(config.SUPABASE.BUCKET_NAME) // Access the specified bucket
        .getPublicUrl(`${folderName}/${fileName}`); // Get the public URL of the file

      return {
        success: true,
        message: "File fetched",
        publicUrl: data.publicUrl,
      };
    } catch (error) {
      throw new CustomError(`Error in supabaseGetFile: ${error.message}`, 500);
    }
  }

  /**
   * Deletes a file from Supabase Storage
   * @param {string} fileUrl - The URL of the file to delete
   * @returns {Object} - Returns success message if successful, or error object if failed
   */
  static async supabaseDeleteFile(fileUrl) {
    try {
      const fileSrc = getFilePathFromUrl(fileUrl); // Get the file path from the URL

      // Extract the folder name and file name from the fileSrc
      const folderName = fileSrc.split("/")[0];
      const fileName = fileSrc.split("/")[1];

      // Delete the file from Supabase Storage
      const { error } = await supabaseClient.storage
        .from(config.SUPABASE.BUCKET_NAME) // Access the specified bucket
        .remove([`${fileSrc}`]); // Remove the specified file

      if (!error) {
        return {
          success: true,
          statusCode: 200,
          message: "File deleted successfully",
        };
      } else {
        throw new CustomError(`Error deleting file: ${error.message}`, 500);
      }
    } catch (error) {
      throw new CustomError(
        `Error in supabaseDeleteFile: ${error.message}`,
        500
      );
    }
  }
}
