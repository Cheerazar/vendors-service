import amqp from 'amqplib/callback_api';

export function createConnection(): Promise<amqp.Connection> {
  return new Promise((resolve, reject) => {
    amqp.connect('amqp://localhost', function (error0, connection) {
      if (error0) {
        return reject(error0);
      }

      resolve(connection);
    });
  });
}
