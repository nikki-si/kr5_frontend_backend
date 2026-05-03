const connectRabbitMQ = require('../config/rabbitmq');

async function startWorker() {
  const { channel, queue } = await connectRabbitMQ();
  console.log(`Worker started, waiting for messages in ${queue}...`);
  
  channel.consume(queue, (msg) => {
    if (msg !== null) {
      const task = JSON.parse(msg.content.toString());
      if (task.type === 'SEND_WELCOME_EMAIL') {
        console.log(`[EMAIL] Отправляем приветственное письмо для юзера с ID: ${task.userId}`);
        // Здесь была бы реальная логика отправки email
      }
      channel.ack(msg);
    }
  });
}

startWorker();
