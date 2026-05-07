const express = require('express');
const sequelize = require('./config/database');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Swagger (если установлен)
try {
  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: { title: 'API КР5', version: '1.0.0', description: 'API для управления пользователями' },
      servers: [{ url: `http://localhost:${process.env.PORT || 3001}`, description: 'Локальный сервер' }],
    },
    apis: ['./routes/*.js'],
  };
  const swaggerSpec = swaggerJsdoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
} catch (e) {}

// Маршруты
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Запуск
sequelize.sync({ alter: true }).then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
});
