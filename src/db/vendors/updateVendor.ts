import { getDbConnection } from '..';
import { PatchVendorInfo } from '../../vendors/types';
import { Vendor } from '../entities/vendor';

export async function updateVendor(
  id: number,
  infoToUpdate: PatchVendorInfo,
): Promise<Vendor> {
  // update vendor and return it
  try {
    if (
      !infoToUpdate.companyName &&
      !infoToUpdate.boothAssignment?.boothNumber &&
      !infoToUpdate.boothAssignment?.mezzanine
    ) {
      throw new Error(`No fields to update provided for vendor with id: ${id}`);
    }
    const connection = await getDbConnection();
    const vendorToUpdate = await connection.manager.findOneOrFail(Vendor, id);

    if (infoToUpdate.boothAssignment?.boothNumber) {
      vendorToUpdate.boothNumber = infoToUpdate.boothAssignment.boothNumber;
    }
    if (infoToUpdate.boothAssignment?.mezzanine) {
      vendorToUpdate.mezzanine = infoToUpdate.boothAssignment.mezzanine;
    }
    if (infoToUpdate.companyName) {
      vendorToUpdate.companyName = infoToUpdate.companyName;
    }

    return connection.manager.save(vendorToUpdate);
  } catch (error) {
    if (error.message.includes('fields to update')) {
      throw error;
    }

    throw new Error(`Error getting vendor with id: ${id}.`);
  }
}
