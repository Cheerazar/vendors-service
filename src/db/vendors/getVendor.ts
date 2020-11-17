import { getDbConnection } from '..';
import { Vendor } from '../entities/vendor';

export async function getVendor(id: number): Promise<Vendor | undefined> {
  try {
    const connection = await getDbConnection();
    return connection.manager.findOne(Vendor, id);
  } catch (error) {
    throw new Error(`Error fetching vendor with id ${id}: ${error.message}`);
  }
}
