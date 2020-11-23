export type CreateEvent = {
  id: string;
  name: string;
  availableBooths: number;
  locationId: string;
};

export type UpdateEvent = {
  id: string;
  name?: string;
  availableBooths?: number;
  locationId?: string;
};
