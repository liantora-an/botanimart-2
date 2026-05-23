// @ts-ignore
import midtransClient from 'midtrans-client';
import { MIDTRANS_SERVER_KEY, MIDTRANS_CLIENT_KEY, IS_PRODUCTION } from '../config/midtrans';

// Create Core API / Snap instance
export const snap = new midtransClient.Snap({
  isProduction: IS_PRODUCTION,
  serverKey: MIDTRANS_SERVER_KEY,
  clientKey: MIDTRANS_CLIENT_KEY
});

export const coreApi = new midtransClient.CoreApi({
  isProduction: IS_PRODUCTION,
  serverKey: MIDTRANS_SERVER_KEY,
  clientKey: MIDTRANS_CLIENT_KEY
});
