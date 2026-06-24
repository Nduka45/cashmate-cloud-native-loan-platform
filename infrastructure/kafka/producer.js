const { Kafka } = require('kafkajs');

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