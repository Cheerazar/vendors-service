import { Channel, Connection, Replies } from 'amqplib/callback_api';
import CircuitBreaker from 'opossum';
import { createEvent } from '../../db/events/createEvent';
import { updateEvent } from '../../db/events/updateEvent';
import { EVENT_CREATED_TOPIC, EVENT_MODIFIED_TOPIC } from '../constants';
import { createConnection } from '../createConnection';

export async function receiveEvents() {
  const connection = await createConnection();
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }

    channel.assertExchange(EVENT_CREATED_TOPIC, 'topic', {
      durable: true,
    });
    channel.assertExchange(EVENT_MODIFIED_TOPIC, 'topic', {
      durable: true,
    });
    channel.assertQueue(
      '',
      {
        exclusive: true,
      },
      function (error2, q) {
        if (error2) {
          throw error2;
        }

        [EVENT_CREATED_TOPIC, EVENT_MODIFIED_TOPIC].forEach(function (key) {
          channel.bindQueue(q.queue, key, key);
        });

        channel.consume(
          q.queue,
          async function (msg) {
            switch (msg?.fields.routingKey) {
              case EVENT_CREATED_TOPIC:
                return createEvent(JSON.parse(msg.content.toString()));
              case EVENT_MODIFIED_TOPIC:
                return updateEvent(JSON.parse(msg.content.toString()));
              default:
                break;
            }
            console.log(
              "EVENTS: [x] %s:'%s'",
              // @ts-ignore
              msg.fields.routingKey,
              // @ts-ignore
              msg.content.toString(),
            );
          },
          {
            noAck: true,
          },
        );
      },
    );
  });
}

export function createChannel(connection: Connection): Promise<Channel> {
  return new Promise((resolve, reject) => {
    connection.createChannel(function (error1, channel) {
      if (error1) {
        return reject(error1);
      }

      resolve(channel);
    });
  });
}

export async function assertQueue(
  channel: Channel,
): Promise<Replies.AssertQueue> {
  return new Promise((resolve, reject) => {
    channel.assertQueue(
      '',
      {
        exclusive: true,
      },
      function (error2, q) {
        if (error2) {
          return reject(error2);
        }

        resolve(q);
      },
    );
  });
}

async function createRabbitConnection() {
  try {
    const connection = await createConnection();
    const channel = await createChannel(connection);
    const q = await assertQueue(channel);

    return [channel, q] as const;
  } catch (error) {
    throw error;
  }
}

const breakerOptions = {
  timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
  errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
  resetTimeout: 30000, // After 30 seconds, try again.
};

export async function receiveEventsWithBreaker() {
  const breaker = new CircuitBreaker(createRabbitConnection, breakerOptions);
  let channel: Channel, q: Replies.AssertQueue;
  try {
    [channel, q] = await breaker.fire();
  } catch (error) {
    throw new Error('Connecting to rabbit failed');
  }
  [EVENT_CREATED_TOPIC, EVENT_MODIFIED_TOPIC].forEach(function (key) {
    channel.bindQueue(q.queue, key, key);
  });

  channel.consume(
    q.queue,
    async function (msg) {
      switch (msg?.fields.routingKey) {
        case EVENT_CREATED_TOPIC:
          return createEvent(JSON.parse(msg.content.toString()));
        case EVENT_MODIFIED_TOPIC:
          return updateEvent(JSON.parse(msg.content.toString()));
        default:
          break;
      }
      console.log(
        "EVENTS: [x] %s:'%s'",
        // @ts-ignore
        msg.fields.routingKey,
        // @ts-ignore
        msg.content.toString(),
      );
    },
    {
      noAck: true,
    },
  );
}
