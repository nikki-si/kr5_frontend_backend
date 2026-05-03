const express = require('express');
const User = require('../models/User');
const redisClient = require('../config/redis');
const connectRabbitMQ = require('../config/rabbitmq');

const router = express.Router();
const CACHE_KEY = 'all_users';
const CACHE_TTL = 60;

// Получить всех пользователей (с кэшированием)
router.get('/', async (req, res) => {
  try {
    const cachedUsers = await redisClient.get(CACHE_KEY);
    if (cachedUsers) return res.json(JSON.parse(cachedUsers));

    const users = await User.findAll();
    await redisClient.setEx(CACHE_KEY, CACHE_TTL, JSON.stringify(users));
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Создать пользователя (с инвалидацией кэша и отправкой задачи)
router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    // Очищаем кэш
    await redisClient.del(CACHE_KEY);
    
    // Отправляем задачу в очередь RabbitMQ
    const { channel, queue } = await connectRabbitMQ();
    channel.sendToQueue(
      queue,
      Buffer.from(JSON.stringify({ type: 'SEND_WELCOME_EMAIL', userId: user.id }))
    );
    // Закрываем соединение после отправки (чтобы не накапливались)
    setTimeout(() => channel.close(), 1000);
    
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
