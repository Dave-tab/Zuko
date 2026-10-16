import { Router } from 'express';
import { asyncHandler, sendSupabaseError } from '../utils/http.js';
import { calculateBudgetStatus } from '../services/financial.service.js';
const router = Router();

async function loadBudgetStatus(supabase, budgetRows) {
  if (!budgetRows.length) return [];
  const { data: transactions, error } = await supabase.from('transactions').select('amount,type,category,date,status,is_budget_eligible').limit(2000);
  if (error) throw error;
  return budgetRows.map((budget) => calculateBudgetStatus(budget, transactions || []));
}

router.get('/', asyncHandler(async (req, res) => {
  const { data, error } = await req.supabase.from('budgets').select('*').order('created_at', { ascending: false });
  if (error) return sendSupabaseError(res, error, 'Could not load budgets');
  try { return res.json(await loadBudgetStatus(req.supabase, data)); }
  catch (e) { return sendSupabaseError(res, e, 'Could not calculate budget spending'); }
}));

router.post('/', asyncHandler(async (req, res) => {
  const { category, limit, period = 'monthly', color, icon } = req.body || {};
  const amount = Number(limit);
  if (!String(category || '').trim()) return res.status(400).json({ error: 'validation_error', message: 'category is required.' });
  if (!Number.isFinite(amount) || amount <= 0) return res.status(400).json({ error: 'validation_error', message: 'limit must be greater than zero.' });
  if (!['monthly', 'weekly', 'semester'].includes(period)) return res.status(400).json({ error: 'validation_error', message: 'period is invalid.' });
  const { data, error } = await req.supabase.from('budgets').insert({ user_id: req.user.id, category, limit_amount: amount, period, color: color || null, icon: icon || null }).select('*').single();
  if (error) return sendSupabaseError(res, error, error.code === '23505' ? 'A budget already exists for this category and period.' : 'Could not create budget');
  try { return res.status(201).json((await loadBudgetStatus(req.supabase, [data]))[0]); }
  catch (e) { return sendSupabaseError(res, e, 'Budget was saved but its spending could not be calculated'); }
}));

router.put('/:id', asyncHandler(async (req, res) => {
  const body = req.body || {};
  const updates = {};
  if (body.category !== undefined) updates.category = body.category;
  if (body.limit !== undefined) {
    const limit = Number(body.limit);
    if (!Number.isFinite(limit) || limit <= 0) return res.status(400).json({ error: 'validation_error', message: 'limit must be greater than zero.' });
    updates.limit_amount = limit;
  }
  if (body.period !== undefined) {
    if (!['monthly', 'weekly', 'semester'].includes(body.period)) return res.status(400).json({ error: 'validation_error', message: 'period is invalid.' });
    updates.period = body.period;
  }
  if (body.color !== undefined) updates.color = body.color;
  if (body.icon !== undefined) updates.icon = body.icon;
  const { data, error } = await req.supabase.from('budgets').update(updates).eq('id', req.params.id).select('*').maybeSingle();
  if (error) return sendSupabaseError(res, error, 'Could not update budget');
  if (!data) return res.status(404).json({ error: 'not_found', message: 'Budget not found.' });
  try { return res.json((await loadBudgetStatus(req.supabase, [data]))[0]); }
  catch (e) { return sendSupabaseError(res, e, 'Budget was updated but its spending could not be calculated'); }
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const { error } = await req.supabase.from('budgets').delete().eq('id', req.params.id);
  if (error) return sendSupabaseError(res, error, 'Could not delete budget');
  return res.status(204).send();
}));
export default router;
