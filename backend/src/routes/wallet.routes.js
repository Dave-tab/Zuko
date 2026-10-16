import { Router } from 'express';
import { asyncHandler } from '../utils/http.js';
import { env } from '../config/env.js';
const router = Router();

router.get('/balance', asyncHandler(async (_req, res) => {
  // Do not invent a balance. Wire this to the confirmed BMONI sandbox contract
  // after the organizers provide credentials and the exact endpoint response.
  if (!env.bmoniApiKey) {
    return res.status(503).json({
      error: 'wallet_provider_not_configured',
      message: 'BMONI sandbox is not configured yet. No wallet balance is being reported.',
      available_balance: null,
      currency: 'NGN',
    });
  }
  return res.status(501).json({
    error: 'wallet_provider_not_implemented',
    message: 'BMONI credentials are present, but the endpoint contract must be verified before enabling balance retrieval.',
    available_balance: null,
    currency: 'NGN',
  });
}));
export default router;
