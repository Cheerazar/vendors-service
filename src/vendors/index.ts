import { Request, Router } from 'express';
import { CreateVendorInfo, PatchVendorInfo } from './types';
import { createVendorData, createVendorDataForEvent } from './stubData';

export const vendorsRouter = Router();

vendorsRouter.post(
  '/v1/vendors',
  (req: Request<{}, {}, CreateVendorInfo>, res) => {
    res.sendStatus(201);
  },
);

vendorsRouter.get('/v1/vendors/:id', (req: Request<{ id: string }>, res) => {
  res.status(200).json(createVendorData(parseInt(req.params.id, 10)));
});

vendorsRouter.get(
  '/v1/vendors',
  (req: Request<{}, {}, {}, { eventName: string }>, res) => {
    res.status(200).json(createVendorDataForEvent(req.query.eventName));
  },
);

vendorsRouter.patch(
  '/v1/vendors/:id',
  (req: Request<{ id: string }, {}, PatchVendorInfo>, res) => {
    res.sendStatus(201);
  },
);
