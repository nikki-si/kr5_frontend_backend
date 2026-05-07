const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/auth');
const sequelize = require('../config/database');
const User = require('../models/User');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

describe('API Авторизация', () => {
  test('POST /api/auth/register — регистрация нового пользователя', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Тест', email: 'test@jest.com', password: '123456' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe('test@jest.com');
    expect(res.body.role).toBe('user');
  });

  test('POST /api/auth/register — ошибка без пароля', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Тест', email: 'no@pass.com' });
    expect(res.status).toBe(400);
  });

  test('POST /api/auth/login — успешный вход', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@jest.com', password: '123456' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('POST /api/auth/login — неверный пароль', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@jest.com', password: 'wrong' });
    expect(res.status).toBe(401);
  });
});
