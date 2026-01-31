# Report Hub - Backend Server

A professional, secure, and scalable backend API for the Report Hub application with JWT authentication, role-based authorization, and comprehensive security measures.

## Features

- **User Authentication**: Secure JWT-based authentication with refresh tokens
- **Role-Based Authorization**: Admin and Employee roles with appropriate permissions
- **Security**: Helmet, rate limiting, input sanitization, CORS, and encryption
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Express-validator for request validation
- **Error Handling**: Centralized error handling with detailed error messages
- **Logging**: Morgan logger for HTTP requests

## Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Encryption**: bcryptjs
- **Security**: Helmet, express-rate-limit, express-mongo-sanitize
- **Validation**: express-validator

## Project Structure

```
server/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── userController.js    # User management logic
│   ├── reportController.js  # Report management logic
│   └── announcementController.js  # Announcement logic
├── middleware/
│   ├── auth.js             # Authentication & authorization
│   ├── errorHandler.js     # Error handling middleware
│   └── validation.js       # Validation middleware
├── models/
│   ├── User.js             # User model
│   ├── Report.js           # Report model
│   └── Announcement.js     # Announcement model
├── routes/
│   ├── authRoutes.js       # Authentication routes
│   ├── userRoutes.js       # User routes
│   ├── reportRoutes.js     # Report routes
│   └── announcementRoutes.js  # Announcement routes
├── utils/
│   ├── AppError.js         # Custom error class
│   └── tokenUtils.js       # JWT token utilities
├── .env.example            # Environment variables template
├── .gitignore
├── package.json
└── server.js               # Main application file
```

## Installation

1. **Navigate to the server directory**:
   ```bash
   cd server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Copy `.env.example` to `.env`
   - Update the values in `.env`:
   ```bash
   cp .env.example .env
   ```

4. **Configure your `.env` file**:
   ```env
   NODE_ENV=development
   PORT=5000
   
   MONGODB_URI=mongodb://localhost:27017/report-hub
   
   JWT_SECRET=your-super-secret-jwt-key-change-this
   JWT_EXPIRE=7d
   JWT_REFRESH_SECRET=your-refresh-token-secret
   JWT_REFRESH_EXPIRE=30d
   
   COOKIE_EXPIRE=7
   CLIENT_URL=http://localhost:5173
   
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

5. **Start MongoDB**:
   - Make sure MongoDB is installed and running on your system
   - Default connection: `mongodb://localhost:27017`

6. **Run the server**:
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "department": "Engineering",
  "position": "Developer"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer {token}
```

#### Refresh Token
```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

### User Endpoints

#### Get All Users (Admin Only)
```http
GET /api/users?page=1&limit=10&role=employee&search=john
Authorization: Bearer {token}
```

#### Get Single User (Admin Only)
```http
GET /api/users/:id
Authorization: Bearer {token}
```

#### Update User (Admin Only)
```http
PUT /api/users/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "role": "admin",
  "isActive": true
}
```

#### Update Profile (Own Profile)
```http
PUT /api/users/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Doe Updated",
  "department": "Product"
}
```

#### Change Password
```http
PUT /api/users/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

### Report Endpoints

#### Create Report
```http
POST /api/reports
Authorization: Bearer {token}
Content-Type: application/json

{
  "type": "daily",
  "date": "2026-02-01",
  "tasks": [
    {
      "description": "Implemented user authentication",
      "duration": 4,
      "status": "completed",
      "priority": "high"
    }
  ],
  "notes": "Additional notes here"
}
```

#### Get All Reports
```http
GET /api/reports?page=1&limit=10&type=daily&status=submitted&startDate=2026-01-01&endDate=2026-02-01
Authorization: Bearer {token}
```

#### Get Single Report
```http
GET /api/reports/:id
Authorization: Bearer {token}
```

#### Update Report
```http
PUT /api/reports/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "tasks": [...],
  "notes": "Updated notes",
  "status": "draft"
}
```

#### Submit Report
```http
PUT /api/reports/:id/submit
Authorization: Bearer {token}
```

#### Review Report (Admin Only)
```http
PUT /api/reports/:id/review
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "approved",
  "reviewNotes": "Great work!"
}
```

#### Get Report Statistics
```http
GET /api/reports/stats?userId=123
Authorization: Bearer {token}
```

### Announcement Endpoints

#### Create Announcement (Admin Only)
```http
POST /api/announcements
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "New Policy Update",
  "content": "Please review the new guidelines...",
  "type": "policy",
  "priority": "high",
  "isPublished": true,
  "targetAudience": ["all"],
  "expiresAt": "2026-03-01"
}
```

#### Get All Announcements
```http
GET /api/announcements?page=1&limit=10&type=urgent&priority=high
Authorization: Bearer {token}
```

#### Get Single Announcement
```http
GET /api/announcements/:id
Authorization: Bearer {token}
```

#### Update Announcement (Admin Only)
```http
PUT /api/announcements/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "isPublished": true
}
```

#### Mark Announcement as Read
```http
PUT /api/announcements/:id/read
Authorization: Bearer {token}
```

## Security Features

1. **Helmet**: Sets various HTTP headers for security
2. **CORS**: Configured to accept requests only from trusted origins
3. **Rate Limiting**: Prevents brute force attacks (100 requests per 15 minutes)
4. **Input Sanitization**: Protects against NoSQL injection attacks
5. **Password Encryption**: Uses bcrypt with salt rounds
6. **JWT Tokens**: Secure token-based authentication
7. **HTTP-Only Cookies**: Tokens stored in secure cookies
8. **Request Validation**: All inputs validated before processing
9. **Error Handling**: No sensitive information leaked in errors

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "error": "Error message here"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Server Error

## Development

### Install nodemon for auto-reload:
```bash
npm install -D nodemon
```

### Run in development mode:
```bash
npm run dev
```

## Testing

Test the API using:
- **Postman**: Import the endpoints and test
- **Thunder Client**: VS Code extension
- **cURL**: Command-line testing

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use strong, unique values for JWT secrets
3. Enable HTTPS
4. Use a production-grade MongoDB instance
5. Set up proper logging and monitoring
6. Configure firewall and security groups
7. Use environment variables for all sensitive data

## License

ISC

## Support

For issues or questions, please contact the development team.
