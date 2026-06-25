require('dotenv').config();

const express = require('express');
const { Kafka } = require('kafkajs');

//
// -------------------------------------
// Health Server
// -------------------------------------
//

const app = express();
const PORT = process.env.PORT || 3006;

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'notification-service',
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(
    `🚀 Notification Health Server running on port ${PORT}`
  );
});

//
// -------------------------------------
// Kafka Consumer
// -------------------------------------
//

const kafka = new Kafka({
  clientId: 'cashmate-notification-service',
  brokers: [
    process.env.KAFKA_BROKER || 'localhost:9092',
  ],
});

const consumer = kafka.consumer({
  groupId: 'notification-group',
});

async function start() {
  try {
    await consumer.connect();

    console.log('✅ Notification Service Connected');

    await consumer.subscribe({
      topic: 'loan-created',
      fromBeginning: false,
    });

    await consumer.subscribe({
      topic: 'loan-approved',
      fromBeginning: false,
    });

    await consumer.subscribe({
      topic: 'loan-rejected',
      fromBeginning: false,
    });

    await consumer.subscribe({
      topic: 'disbursement-completed',
      fromBeginning: false,
    });

    await consumer.subscribe({
      topic: 'payment-completed',
      fromBeginning: false,
    });

    await consumer.subscribe({
      topic: 'payment-failed',
      fromBeginning: false,
    });

    console.log('✅ Kafka subscriptions ready');

    await consumer.run({
      eachMessage: async ({
        topic,
        partition,
        message,
      }) => {
        const data = JSON.parse(
          message.value.toString()
        );

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

          case 'disbursement-completed':
            console.log(
              `💸 Loan disbursed to customer ${data.customerId}`
            );
            break;

          case 'payment-completed':
            console.log(
              `💰 Payment received from customer ${data.customerId}`
            );
            break;

          case 'payment-failed':
            console.log(
              `⚠️ Payment failed for customer ${data.customerId}`
            );
            break;

          default:
            console.log(
              `Unknown event received: ${topic}`
            );
        }
      },
    });
  } catch (error) {
    console.error(
      '❌ Notification Service Error:',
      error
    );
  }
}

start();