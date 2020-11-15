import { PaymentInfo } from '../payments/types';

export type BoothAssignment = {
  boothNumber: number;
  mezzanine: number;
};

export type VendorInformation = {
  id: number;
  companyName: string;
  eventName: string;
  boothAssignment: BoothAssignment;
};

export type CreateVendorInfo = Omit<VendorInformation, 'id'> & {
  paymentInfo: PaymentInfo;
};

export type PatchVendorInfo = Omit<VendorInformation, 'id' | 'companyName'>;
