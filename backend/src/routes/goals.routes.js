import { Router } from 'express';
import { asyncHandler, sendSupabaseError } from '../utils/http.js';
const router = Router();

function normalizeGoal(row) {
  return { id: row.id, title: row.title, targetAmount: Number(row.target_amount), currentAmount: Number(row.current_amount), targetDate: row.target_date || '', category: row.category, status: row.status, color: row.color || undefined, icon: row.icon || undefined, description: row.description || undefined };
}

router.get('/', asyncHandler(async (req, res) => {
  const { data, error } = await req.supabase.from('financial_goals').select('*').order('created_at', { ascending: false });
  if (error) return sendSupabaseError(res, error, 'Could not load goals');
  return res.json(data.map(normalizeGoal));
}));

router.post('/', asyncHandler(async (req, res) => {
  const b = req.body || {};
  const targetAmount = Number(b.targetAmount);
  const currentAmount = b.currentAmount === undefined ? 0 : Number(b.currentAmount);
  if (!String(b.title || '').trim() || !String(b.category || '').trim()) return res.status(400).json({ error: 'validation_error', message: 'title and category are required.' });
  if (!Number.isFinite(targetAmount) || targetAmount <= 0 || !Number.isFinite(currentAmount) || currentAmount < 0) return res.status(400).json({ error: 'validation_error', message: 'Goal amounts must be valid; targetAmount must be greater than zero.' });
  const status = b.status || 'in_progress';
  if (!['in_progress', 'completed', 'paused'].includes(status)) return res.status(400).json({ error: 'validation_error', message: 'status is invalid.' });
  const { data, error } = await req.supabase.from('financial_goals').insert({ user_id: req.user.id, title: b.title.trim(), target_amount: targetAmount, current_amount: currentAmount, target_date: b.targetDate || null, category: b.category, status, color: b.color || null, icon: b.icon || null, description: b.description || null }).select('*').single();
  if (error) return sendSupabaseError(res, error, 'Could not create goal');
  return res.status(201).json(normalizeGoal(data));
}));

router.put('/:id', asyncHandler(async (req, res) => {
  const b = req.body || {};
  const updates = {};
  if (b.title !== undefined) updates.title = String(b.title).trim();
  if (b.targetAmount !== undefined) {
    const n = Number(b.targetAmount); if (!Number.isFinite(n) || n <= 0) return res.status(400).json({ error: 'validation_error', message: 'targetAmount must be greater than zero.' });
    updates.target_amount = n;
  }
  if (b.currentAmount !== undefined) {
    const n = Number(b.currentAmount); if (!Number.isFinite(n) || n < 0) return res.status(400).json({ error: 'validation_error', message: 'currentAmount cannot be negative.' });
    updates.current_amount = n;
  }
  if (b.targetDate !== undefined) updates.target_date = b.targetDate || null;
  if (b.category !== undefined) updates.category = b.category;
  if (b.status !== undefined) {
    if (!['in_progress', 'completed', 'paused'].includes(b.status)) return res.status(400).json({ error: 'validation_error', message: 'status is invalid.' });
    updates.status = b.status;
  }
  for (const field of ['color', 'icon', 'description']) if (b[field] !== undefined) updates[field] = b[field] || null;
  const { data, error } = await req.supabase.from('financial_goals').update(updates).eq('id', req.params.id).select('*').maybeSingle();
  if (error) return sendSupabaseError(res, error, 'Could not update goal');
  if (!data) return res.status(404).json({ error: 'not_found', message: 'Goal not found.' });
  return res.json(normalizeGoal(data));
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const { error } = await req.supabase.from('financial_goals').delete().eq('id', req.params.id);
  if (error) return sendSupabaseError(res, error, 'Could not delete goal');
  return res.status(204).send();
}));
export default router;
