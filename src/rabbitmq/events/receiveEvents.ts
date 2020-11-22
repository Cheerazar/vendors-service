import amqp from 'amqplib/callback_api';
import { EVENT_CREATED_TOPIC, EVENT_MODIFIED_TOPIC } from '../constants';

export function receiveEvents() {
  amqp.connect('amqp://localhost', function (error0, connection) {
    if (error0) {
      throw error0;
    }

    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }
      console.log('started litening maybe?');
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
            function (msg) {
              console.log(
                " [x] %s:'%s'",
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
  });
}
