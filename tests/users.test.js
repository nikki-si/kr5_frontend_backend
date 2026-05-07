const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const userRoutes = require('../routes/users');

const JWT_SECRET = 'my_super_secret_key_2025';

const app = express();
app.use(express.json());

// Мокаем middleware для тестов
app.use((req, res, next) => {
  // Создаём админ-токен
  req.headers.authorization = 'Bearer ' + jwt.sign({ id: 2, role: 'admin' }, JWT_SECRET);
  next();
});
app.use('/api/users', userRoutes);

describe('API Пользователи', () => {
  test('GET /api/users — список пользователей (admin)', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/users — создание пользователя (admin)', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Новый', email: 'new@admin.com', password: 'pass' });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Новый');
  });
});
