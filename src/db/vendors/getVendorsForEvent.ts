import { getDbConnection } from '..';
import { Vendor } from '../entities/vendor';

export async function getVendorsForEvent(
  eventName: string,
): Promise<Vendor[] | undefined> {
  const connection = await getDbConnection();

  try {
    const vendorRepository = await connection.manager.getRepository(Vendor);
    return vendorRepository.find({ eventName });
  } catch (error) {
    throw new Error(`Error getting vendors for ${eventName}.`);
  }
}
