import { Request, Router } from 'express';
import { CreateVendorInfo, PatchVendorInfo } from './types';
import { createVendorData, createVendorDataForEvent } from './stubData';
import { createVendor } from '../db/createVendor';
import { processPayment } from '../payments';

export const vendorsRouter = Router();

vendorsRouter.post(
  '/v1/vendors',
  async (req: Request<{}, {}, CreateVendorInfo>, res) => {
    try {
      const { paymentInfo, ...vendorInfo } = req.body;
      // Still need to add verifying that creating this vendor won't exceed the limit
      await createVendor(vendorInfo);
      await processPayment(paymentInfo);
      res.sendStatus(201);
    } catch (error) {
      if (error.message.includes('ER_NO_DEFAULT_FOR_FIELD')) {
        return res
          .status(403)
          .send('Request body is missing required parameters.');
      }

      res.sendStatus(404);
    }
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
