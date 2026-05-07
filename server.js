const express = require('express');
const sequelize = require('./config/database');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const healthRoutes = require('./routes/health');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Swagger
try {
  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: { title: 'API КР5', version: '1.0.0' },
      servers: [{ url: `http://localhost:${process.env.PORT || 3001}` }],
    },
    apis: ['./routes/*.js'],
  };
  const swaggerSpec = swaggerJsdoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
} catch (e) {}

// Маршруты
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Запуск
sequelize.sync({ alter: true }).then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`[${process.env.SERVER_ID || 'server'}] running on port ${process.env.PORT}`);
  });
});
