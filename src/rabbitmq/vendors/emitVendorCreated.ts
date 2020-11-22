import amqp from 'amqplib/callback_api';
import { Vendor } from '../../db/entities/vendor';
import { VENDOR_CREATED_TOPIC } from '../constants';

export function emitVendorCreated(vendorInfo: Vendor) {
  amqp.connect('amqp://localhost', function (error0, connection) {
    if (error0) {
      throw error0;
    }

    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }

      channel.assertExchange(VENDOR_CREATED_TOPIC, 'topic', {
        durable: true,
      });
      channel.publish(
        VENDOR_CREATED_TOPIC,
        VENDOR_CREATED_TOPIC,
        Buffer.from(JSON.stringify(vendorInfo)),
      );
      console.log(
        " [x] Sent %s: '%s'",
        VENDOR_CREATED_TOPIC,
        JSON.stringify(vendorInfo, null, 4),
      );
    });
  });
}
