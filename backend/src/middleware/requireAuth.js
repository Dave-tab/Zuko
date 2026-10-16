import { createPublicSupabaseClient, createUserSupabaseClient } from '../config/supabase.js';

export async function requireAuth(req, res, next) {
  const authorization = req.headers.authorization || '';
  const match = authorization.match(/^Bearer\s+(.+)$/i);

  if (!match) {
    return res.status(401).json({ error: 'unauthorized', message: 'Send an Authorization: Bearer <access_token> header.' });
  }

  try {
    const token = match[1];
    const authClient = createPublicSupabaseClient();
    const { data, error } = await authClient.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({ error: 'invalid_token', message: 'Your session is invalid or expired. Please sign in again.' });
    }

    req.user = data.user;
    req.supabase = createUserSupabaseClient(token);
    return next();
  } catch (error) {
    return next(error);
  }
}
