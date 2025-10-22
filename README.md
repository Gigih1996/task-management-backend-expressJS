# Express.js REST API with MongoDB

A production-ready REST API built with Express.js, MongoDB, JWT authentication, and comprehensive Swagger documentation. This API includes task management with advanced filtering, sorting, pagination, and full CRUD operations.

## Features

- **Express.js Framework** - Fast, unopinionated web framework
- **MongoDB with Mongoose** - NoSQL database with elegant object modeling and optimized indexes
- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt for secure password storage
- **Task Management** - Full CRUD operations with filtering, sorting, and pagination
- **Input Validation** - Express-validator for comprehensive request validation
- **Error Handling** - Centralized error handling with proper status codes
- **Swagger Documentation** - Interactive API documentation (OpenAPI 3.0)
- **Database Seeding** - Faker.js for generating test data
- **MongoDB Indexes** - Optimized indexes for better query performance
- **CORS Enabled** - Cross-Origin Resource Sharing support
- **Environment Variables** - Secure configuration management

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **ODM**: Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Documentation**: Swagger (swagger-ui-express, swagger-jsdoc)
- **Faker**: @faker-js/faker
- **Environment**: dotenv
- **Development**: nodemon

## Project Structure

```
backend-express/
├── db/
│   ├── indexes.js             # MongoDB index creation script
│   └── seeders/
│       ├── seed.js            # Main seeder (all data)
│       ├── userSeeder.js      # User seeder (5 users)
│       └── taskSeeder.js      # Task seeder (40 tasks)
├── src/
│   ├── config/
│   │   ├── database.js        # MongoDB connection configuration
│   │   └── swagger.js         # Swagger documentation setup
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   └── taskController.js  # Task CRUD with filters
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication middleware
│   │   └── errorHandler.js    # Error handling middleware
│   ├── models/
│   │   ├── User.js            # User model schema
│   │   └── Task.js            # Task model schema
│   ├── routes/
│   │   ├── authRoutes.js      # Authentication routes
│   │   └── taskRoutes.js      # Task routes
│   └── index.js               # Application entry point
├── .env                       # Environment variables
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore file
├── package.json               # Project dependencies
└── README.md                  # Project documentation
```

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (already configured)
- npm or yarn

### Steps

1. Navigate to the project directory:
```bash
cd backend-express
```

2. Install dependencies:
```bash
npm install
```

3. Environment is already configured:
```env
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb+srv://gsatriono_db_user:VeRr6ckSkLFsrL2E@gigih-cluster1.n78yqmq.mongodb.net/task_manage_express
JWT_SECRET=express_jwt_secret_key_2025_change_this_in_production
JWT_EXPIRE=30d
```

4. Seed the database (5 users + 40 tasks):
```bash
npm run seed
```

5. Create MongoDB indexes for better performance:
```bash
npm run create:indexes
```

6. Start the development server:
```bash
npm run dev
```

Or for production:
```bash
npm start
```

## API Documentation

Once the server is running, access the **interactive Swagger documentation** at:

```
http://localhost:5001/api-docs
```

## API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user (returns JWT token) | Public |
| GET | `/api/auth/me` | Get current user profile | Private |
| PUT | `/api/auth/profile` | Update user profile | Private |
| PUT | `/api/auth/password` | Update user password | Private |

### Task Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/tasks` | Get all tasks (with filters, sort, pagination) | Private |
| GET | `/api/tasks/:id` | Get single task by ID | Private |
| POST | `/api/tasks` | Create new task | Private |
| PUT | `/api/tasks/:id` | Update task by ID | Private |
| DELETE | `/api/tasks/:id` | Delete task by ID | Private |

### Health Check

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | API health check | Public |

## Task Filtering & Sorting

### Query Parameters

The `GET /api/tasks` endpoint supports the following query parameters:

**Filtering:**
- `status` - Filter by status: `pending`, `in_progress`, `completed`
- `priority` - Filter by priority: `low`, `medium`, `high`
- `search` - Search in title and description
- `due_date_from` - Filter tasks from this date (ISO 8601)
- `due_date_to` - Filter tasks until this date (ISO 8601)

**Sorting:**
- `sort_by` - Field to sort by: `title`, `status`, `priority`, `due_date`, `createdAt`, `updatedAt` (default: `createdAt`)
- `sort_order` - Sort order: `asc` or `desc` (default: `desc`)

**Pagination:**
- `page` - Page number (default: 1, min: 1)
- `per_page` - Items per page (default: 10, min: 1, max: 100)

### Example Queries

```bash
# Get all pending tasks
GET /api/tasks?status=pending

# Get high priority tasks
GET /api/tasks?priority=high

# Search tasks
GET /api/tasks?search=documentation

# Get tasks due within a date range
GET /api/tasks?due_date_from=2024-01-01&due_date_to=2024-12-31

# Sort by due date ascending
GET /api/tasks?sort_by=due_date&sort_order=asc

# Pagination
GET /api/tasks?page=2&per_page=20

# Combined filters
GET /api/tasks?status=in_progress&priority=high&sort_by=due_date&page=1&per_page=10
```

## Usage Examples

### 1. Register a New User

```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "6507...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Login

```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "6507...",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Get Tasks with Filters

```bash
curl -X GET "http://localhost:5001/api/tasks?status=pending&priority=high&page=1&per_page=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "6507...",
      "title": "Complete project documentation",
      "description": "Write comprehensive API documentation",
      "status": "pending",
      "priority": "high",
      "due_date": "2024-12-31T23:59:59.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 4,
    "per_page": 10,
    "to": 10,
    "total": 35
  },
  "links": {
    "first": 1,
    "last": 4,
    "prev": null,
    "next": 2
  }
}
```

### 4. Create a New Task

```bash
curl -X POST http://localhost:5001/api/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Implement new feature",
    "description": "Add user authentication to the dashboard",
    "status": "pending",
    "priority": "high",
    "due_date": "2024-12-31T23:59:59.000Z"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "_id": "6507...",
    "title": "Implement new feature",
    "description": "Add user authentication to the dashboard",
    "status": "pending",
    "priority": "high",
    "due_date": "2024-12-31T23:59:59.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 5. Update a Task

```bash
curl -X PUT http://localhost:5001/api/tasks/6507... \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_progress",
    "priority": "medium"
  }'
```

### 6. Delete a Task

```bash
curl -X DELETE http://localhost:5001/api/tasks/6507... \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Database Seeding

### Seed All Data (5 Users + 40 Tasks)

```bash
npm run seed
```

This will:
- Create 1 admin user (admin@example.com)
- Create 4 regular users with random data
- Create 40 tasks with random data
- Default password for all users: `password123`

### Seed Only Users

```bash
npm run seed:users
```

### Seed Only Tasks

```bash
npm run seed:tasks
```

## MongoDB Indexes

Create optimized indexes for better query performance:

```bash
npm run create:indexes
```

**Indexes created:**
- Users: email (unique), role, isActive, createdAt
- Tasks: status, priority, due_date, createdAt, updatedAt
- Compound indexes: status+priority, status+due_date, priority+due_date
- Text index: title+description (for search)

## Authentication

This API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Login Credentials (after seeding):**
```
Email: admin@example.com
Password: password123
```

## Error Handling

The API returns consistent error responses with proper HTTP status codes:

```json
{
  "success": false,
  "message": "Error message here"
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Validation Rules

### User Registration/Login
- **Name**: 3-50 characters
- **Email**: Valid email format
- **Password**: Minimum 6 characters

### Task Creation/Update
- **Title**: 3-200 characters (required)
- **Description**: 10-1000 characters (required)
- **Status**: `pending`, `in_progress`, `completed`
- **Priority**: `low`, `medium`, `high`
- **Due Date**: Valid ISO 8601 date (required)

## Database Schema

### User Model

```javascript
{
  name: String (required, 3-50 characters),
  email: String (required, unique, valid email),
  password: String (required, min 6 characters, hashed),
  role: String (enum: ['user', 'admin'], default: 'user'),
  isActive: Boolean (default: true),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

### Task Model

```javascript
{
  title: String (required, 3-200 characters),
  description: String (required, 10-1000 characters),
  status: String (enum: ['pending', 'in_progress', 'completed'], default: 'pending'),
  priority: String (enum: ['low', 'medium', 'high'], default: 'medium'),
  due_date: Date (required),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

## NPM Scripts

```bash
npm start              # Start production server
npm run dev            # Start development server with nodemon
npm run seed           # Seed all data (5 users + 40 tasks)
npm run seed:users     # Seed only users
npm run seed:tasks     # Seed only tasks
npm run create:indexes # Create MongoDB indexes
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | development, production |
| `PORT` | Server port | 5001 |
| `MONGODB_URI` | MongoDB connection string | mongodb+srv://... |
| `JWT_SECRET` | JWT signing secret | your_secret_key |
| `JWT_EXPIRE` | Token expiration time | 30d |

## Testing with Swagger

1. Start the server: `npm run dev`
2. Navigate to: `http://localhost:5001/api-docs`
3. Use the interactive interface to test endpoints
4. For protected routes:
   - Click "Authorize" button
   - Enter: `Bearer YOUR_TOKEN`
   - Click "Authorize" and "Close"

## Performance Optimization

- **MongoDB Indexes**: Optimized indexes on frequently queried fields
- **Pagination**: Limit results to prevent large data transfers
- **Query Optimization**: Efficient filtering and sorting at database level
- **Connection Pooling**: Mongoose connection pooling enabled

## Security Features

- Password hashing with bcryptjs (10 salt rounds)
- JWT token authentication
- Input validation with express-validator
- MongoDB injection prevention
- CORS protection
- Environment variables for sensitive data
- Error messages don't expose sensitive information

## Production Deployment

1. Set `NODE_ENV=production`
2. Change `JWT_SECRET` to a strong random string
3. Update MongoDB URI for production database
4. Enable HTTPS
5. Set up rate limiting
6. Configure proper CORS origins
7. Use a process manager (PM2)
8. Enable logging and monitoring

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the ISC License.

## Support

For issues and questions, please create an issue in the repository.

---

**Built with Express.js, MongoDB, and ❤️**
