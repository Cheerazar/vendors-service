import { getDbConnection } from '.';
import { CreateVendorInfo, VendorInformation } from '../vendors/types';
import { Vendor } from './entities/vendor';
export async function createVendor(
  info: Omit<CreateVendorInfo, 'paymentInfo'>,
): Promise<void> {
  const dbConnection = await getDbConnection();

  let vendor = new Vendor();

  try {
    vendor.boothNumber = info.boothAssignment?.boothNumber;
    vendor.companyName = info.companyName;
    vendor.eventName = info.eventName;
    vendor.mezzanine = info.boothAssignment?.mezzanine;

    await dbConnection.manager.save(vendor);
    console.log(`Vendor has been saved! ${vendor.id}`);
  } catch (error) {
    throw new Error(`Error creating vendor: ${error.message}`);
  }
}
