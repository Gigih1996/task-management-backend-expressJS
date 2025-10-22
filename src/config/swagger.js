const swaggerJsDoc = require('swagger-jsdoc');
const path = require('path');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express.js REST API with MongoDB',
      version: '1.0.0',
      description: 'A comprehensive REST API built with Express.js, MongoDB, and JWT authentication',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:5001',
        description: 'Development server',
      },
      {
        url: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://api.example.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication endpoints',
      },
      {
        name: 'Tasks',
        description: 'Task management endpoints with filtering, sorting, and pagination',
      },
    ],
  },
  // Use absolute path for Vercel serverless environment
  apis: [
    path.join(__dirname, '../routes/*.js'),
    path.join(process.cwd(), 'src/routes/*.js')
  ],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;
