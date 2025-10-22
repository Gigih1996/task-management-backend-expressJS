const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to database on first request (for serverless)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// Swagger Documentation - lazy load to avoid initialization issues
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', (req, res, next) => {
  try {
    const swaggerDocs = require('./config/swagger');
    swaggerUi.setup(swaggerDocs, {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'Express API Documentation',
    })(req, res, next);
  } catch (error) {
    console.error('Swagger initialization error:', error);
    res.status(500).json({
      success: false,
      message: 'API documentation is temporarily unavailable',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Express.js API is running',
    version: '1.0.0',
    documentation: '/api-docs',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

// Start server (only in development, not in Vercel)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;

  const server = app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🚀 Express.js Server is running                    ║
║                                                       ║
║   📡 Port: ${PORT}                                       ║
║   🌍 Environment: ${process.env.NODE_ENV || 'development'}                       ║
║   📚 API Docs: http://localhost:${PORT}/api-docs        ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
    `);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error(`Error: ${err.message}`);
    server.close(() => process.exit(1));
  });
}

// Export for Vercel serverless
module.exports = app;
