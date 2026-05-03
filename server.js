const express = require('express');
const sequelize = require('./config/database');
const userRoutes = require('./routes/users');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Маршруты
app.use('/api/users', userRoutes);

// Запуск сервера
sequelize.sync().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
});
