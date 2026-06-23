require('dotenv').config();
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'cashmate-notification-service',
  brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
});

const consumer = kafka.consumer({
  groupId: 'notification-group',
});

async function start() {
  await consumer.connect();

  console.log('✅ Notification Service Connected');

  await consumer.subscribe({
    topic: 'loan-created',
    fromBeginning: true,
  });

  await consumer.subscribe({
    topic: 'loan-approved',
    fromBeginning: true,
  });

  await consumer.subscribe({
    topic: 'loan-rejected',
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const data = JSON.parse(message.value.toString());

      console.log('--------------------------------');
      console.log(`📨 Event: ${topic}`);
      console.log(data);

      switch (topic) {
        case 'loan-created':
          console.log(
            `📧 Loan application received from customer ${data.customerId}`
          );
          break;

        case 'loan-approved':
          console.log(
            `✅ Loan approved for customer ${data.customerId}`
          );
          break;

        case 'loan-rejected':
          console.log(
            `❌ Loan rejected for customer ${data.customerId}`
          );
          break;
      }
    },
  });
}

start().catch(console.error);
