import { Router } from 'express';
import { asyncHandler, sendSupabaseError } from '../utils/http.js';
const router = Router();

function normalizeProfile(row, email) {
  return { name: row.full_name || '', university: row.university || '', major: row.major || '', year: row.academic_year || '', semester: row.semester || '', avatarUrl: row.avatar_url || undefined, matricNumber: row.matric_number || undefined, email };
}

router.get('/', asyncHandler(async (req, res) => {
  const { data, error } = await req.supabase.from('profiles').select('*').eq('id', req.user.id).maybeSingle();
  if (error) return sendSupabaseError(res, error, 'Could not load profile');
  if (!data) return res.json({ name: req.user.user_metadata?.full_name || '', university: '', major: '', year: '', semester: '', email: req.user.email || '' });
  return res.json(normalizeProfile(data, req.user.email || ''));
}));

router.patch('/', asyncHandler(async (req, res) => {
  const b = req.body || {};
  const updates = { id: req.user.id };
  const mapping = { name: 'full_name', university: 'university', major: 'major', year: 'academic_year', semester: 'semester', avatarUrl: 'avatar_url', matricNumber: 'matric_number' };
  for (const [input, column] of Object.entries(mapping)) if (b[input] !== undefined) updates[column] = b[input] || null;
  const { data, error } = await req.supabase.from('profiles').upsert(updates, { onConflict: 'id' }).select('*').single();
  if (error) return sendSupabaseError(res, error, 'Could not update profile');
  return res.json(normalizeProfile(data, req.user.email || ''));
}));
export default router;
