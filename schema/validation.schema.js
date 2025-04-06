import { CustomError } from "../service/core/CustomResponse.js";
import {
    ORDER_STATUS,
    VALIDATION_TYPES,
} from "../utils/constants/app.constant.js";
import { validatePhoneNumber } from "../utils/helpers/app.helpers.js";

export class ValidationSchema {
    static idSchema = [
        { field: "id", type: VALIDATION_TYPES.INTEGER, required: true },
    ];

    // Login Schema
    static loginSchema = [
        { field: "email", type: VALIDATION_TYPES.EMAIL, required: true },
        { field: "password", type: VALIDATION_TYPES.PASSWORD, required: true },
    ];

    // Forgot Password Schema
    static forgotPasswordSchema = [
        { field: "email", type: VALIDATION_TYPES.EMAIL, required: true },
    ];

    // Simple User Onboarding Schema
    static simpleUserOnboardingSchema = [
        { field: "fullName", type: VALIDATION_TYPES.PURE_NAME, required: true },
        { field: "email", type: VALIDATION_TYPES.EMAIL, required: true },
        { field: "password", type: VALIDATION_TYPES.PASSWORD, required: true },
        { field: "userType", type: VALIDATION_TYPES.INTEGER, required: true },
    ];

    // Request Password Reset Schema
    static requestPasswordResetSchema = [
        { field: "email", type: VALIDATION_TYPES.EMAIL, required: true },
    ];

    // Update Password Schema
    static updatePasswordSchema = [
        { field: "password", type: VALIDATION_TYPES.PASSWORD, required: true },
        {
            field: "confirmPassword",
            type: VALIDATION_TYPES.PASSWORD,
            required: true,
        },
        { field: "token", type: VALIDATION_TYPES.STRING, required: true },
        { field: "email", type: VALIDATION_TYPES.EMAIL, required: true },
    ];

    // Create Book Schema
    static createBookSchema = [
        { field: "title", type: VALIDATION_TYPES.STRING, required: true },
        { field: "author", type: VALIDATION_TYPES.STRING, required: true },
        { field: "description", type: VALIDATION_TYPES.STRING, required: true },
        { field: "price", type: VALIDATION_TYPES.NUMBER, required: true },
        { field: "isFree", type: VALIDATION_TYPES.BOOLEAN, required: true },
        {
            field: "publishedDate",
            type: VALIDATION_TYPES.DATETIME,
            required: true,
        },
        {
            field: "categories",
            type: VALIDATION_TYPES.ARRAY,
            required: true,
            arrayType: VALIDATION_TYPES.STRING,
        },
    ];

    // Update Book Schema
    static updateBookSchema = [
        { field: "title", type: VALIDATION_TYPES.STRING, required: false },
        { field: "author", type: VALIDATION_TYPES.STRING, required: false },
        {
            field: "description",
            type: VALIDATION_TYPES.STRING,
            required: false,
        },
        { field: "price", type: VALIDATION_TYPES.NUMBER, required: false },
        { field: "isFree", type: VALIDATION_TYPES.BOOLEAN, required: false },
        {
            field: "publishedDate",
            type: VALIDATION_TYPES.DATETIME,
            required: false,
        },
        {
            field: "categories",
            type: VALIDATION_TYPES.ARRAY,
            required: false,
            arrayType: VALIDATION_TYPES.STRING,
        },
    ];

    // Create Category Schema
    static createCategorySchema = [
        { field: "name", type: VALIDATION_TYPES.STRING, required: true },
        {
            field: "description",
            type: VALIDATION_TYPES.STRING,
            required: false,
        },
    ];

    // Update Category Schema
    static updateCategorySchema = [
        { field: "name", type: VALIDATION_TYPES.STRING, required: false },
        {
            field: "description",
            type: VALIDATION_TYPES.STRING,
            required: false,
        },
    ];

    // Create Purchase Schema
    static createPurchaseSchema = [
        { field: "bookId", type: VALIDATION_TYPES.STRING, required: true },
    ];

    // Update Purchase Status Schema
    static updatePurchaseStatusSchema = [
        {
            field: "status",
            type: VALIDATION_TYPES.CUSTOM,
            required: true,
            format: (value) => {
                if (!Object.values(ORDER_STATUS).includes(value)) {
                    throw new CustomError("Invalid status", 400);
                }
                return true;
            },
        },
    ];

    // Add to Library Schema
    static addToLibrarySchema = [
        { field: "bookId", type: VALIDATION_TYPES.STRING, required: true },
    ];

    // Create Review Schema
    static createReviewSchema = [
        { field: "bookId", type: VALIDATION_TYPES.STRING, required: true },
        { field: "rating", type: VALIDATION_TYPES.INTEGER, required: true },
        { field: "comment", type: VALIDATION_TYPES.STRING, required: false },
    ];

    // Update Review Schema
    static updateReviewSchema = [
        { field: "rating", type: VALIDATION_TYPES.INTEGER, required: false },
        { field: "comment", type: VALIDATION_TYPES.STRING, required: false },
    ];

    // Complex User Onboarding Schema
    static complexUserOnboardingSchema = [
        { field: "fullName", type: VALIDATION_TYPES.PURE_NAME, required: true },
        { field: "email", type: VALIDATION_TYPES.EMAIL, required: true },
        { field: "password", type: VALIDATION_TYPES.PASSWORD, required: true },
        {
            field: "hobbies",
            type: VALIDATION_TYPES.ARRAY,
            required: true,
            arrayType: VALIDATION_TYPES.STRING,
        },
        {
            field: "address",
            type: VALIDATION_TYPES.OBJECT,
            required: true,
            schema: [
                {
                    field: "street",
                    type: VALIDATION_TYPES.STRING,
                    required: true,
                },
                {
                    field: "city",
                    type: VALIDATION_TYPES.STRING,
                    required: true,
                },
                {
                    field: "state",
                    type: VALIDATION_TYPES.STRING,
                    required: true,
                },
                {
                    field: "country",
                    type: VALIDATION_TYPES.STRING,
                    required: true,
                },
                {
                    field: "zipCode",
                    type: VALIDATION_TYPES.STRING,
                    required: true,
                },
            ],
        },
        {
            field: "phoneNumber",
            type: VALIDATION_TYPES.OBJECT,
            required: true,
            validate: (value) => {
                const isValid = validatePhoneNumber(value.phoneNumber);
                if (!isValid) {
                    throw new CustomError("Invalid phone number", 400);
                }
                return isValid;
            },
        },
    ];
}
