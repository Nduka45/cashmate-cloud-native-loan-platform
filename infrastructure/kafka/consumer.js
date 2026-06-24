const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'cashmate',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

const createConsumer = async (
  groupId,
  topic,
  messageHandler
) => {
  const consumer = kafka.consumer({ groupId });

  await consumer.connect();
  await consumer.subscribe({
    topic,
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const payload = JSON.parse(
        message.value.toString()
      );

      await messageHandler(payload);
    },
  });

  return consumer;
};

module.exports = { createConsumer };