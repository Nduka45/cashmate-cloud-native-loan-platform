const { Kafka } = require('kafkajs');
require('dotenv').config();

const kafka = new Kafka({
  clientId: 'cashmate-loan-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

const producer = kafka.producer();

let isConnected = false;

const connectProducer = async () => {
  if (!isConnected) {
    await producer.connect();
    isConnected = true;
    console.log('✅ Loan Service Kafka Producer connected');
  }
};

const publishEvent = async (topic, payload) => {
  try {
    await connectProducer();

    await producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify(payload),
        },
      ],
    });

    console.log(`📨 Event published: ${topic}`);
  } catch (err) {
    console.error('Kafka publish error:', err.message);
  }
};

module.exports = {
  publishEvent,
};