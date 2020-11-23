import { getDbConnection } from '..';
import { UpdateMezzanine } from '../../locations/types';
import { Mezzanine } from '../entities/mezzanine';

export async function updateMezzanine(
  params: UpdateMezzanine,
): Promise<Mezzanine> {
  try {
    const connection = await getDbConnection();
    const mezzanineToUpdate = await connection.manager.findOne(
      Mezzanine,
      params.id,
    );

    if (!mezzanineToUpdate) {
      throw new Error();
    }

    if (params.floorNum) {
      mezzanineToUpdate.floorNum = params.floorNum;
    }

    if (params.locationId) {
      mezzanineToUpdate.locationId = params.locationId;
    }

    if (params.maxPossibleBoothSpaces) {
      mezzanineToUpdate.maxPossibleBoothSpaces = params.maxPossibleBoothSpaces;
    }

    return connection.manager.save(mezzanineToUpdate);
  } catch (error) {
    if (error.message.includes('fields to update')) {
      throw error;
    }

    throw new Error(`Error getting mezzanine with id: ${params.id}`);
  }
}
