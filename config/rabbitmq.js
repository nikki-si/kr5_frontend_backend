const amqp = require('amqplib');
require('dotenv').config();

async function connectRabbitMQ() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  const channel = await connection.createChannel();
  const queue = 'email_queue';
  await channel.assertQueue(queue, { durable: true });
  return { connection, channel, queue };
}

module.exports = connectRabbitMQ;
