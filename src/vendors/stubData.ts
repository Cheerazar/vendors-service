import { VendorInformation } from './types';

export function createVendorData(
  id: number,
  eventName: string = 'Triwizard Tournament',
): VendorInformation {
  return {
    id,
    eventName,
    boothAssignment: {
      boothNumber: 5,
      mezzanine: 2,
    },
    companyName: 'Hogwarts School of Witchcraft and Wizardry',
  };
}

export function createVendorDataForEvent(
  eventName: string,
): VendorInformation[] {
  return new Array(Math.floor(Math.random() * 5))
    .fill(null)
    .map((_, idx) => createVendorData(idx, eventName));
}
