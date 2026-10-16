import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { requireAuth } from './middleware/requireAuth.js';
import healthRoutes from './routes/health.routes.js';
import transactionRoutes from './routes/transactions.routes.js';
import budgetRoutes from './routes/budgets.routes.js';
import goalRoutes from './routes/goals.routes.js';
import profileRoutes from './routes/profile.routes.js';
import summaryRoutes from './routes/summary.routes.js';
import walletRoutes from './routes/wallet.routes.js';

const app = express();
app.disable('x-powered-by');
app.use(cors({ origin: env.frontendUrl.split(',').map((item) => item.trim()), credentials: false }));
app.use(express.json({ limit: '1mb' }));

app.use('/api/health', healthRoutes);
app.use('/api', requireAuth);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api/wallet', walletRoutes);

app.use((_req, res) => res.status(404).json({ error: 'not_found', message: 'Route not found.' }));
app.use((error, _req, res, _next) => {
  console.error('Unhandled API error:', error?.message || error);
  res.status(500).json({ error: 'internal_server_error', message: 'An unexpected server error occurred.' });
});

export default app;
