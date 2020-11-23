import { getDbConnection } from '..';
import { CreateVendorInfo } from '../../vendors/types';
import { Vendor } from '../entities/vendor';

export async function createVendor(
  info: Omit<CreateVendorInfo, 'paymentInfo'>,
): Promise<Vendor> {
  try {
    const dbConnection = await getDbConnection();

    let vendor = new Vendor();

    vendor.boothNumber = info.boothAssignment?.boothNumber;
    vendor.companyName = info.companyName;
    vendor.eventName = info.eventName;
    vendor.mezzanine = info.boothAssignment?.mezzanine;

    return dbConnection.manager.save(vendor);
  } catch (error) {
    if (error.message.includes('finding event')) {
      throw error;
    }

    throw new Error(`Error creating vendor: ${error.message}`);
  }
}
