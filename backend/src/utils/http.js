export function asyncHandler(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

export function sendSupabaseError(res, error, fallback = 'Database request failed') {
  // Avoid exposing database internals to clients.
  console.error(fallback, error?.message || error);
  return res.status(400).json({ error: 'database_error', message: fallback });
}

export function numberOrNull(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}
