const express = require('express');
const User = require('../models/User');
const redisClient = require('../config/redis');
const connectRabbitMQ = require('../config/rabbitmq');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();
const CACHE_KEY = 'all_users';
const CACHE_TTL = 60;

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Получить список пользователей (user/admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список пользователей
 */
router.get('/', authMiddleware, roleMiddleware('user', 'admin'), async (req, res) => {
  try {
    const cachedUsers = await redisClient.get(CACHE_KEY);
    if (cachedUsers) return res.json(JSON.parse(cachedUsers));

    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    await redisClient.setEx(CACHE_KEY, CACHE_TTL, JSON.stringify(users));
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Создать пользователя (admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Пользователь создан
 */
router.post('/', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const user = await User.create(req.body);
    await redisClient.del(CACHE_KEY);

    const { channel, queue } = await connectRabbitMQ();
    channel.sendToQueue(
      queue,
      Buffer.from(JSON.stringify({ type: 'SEND_WELCOME_EMAIL', userId: user.id }))
    );
    setTimeout(() => channel.close(), 1000);

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
