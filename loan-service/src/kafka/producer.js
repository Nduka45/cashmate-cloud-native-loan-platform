const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'cashmate-loan-service',
  brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
});

const producer = kafka.producer();

let connected = false;

const connectProducer = async () => {
  if (!connected) {
    await producer.connect();
    connected = true;
    console.log('✅ Kafka Producer Connected');
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
  } catch (error) {
    console.error('Kafka publish error:', error.message);
  }
};

module.exports = {
  publishEvent,
};
