import { getDbConnection } from '..';
import { UpdateEvent } from '../../events/types';
import { Event } from '../entities/event';

export async function updateEvent(params: UpdateEvent): Promise<Event> {
  try {
    const connection = await getDbConnection();
    const eventToUpdate = await connection.manager.findOne(Event, params.id);

    if (!eventToUpdate) {
      throw new Error();
    }

    if (params.availableBooths) {
      eventToUpdate.availableBooths = params.availableBooths;
    }

    if (params.locationId) {
      eventToUpdate.locationId = params.locationId;
    }

    if (params.name) {
      eventToUpdate.name = params.name;
    }

    return connection.manager.save(eventToUpdate);
  } catch (error) {
    if (error.message.includes('fields to update')) {
      throw error;
    }

    throw new Error(`Error getting event with id: ${params.id}`);
  }
}
