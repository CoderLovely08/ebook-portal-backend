# BookVerse

A comprehensive digital eBook platform that enables users to browse, purchase, read, and manage digital books. Built with Node.js, Express, Prisma, PostgreSQL for the backend and designed to support frontend applications.

## Frontend Repository

The frontend repository is available at [BookVerse Frontend](https://github.com/CoderLovely08/ebook-portal-frontend).

## Project Overview

The eBook Platform provides a complete solution for digital book management with three core modules:

### 1. User Module

- Self-registration and account management
- Browse books by categories and search functionality
- Purchase and access digital books
- Personal library management
- Book reviews and ratings
- Reading progress tracking

### 2. Admin Module

- Complete book catalog management
- User and purchase order management
- Category creation and organization
- Dashboard analytics and statistics
- Content moderation and reviews

### 3. API-First Architecture

- RESTful API design for frontend flexibility
- JWT-based authentication and authorization
- File upload handling for book covers and PDF files
- Comprehensive error handling and logging

## 💻 Tech Stack:

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white) ![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens) ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)

### Backend

- **Node.js & Express**: RESTful API server with comprehensive middleware
- **Prisma**: Modern ORM for database operations and migrations
- **PostgreSQL**: Primary database for data persistence
- **JWT**: Secure authentication and authorization
- **Supabase**: Cloud storage for book files and cover images
- **Multer**: File upload handling for PDFs and images
- **Winston**: Advanced logging and monitoring
- **Helmet**: Security headers and protection
- **Bcrypt**: Password hashing and security

## Project Structure

### Backend Structure

```
backend/
├── app.js                      # Main application entry point
├── config/                     # Configuration files
│   ├── app.config.js          # App configuration and environment variables
│   ├── multer.config.js       # File upload configuration
│   └── supabase.config.js     # Supabase client configuration
├── controllers/               # Route controllers
│   ├── common/
│   │   └── Common.controller.js
│   └── v1/
│       ├── Admin.controller.js      # Admin management endpoints
│       ├── Auth.controller.js       # Authentication endpoints
│       ├── Book.controller.js       # Book management endpoints
│       ├── Category.controller.js   # Category management endpoints
│       ├── Financial.controller.js  # Financial and purchase tracking
│       ├── Library.controller.js    # User library management
│       ├── Purchase.controller.js   # Purchase order management
│       ├── Review.controller.js     # Book reviews and ratings
│       └── user.controller.js       # User profile management
├── middlewares/               # Custom middleware
│   ├── auth.middleware.js     # JWT authentication and authorization
│   ├── logging.middleware.js  # Request logging and monitoring
│   └── validation.middleware.js # Input validation
├── prisma/                    # Database schema and migrations
│   ├── schema.prisma         # Database schema definition
│   └── seed.js               # Database seeding script
├── routes/                    # API route definitions
│   └── v1/
│       ├── index.js          # Main route aggregator
│       ├── admin.routes.js   # Admin-specific routes
│       ├── auth.routes.js    # Authentication routes
│       ├── books.routes.js   # Book-related routes
│       ├── categories.routes.js # Category routes
│       ├── library.routes.js # User library routes
│       ├── purchases.routes.js # Purchase routes
│       ├── reviews.routes.js # Review routes
│       └── user.routes.js    # User profile routes
├── schema/                    # Validation schemas
│   └── validation.schema.js  # Input validation rules
├── service/                   # Business logic layer
│   ├── common/
│   │   └── Supabase.service.js # File storage operations
│   ├── core/
│   │   └── CustomResponse.js   # Standardized API responses
│   └── v1/
│       ├── admin.service.js     # Admin business logic
│       ├── auth.service.js      # Authentication logic
│       ├── book.service.js      # Book management logic
│       ├── category.service.js  # Category management
│       ├── library.service.js   # Library management
│       ├── purchase.service.js  # Purchase processing
│       ├── review.service.js    # Review management
│       └── user.service.js      # User management
├── utils/                     # Utility functions
│   ├── constants/
│   │   └── app.constant.js    # Application constants
│   └── helpers/
│       └── app.helpers.js     # Helper functions
└── docs/                      # Documentation
    ├── 01 Node Server.md      # Server setup guide
    ├── 02 Features.md         # Feature integration guide
    ├── 03 Subdomain.md        # Subdomain configuration
    ├── 04 Nginx Server Setup.md # Nginx configuration
    ├── 05 PM2 Setup.md        # Process manager setup
    ├── 06 Deploy Key.md       # Deployment keys
    └── 07 Auto Deploy.md      # Automated deployment
```

## Core Features

### Book Management

- **Digital Library**: Complete catalog of eBooks with metadata
- **Category System**: Organized book classification and filtering
- **File Storage**: Secure PDF storage and cover image management
- **Search & Discovery**: Advanced search and filtering capabilities
- **Free & Paid Books**: Support for both free and premium content

### User Experience

- **Personal Library**: Individual book collections for users
- **Purchase System**: Secure book purchasing with order tracking
- **Review System**: User ratings and reviews with moderation
- **Reading Progress**: Track user reading activity and progress

### Admin Dashboard

- **Content Management**: Full CRUD operations for books and categories
- **User Management**: User account oversight and management
- **Analytics**: Comprehensive dashboard statistics and reporting
- **Order Management**: Purchase order tracking and management

### Security & Performance

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access**: User and Admin role differentiation
- **Rate Limiting**: API protection against abuse
- **File Upload Security**: Secure file handling with validation
- **Comprehensive Logging**: Request tracking and error monitoring

## Database Schema

The application uses PostgreSQL with Prisma ORM and includes the following main entities:

- **SystemUsersInfo**: User accounts with role-based access
- **UserType**: User role definitions (User/Admin)
- **Book**: eBook catalog with metadata and file references
- **Category**: Book categorization system
- **CategoriesOnBooks**: Many-to-many relationship for book categories
- **PurchaseOrder**: Purchase transaction tracking
- **UserLibrary**: User's personal book collection
- **Review**: User ratings and reviews for books

## API Endpoints

### Authentication Routes

```
POST   /api/v1/auth/system/register    # User registration
POST   /api/v1/auth/system/login       # User login
```

### Book Routes

```
GET    /api/v1/books                   # Get all books with filtering
GET    /api/v1/books/:id               # Get specific book details
POST   /api/v1/books                   # Create new book (Admin)
PUT    /api/v1/books/:id               # Update book (Admin)
PUT    /api/v1/books/:id/cover-image   # Update book cover (Admin)
PUT    /api/v1/books/:id/file-path     # Update book file (Admin)
DELETE /api/v1/books/:id               # Delete book (Admin)
```

### Category Routes

```
GET    /api/v1/categories              # Get all categories
GET    /api/v1/categories/:id          # Get category details
GET    /api/v1/categories/:id/books    # Get books by category
POST   /api/v1/categories              # Create category (Admin)
PUT    /api/v1/categories/:id          # Update category (Admin)
DELETE /api/v1/categories/:id          # Delete category (Admin)
```

### User Library Routes

```
GET    /api/v1/library                 # Get user's library
POST   /api/v1/library                 # Add book to library
DELETE /api/v1/library/:bookId         # Remove book from library
```

### Purchase Routes

```
GET    /api/v1/purchases               # Get user's purchases
GET    /api/v1/purchases/:id           # Get purchase details
POST   /api/v1/purchases               # Create purchase order
PUT    /api/v1/purchases/:id/status    # Update purchase status (Admin)
```

### Review Routes

```
GET    /api/v1/reviews/book/:bookId    # Get book reviews
GET    /api/v1/reviews/:id             # Get specific review
POST   /api/v1/reviews                 # Create review
PUT    /api/v1/reviews/:id             # Update review
DELETE /api/v1/reviews/:id             # Delete review
```

### Admin Routes

```
GET    /api/v1/admin/users             # Get all users
GET    /api/v1/admin/purchases         # Get all purchases
GET    /api/v1/admin/stats             # Get dashboard statistics
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Supabase account for file storage
- npm or yarn package manager

### Installation

1. Clone the repository

```bash
git clone https://github.com/CoderLovely08/ebook-portal-backend
cd ebook-portal-backend
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.example .env
# Configure your database URL, JWT secret, and Supabase credentials
```

4. Set up the database

```bash
npx prisma migrate dev
npm run seed
```

5. Start the development server

```bash
npm run dev
```

The API will be available at `http://localhost:3000/api/v1`

## Environment Variables

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ebp_db"
JWT_SECRET="your-jwt-secret"
JWT_EXPIRES_IN="24h"
SUPABASE_URL="your-supabase-url"
SUPABASE_PUBLIC_KEY="your-supabase-key"
```

## Security Features

- **Password Hashing**: Bcrypt for secure password storage
- **JWT Authentication**: Stateless authentication with expiration
- **Input Validation**: Comprehensive request validation
- **Rate Limiting**: Protection against brute force attacks
- **CORS Configuration**: Cross-origin request handling
- **Helmet Security**: Security headers and protection
- **File Upload Limits**: Size and type restrictions for uploads

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Author

**Lovely Sharma** - Backend Developer and API Architect
