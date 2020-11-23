import { getDbConnection } from '..';
import { CreateMezzanine } from '../../locations/types';
import { Mezzanine } from '../entities/mezzanine';

export async function createMezzanine(
  params: CreateMezzanine,
): Promise<Mezzanine> {
  const dbConnection = await getDbConnection();

  let mezzanine = new Mezzanine();

  try {
    mezzanine.id = params.id;
    mezzanine.maxPossibleBoothSpaces = params.maxPossibleBoothSpaces;
    mezzanine.locationId = params.locationId;
    mezzanine.floorNum = params.floorNum;

    return dbConnection.manager.save(mezzanine);
  } catch (error) {
    throw new Error(`Error creating vendor: ${error.message}`);
  }
}
