import { getDbConnection } from '../db';
import { Event } from '../db/entities/event';
import { Vendor } from '../db/entities/vendor';

export async function verifyCanCreateNewVendor(
  eventName: string,
): Promise<void> {
  try {
    const connection = await getDbConnection();
    const event = await connection.manager.findOneOrFail(Event, eventName);
    const [_, vendorCount] = await connection.manager.findAndCount(Vendor, {
      eventName: eventName,
    });

    if (event.availableBooths > vendorCount) {
      return Promise.resolve();
    }

    throw new Error(`At vendor capacity for ${eventName}`);
  } catch (error) {
    throw error;
  }
}
