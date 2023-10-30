import * as amqp from 'amqplib';
import { BrowserWindow } from 'electron';

const MQ_URL = 'amqp://admin:admin@13.41.186.178:5672/';
let amqpConn: amqp.Connection | null = null;
let pubChannel: amqp.Channel | null = null;
const offlinePubQueue: Array<{ exchange: string; routingKey: string; content: Buffer }> = [];

const createChannel = async (conn: amqp.Connection): Promise<amqp.Channel> => {
  const channel = await conn.createConfirmChannel();
  channel.on('error', (err) => console.error('[AMQP] channel error', err.message));
  channel.on('close', () => console.log('[AMQP] channel closed'));
  return channel;
};


const publish = (exchange: string, routingKey: string, content: Buffer): void => {
  try {
    pubChannel?.publish(exchange, routingKey, content, { persistent: true });
  } catch (err: any) {
    console.error('[AMQP] publish', err);
    offlinePubQueue.push({ exchange, routingKey, content });
    pubChannel?.close();
  }
};

const setupConsumer = async (channel: amqp.Channel, window: BrowserWindow): Promise<void> => {
  await channel.assertQueue('serial', { durable: true });
  channel.prefetch(1);

  channel.consume('serial', (msg) => {
    if (!msg) return;
    const content = msg.content.toString();
    window.webContents.send('event', content);
    channel.ack(msg);
  });
};

export const setupRabbitMQ = async (window: BrowserWindow): Promise<void> => {
  try {
    amqpConn = await amqp.connect(MQ_URL);
    pubChannel = await createChannel(amqpConn);

    // Initialize the consumer
    setupConsumer(pubChannel, window);

    // Publish any offline messages
    while (offlinePubQueue.length > 0) {
      const { exchange, routingKey, content } = offlinePubQueue.shift() as any;
      publish(exchange, routingKey, content);
    }
  } catch (err: any) {
    console.error('[AMQP ERROR]', err.message);
    setTimeout(() => setupRabbitMQ(window), 1000);
  }
};

export const publishToQueue = (exchange: string, routingKey: string, content: string): void => {
  const bufferContent = Buffer.from(content);
  publish(exchange, routingKey, bufferContent);
};
