# Zuko Node.js Backend (starter)

Express API for Zuko's React frontend. Uses Supabase Auth and PostgreSQL. This is a hackathon starter and has not been connected to a live Supabase project or BMONI sandbox yet.

## Requirements
- Node.js 20+
- A Supabase project

## Setup (PowerShell)
From the repository root:

```powershell
cd backend
npm install
Copy-Item .env.example .env
```

Fill `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `.env`. Use the project's publishable/anon key, not a service-role/secret key.

Run `supabase/migrations/001_initial_schema.sql` in the Supabase SQL Editor. This migration creates tables and row-level security policies.

Start the API:

```powershell
npm run dev
```

Check `http://localhost:5000/api/health`.

## Authentication contract
Protected routes require:

`Authorization: Bearer <Supabase access_token>`

The frontend should obtain the access token from its Supabase Auth session and attach it to API requests. The backend verifies it with Supabase Auth and uses a Supabase client scoped to that token, so RLS applies.

## Routes
- `GET /api/health` — public health check
- `GET /api/transactions` — list the signed-in user's transactions
- `POST /api/transactions` — create a transaction
- `GET /api/budgets` — list budgets with calculated spending
- `POST /api/budgets` — create a budget
- `PUT /api/budgets/:id` — update a budget
- `DELETE /api/budgets/:id` — delete a budget
- `GET /api/goals` — list goals
- `POST /api/goals` — create a goal
- `PUT /api/goals/:id` — update a goal
- `DELETE /api/goals/:id` — delete a goal
- `GET /api/profile` and `PATCH /api/profile` — profile
- `GET /api/summary` — summary derived from recorded transactions/budgets/goals
- `GET /api/wallet/balance` — returns an explicit 503 until BMONI sandbox integration is configured; it never fabricates a balance

## Example transaction body
```json
{
  "title": "Cafeteria lunch",
  "amount": 2000,
  "type": "expense",
  "category": "Food & Dining",
  "date": "2026-10-14",
  "source": "manual",
  "status": "settled",
  "is_budget_eligible": true
}
```

## Important implementation notes
- The frontend currently has an in-memory `financeService`. It must be replaced/adapted to call these endpoints; this backend does not automatically connect the UI.
- Goals are returned in the frontend's camelCase format (`targetAmount`, `currentAmount`, `targetDate`). Database columns are snake_case.
- Wallet balance is independent from budgets. Do not infer a real wallet balance from transaction history.
- BMONI requests and webhook verification are intentionally not implemented until the team confirms the sandbox credentials and official request/signature contract.
- Monetary columns currently use `NUMERIC(12,2)` per the proposed docs. Confirm the team's monetary-storage decision before using real financial data.
