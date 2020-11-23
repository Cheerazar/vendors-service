import { Request, Router } from 'express';
import { CreateVendorInfo, PatchVendorInfo } from './types';
import { createVendor } from '../db/vendors/createVendor';
import { processPayment } from '../payments';
import { getVendor } from '../db/vendors/getVendor';
import { getVendorsForEvent } from '../db/vendors/getVendorsForEvent';
import { updateVendor } from '../db/vendors/updateVendor';
import { emitVendorCreated } from '../rabbitmq/vendors/emitVendorCreated';
import { verifyCanCreateNewVendor } from './verifyCanCreateNewVendor';

export const vendorsRouter = Router();

vendorsRouter.post(
  '/v1/vendors',
  async (req: Request<{}, {}, CreateVendorInfo>, res) => {
    try {
      const { paymentInfo, ...vendorInfo } = req.body;
      await verifyCanCreateNewVendor(vendorInfo.eventName);
      const newVendor = await createVendor(vendorInfo);
      await processPayment(paymentInfo);
      emitVendorCreated(newVendor);
      res.status(201).json(newVendor);
    } catch (error) {
      if (error.message.includes('ER_NO_DEFAULT_FOR_FIELD')) {
        return res
          .status(403)
          .send('Request body is missing required parameters.');
      }

      if (error.message.includes('vendor capacity')) {
        return res.status(403).send(error.message);
      }

      res.sendStatus(404);
    }
  },
);

vendorsRouter.get(
  '/v1/vendors/:id',
  async (req: Request<{ id: string }>, res) => {
    try {
      const maybeVendor = await getVendor(parseInt(req.params.id));
      res.status(200).json({ vendor: maybeVendor ? maybeVendor : null });
    } catch (error) {
      res.status(404).send(error.message);
    }
  },
);

vendorsRouter.get(
  '/v1/vendors',
  async (req: Request<{}, {}, {}, { eventName: string }>, res) => {
    try {
      const maybeVendors = await getVendorsForEvent(req.query.eventName);
      res.status(200).json({ vendors: maybeVendors ? maybeVendors : null });
    } catch (error) {
      res.status(404).send(error.message);
    }
  },
);

vendorsRouter.patch(
  '/v1/vendors/:id',
  async (req: Request<{ id: string }, {}, PatchVendorInfo>, res) => {
    try {
      const updatedVendor = await updateVendor(
        parseInt(req.params.id),
        req.body,
      );
      res.status(201).json(updatedVendor);
    } catch (error) {
      res.status(404).send(error.message);
    }
  },
);
