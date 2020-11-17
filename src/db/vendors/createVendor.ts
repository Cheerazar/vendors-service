import { getDbConnection } from '..';
import { CreateVendorInfo } from '../../vendors/types';
import { Vendor } from '../entities/vendor';
export async function createVendor(
  info: Omit<CreateVendorInfo, 'paymentInfo'>,
): Promise<Vendor> {
  const dbConnection = await getDbConnection();

  let vendor = new Vendor();

  try {
    vendor.boothNumber = info.boothAssignment?.boothNumber;
    vendor.companyName = info.companyName;
    vendor.eventName = info.eventName;
    vendor.mezzanine = info.boothAssignment?.mezzanine;

    return dbConnection.manager.save(vendor);
  } catch (error) {
    throw new Error(`Error creating vendor: ${error.message}`);
  }
}
