const { Kafka } = require('kafkajs');
require('dotenv').config();

console.log("==========");
console.log("Kafka broker:", process.env.KAFKA_BROKER);
console.log("==========");

const kafka = new Kafka({
  clientId: 'cashmate',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

const producer = kafka.producer();

const connectProducer = async () => {
  await producer.connect();
  console.log('✅ Kafka Producer Connected');
};

const publishEvent = async (topic, payload) => {
  await producer.send({
    topic,
    messages: [
      {
        value: JSON.stringify(payload),
      },
    ],
  });
};

module.exports = {
  connectProducer,
  publishEvent,
};