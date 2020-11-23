import { getDbConnection } from '..';
import { CreateEvent } from '../../events/types';
import { Event } from '../entities/event';

export async function createEvent(params: CreateEvent): Promise<Event> {
  const dbConnection = await getDbConnection();

  let event = new Event();

  try {
    event.id = params.id;
    event.availableBooths = params.availableBooths;
    event.locationId = params.locationId;
    event.name = params.name;

    return dbConnection.manager.save(event);
  } catch (error) {
    throw new Error(`Error creating vendor: ${error.message}`);
  }
}
