import { Router } from 'express';
import { asyncHandler, sendSupabaseError } from '../utils/http.js';
const router = Router();

const TYPES = ['expense', 'income', 'transfer', 'deposit', 'withdrawal'];
const STATUSES = ['initiated', 'pending', 'settled', 'failed', 'reversed'];
const SOURCES = ['manual', 'bmoni_card', 'bmoni_wallet', 'bmoni_transfer', 'cash', 'bank_transfer', 'campus_card', 'stipend'];

function normalizeTransaction(row) {
  return {
    id: row.id,
    title: row.title,
    amount: Number(row.amount),
    type: row.type,
    category: row.category,
    date: row.date,
    currency: row.currency,
    status: row.status,
    is_budget_eligible: row.is_budget_eligible,
    external_reference: row.external_reference ?? undefined,
    merchant: row.merchant ?? undefined,
    note: row.note ?? undefined,
    source: row.source,
  };
}

router.get('/', asyncHandler(async (req, res) => {
  let query = req.supabase.from('transactions').select('*').order('date', { ascending: false }).order('created_at', { ascending: false }).limit(500);
  if (req.query.type && TYPES.includes(req.query.type)) query = query.eq('type', req.query.type);
  if (req.query.category) query = query.eq('category', String(req.query.category));
  if (req.query.from) query = query.gte('date', String(req.query.from));
  if (req.query.to) query = query.lte('date', String(req.query.to));
  const { data, error } = await query;
  if (error) return sendSupabaseError(res, error, 'Could not load transactions');
  return res.json(data.map(normalizeTransaction));
}));

router.post('/', asyncHandler(async (req, res) => {
  const body = req.body || {};
  const amount = Number(body.amount);
  if (!String(body.title || '').trim()) return res.status(400).json({ error: 'validation_error', message: 'title is required.' });
  if (!Number.isFinite(amount) || amount <= 0) return res.status(400).json({ error: 'validation_error', message: 'amount must be a number greater than zero.' });
  if (!TYPES.includes(body.type)) return res.status(400).json({ error: 'validation_error', message: 'type is invalid.' });
  if (!String(body.category || '').trim()) return res.status(400).json({ error: 'validation_error', message: 'category is required.' });
  if (body.status && !STATUSES.includes(body.status)) return res.status(400).json({ error: 'validation_error', message: 'status is invalid.' });
  if (body.source && !SOURCES.includes(body.source)) return res.status(400).json({ error: 'validation_error', message: 'source is invalid.' });

  const payload = {
    user_id: req.user.id,
    title: String(body.title).trim(),
    amount,
    currency: 'NGN',
    type: body.type,
    category: String(body.category).trim(),
    date: body.date || new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Lagos' }),
    source: body.source || 'manual',
    status: body.status || 'settled',
    is_budget_eligible: typeof body.is_budget_eligible === 'boolean' ? body.is_budget_eligible : body.type === 'expense',
    external_reference: body.external_reference || null,
    merchant: body.merchant || null,
    note: body.note || null,
  };

  const { data, error } = await req.supabase
    .from('transactions')
    .insert(payload)
    .select('*')
    .single();


  if (error) {
    console.error('[POST /transactions] Supabase error:', error);

    if (error.code === '23505') {
      return res.status(409).json({
        error: 'duplicate_transaction',
        message: 'A transaction with this external reference already exists.',
      });
    }

    return sendSupabaseError(res, error, 'Could not create transaction');
  }


  return res.status(201).json(normalizeTransaction(data));

}));

export default router;
