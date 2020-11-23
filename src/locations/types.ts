export type CreateMezzanine = {
  id: string;
  floorNum: string;
  maxPossibleBoothSpaces: number;
  locationId: string;
};

export type UpdateMezzanine = {
  id: string;
  floorNum?: string;
  maxPossibleBoothSpaces?: number;
  locationId: string;
};
