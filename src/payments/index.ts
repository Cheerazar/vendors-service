import { PaymentInfo } from './types';

/**
 * Process a vendor creation payment. Per the requirements document
 * the payment information should be auto approved.
 * @param {PaymentInfo}
 * @returns {Promise}
 */
export async function processPayment({}: PaymentInfo): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), Math.floor(Math.random() * 3000));
  });
}
