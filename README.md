# BookVerse API Documentation

## Base URL
```
/api/v1
```

## Authentication
Most endpoints require authentication using JWT (JSON Web Token). Include the token in the Authorization header:
```
Authorization: Bearer <your_token>
```

## User Roles
- `USER`: Regular user with access to basic features
- `ADMIN`: Administrator with access to management features

## Endpoints

### Authentication
#### Register User
```http
POST /auth/system/register
```
Body:
```json
{
  "email": "string",
  "password": "string",
  "fullName": "string"
}
```

#### Login
```http
POST /auth/system/login
```
Body:
```json
{
  "email": "string",
  "password": "string"
}
```

### Books
#### Get All Books
```http
GET /books
```
Query Parameters:
- `category`: Filter by category
- `isFree`: Filter free books
- `search`: Search term
- `sort`: Sort criteria
- `limit`: Results per page
- `page`: Page number

#### Get Book by ID
```http
GET /books/:id
```

#### Create Book (Admin)
```http
POST /books
```
Body (multipart/form-data):
- `title`: string
- `author`: string
- `description`: string
- `coverImage`: file
- `filePath`: file
- `price`: number
- `categories`: array

#### Update Book (Admin)
```http
PUT /books/:id
```
Body:
- Same as create book

#### Update Book Cover Image (Admin)
```http
PUT /books/:id/cover-image
```
Body (multipart/form-data):
- `coverImage`: file

#### Update Book File (Admin)
```http
PUT /books/:id/file-path
```
Body (multipart/form-data):
- `filePath`: file

#### Delete Book (Admin)
```http
DELETE /books/:id
```

### Categories
#### Get All Categories
```http
GET /categories
```

#### Get Category by ID
```http
GET /categories/:id
```

#### Get Books by Category
```http
GET /categories/:id/books
```

#### Create Category (Admin)
```http
POST /categories
```
Body:
```json
{
  "name": "string",
  "description": "string"
}
```

#### Update Category (Admin)
```http
PUT /categories/:id
```
Body:
```json
{
  "name": "string",
  "description": "string"
}
```

#### Delete Category (Admin)
```http
DELETE /categories/:id
```

### Reviews
#### Get Book Reviews
```http
GET /reviews/book/:bookId
```

#### Get Review by ID
```http
GET /reviews/:id
```

#### Create Review (User)
```http
POST /reviews
```
Body:
```json
{
  "bookId": "string",
  "rating": number,
  "comment": "string"
}
```

#### Update Review (User)
```http
PUT /reviews/:id
```
Body:
```json
{
  "rating": number,
  "comment": "string"
}
```

#### Delete Review (User)
```http
DELETE /reviews/:id
```

### Library (User)
#### Get User's Library
```http
GET /library
```

#### Add Book to Library
```http
POST /library
```
Body:
```json
{
  "bookId": "string"
}
```

#### Remove Book from Library
```http
DELETE /library/:bookId
```

### Purchases
#### Get User's Purchases (User)
```http
GET /purchases
```

#### Get Purchase by ID (User)
```http
GET /purchases/:id
```

#### Create Purchase (User)
```http
POST /purchases
```
Body:
```json
{
  "bookId": "string"
}
```

#### Update Purchase Status (Admin)
```http
PUT /purchases/:id/status
```
Body:
```json
{
  "status": "string"
}
```

### Admin Dashboard
#### Get All Users (Admin)
```http
GET /admin/users
```

#### Get All Purchases (Admin)
```http
GET /admin/purchases
```

#### Get Dashboard Stats (Admin)
```http
GET /admin/stats
```

## Error Responses
The API uses standard HTTP response codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

Error Response Format:
```json
{
  "status": "error",
  "message": "Error description"
}
```

## Rate Limiting
API requests are subject to rate limiting to prevent abuse. Headers will include rate limit information:
- `X-RateLimit-Limit`: Requests allowed per window
- `X-RateLimit-Remaining`: Requests remaining in current window
- `X-RateLimit-Reset`: Time when the rate limit resets

## File Upload Specifications
- Cover Images: JPEG, PNG, WebP (max 5MB)
- Book Files: PDF (max 50MB)

## Security
- All endpoints use HTTPS
- JWT tokens expire after 24 hours
- Password requirements:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character 