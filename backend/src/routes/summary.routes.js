import { Router } from 'express';
import { asyncHandler, sendSupabaseError } from '../utils/http.js';
import { calculateSummary } from '../services/financial.service.js';
const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  const [txResult, budgetResult, goalResult] = await Promise.all([
    req.supabase.from('transactions').select('amount,type,category,date,status,is_budget_eligible').limit(2000),
    req.supabase.from('budgets').select('id,category,limit_amount,period,color,icon'),
    req.supabase.from('financial_goals').select('status'),
  ]);
  const error = txResult.error || budgetResult.error || goalResult.error;
  if (error) return sendSupabaseError(res, error, 'Could not load financial summary');
  return res.json(calculateSummary(txResult.data || [], budgetResult.data || [], goalResult.data || []));
}));
export default router;
