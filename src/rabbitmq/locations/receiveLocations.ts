import { createMezzanine } from '../../db/locations/createMezzanine';
import { updateMezzanine } from '../../db/locations/updateMezzanine';
import { LOCATION_CREATED_TOPIC, LOCATION_MODIFIED_TOPIC } from '../constants';
import { createConnection } from '../createConnection';

export async function receiveLocations() {
  const connection = await createConnection();
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }

    channel.assertExchange(LOCATION_CREATED_TOPIC, 'topic', {
      durable: true,
    });
    channel.assertExchange(LOCATION_MODIFIED_TOPIC, 'topic', {
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

        [LOCATION_CREATED_TOPIC, LOCATION_MODIFIED_TOPIC].forEach(function (
          key,
        ) {
          channel.bindQueue(q.queue, key, key);
        });

        channel.consume(
          q.queue,
          async function (msg) {
            switch (msg?.fields.routingKey) {
              case LOCATION_CREATED_TOPIC:
                return createMezzanine(JSON.parse(msg.content.toString()));
              case LOCATION_MODIFIED_TOPIC:
                return updateMezzanine(JSON.parse(msg.content.toString()));
              default:
                break;
            }

            console.log(
              "LOCATIONS: [x] %s:'%s'",
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
