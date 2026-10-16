# Zuko backend API contract (starter)

Base URL locally: `http://localhost:5000`

Protected requests require `Authorization: Bearer <Supabase access token>`.

## Transactions
`GET /api/transactions` optionally accepts `type`, `category`, `from`, and `to` query parameters.

`POST /api/transactions` accepts `title`, `amount`, `type`, `category`, and optional `date`, `source`, `status`, `is_budget_eligible`, `external_reference`, `merchant`, `note`.

## Budgets
`GET /api/budgets`, `POST /api/budgets`, `PUT /api/budgets/:id`, `DELETE /api/budgets/:id`.
Budget JSON uses frontend fields `limit`, `period`, `category`, `color`, `icon`; the API adds `spent`, `remaining`, `percentUsed`, `isOverBudget`, `overAmount`.

## Goals
`GET /api/goals`, `POST /api/goals`, `PUT /api/goals/:id`, `DELETE /api/goals/:id`.
Goal JSON uses `targetAmount`, `currentAmount`, `targetDate`, `category`, `status`.

## Profile and summary
`GET/PATCH /api/profile`; `GET /api/summary`.

## Wallet
`GET /api/wallet/balance` is intentionally unavailable until the official BMONI sandbox integration is implemented. A 503 means no provider balance is available; clients must not display a fabricated number.
