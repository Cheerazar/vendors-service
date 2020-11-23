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
