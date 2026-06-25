const { Kafka } = require('kafkajs');
require('dotenv').config();

console.log('Payment Kafka broker:', process.env.KAFKA_BROKER);

const kafka = new Kafka({
  clientId: 'cashmate-payment-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:29092'],
});

const producer = kafka.producer();

let isConnected = false;

const connectProducer = async () => {
  if (!isConnected) {
    await producer.connect();
    isConnected = true;
    console.log('✅ Payment Service Kafka Producer connected');
  }
};

const publishEvent = async (topic, payload) => {
  try {
    await connectProducer();

    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(payload) }],
    });

    console.log(`📨 Event published: ${topic}`);
  } catch (err) {
    console.error('Kafka publish error:', err.message);
  }
};

module.exports = { publishEvent };