require('dotenv').config();

const express = require('express');
const { Kafka } = require('kafkajs');

const notificationRoutes = require('./routes/notification.routes');
const Notification = require('./models/notification.model');

const app = express();
const PORT = process.env.PORT || 3006;

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'notification-service',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/notifications', notificationRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: `Route ${req.method} ${req.path} not found`,
  });
});

app.use((err, req, res, next) => {
  console.error('[ERROR]', err);

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Notification Service running on port ${PORT}`);
});

const kafka = new Kafka({
  clientId: 'cashmate-notification-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

const consumer = kafka.consumer({
  groupId: 'notification-group',
});

const buildNotification = (topic, data) => {
  switch (topic) {
    case 'loan-created':
      return {
        type: topic,
        title: 'Loan Submitted',
        message: `Loan application created for customer ${data.customerId}`,
        status: 'unread',
        payload: data,
      };

    case 'loan-approved':
      return {
        type: topic,
        title: 'Loan Approved',
        message: `Loan approved for customer ${data.customerId}`,
        status: 'unread',
        payload: data,
      };

    case 'loan-rejected':
      return {
        type: topic,
        title: 'Loan Rejected',
        message: `Loan rejected for customer ${data.customerId}`,
        status: 'unread',
        payload: data,
      };

    case 'disbursement-completed':
      return {
        type: topic,
        title: 'Loan Disbursed',
        message: `Loan disbursement completed for customer ${data.customerId}`,
        status: 'unread',
        payload: data,
      };

    case 'payment-completed':
      return {
        type: topic,
        title: 'Payment Received',
        message: `Payment received from customer ${data.customerId}`,
        status: 'unread',
        payload: data,
      };

    case 'payment-failed':
      return {
        type: topic,
        title: 'Payment Failed',
        message: `Payment failed for customer ${data.customerId}`,
        status: 'unread',
        payload: data,
      };

    default:
      return {
        type: topic,
        title: 'Platform Event',
        message: `Unknown event received: ${topic}`,
        status: 'unread',
        payload: data,
      };
  }
};

async function startConsumer() {
  try {
    await consumer.connect();

    console.log('✅ Notification Service Kafka Consumer connected');

    const topics = [
      'loan-created',
      'loan-approved',
      'loan-rejected',
      'disbursement-completed',
      'payment-completed',
      'payment-failed',
    ];

    for (const topic of topics) {
      await consumer.subscribe({
        topic,
        fromBeginning: false,
      });
    }

    console.log('✅ Kafka subscriptions ready');

    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        const data = JSON.parse(message.value.toString());

        console.log('--------------------------------');
        console.log(`📨 Event: ${topic}`);
        console.log(data);

        const notification = buildNotification(topic, data);
        await Notification.create(notification);

        console.log(`✅ Notification saved: ${notification.title}`);
      },
    });
  } catch (error) {
    console.error('❌ Notification Service Error:', error);
  }
}

startConsumer();