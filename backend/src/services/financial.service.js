const ELIGIBLE_STATUSES = new Set(['settled']);

export function isBudgetEligibleExpense(transaction) {
  return transaction.type === 'expense'
    && transaction.is_budget_eligible === true
    && ELIGIBLE_STATUSES.has(transaction.status);
}

export function calculateBudgetStatus(budget, transactions, now = new Date()) {
  const currentMonth = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Lagos', year: 'numeric', month: '2-digit',
  }).format(now).slice(0, 7);

  const spent = transactions
    .filter((tx) => isBudgetEligibleExpense(tx))
    .filter((tx) => tx.category === budget.category && tx.date?.slice(0, 7) === currentMonth)
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const limit = Number(budget.limit_amount);
  const remaining = limit - spent;
  return {
    id: budget.id,
    category: budget.category,
    limit,
    period: budget.period,
    spent,
    remaining,
    percentUsed: limit > 0 ? (spent / limit) * 100 : 0,
    isOverBudget: remaining < 0,
    overAmount: Math.max(0, spent - limit),
    color: budget.color ?? undefined,
    icon: budget.icon ?? undefined,
  };
}

export function calculateSummary(transactions, budgets, goals) {
  const settled = transactions.filter((tx) => tx.status === 'settled');
  const totalIncome = settled
    .filter((tx) => ['income', 'deposit'].includes(tx.type))
    .reduce((sum, tx) => sum + Number(tx.amount), 0);
  const totalExpenses = settled
    .filter((tx) => isBudgetEligibleExpense(tx))
    .reduce((sum, tx) => sum + Number(tx.amount), 0);
  const netSavings = totalIncome - totalExpenses;
  const budgetStatuses = budgets.map((budget) => calculateBudgetStatus(budget, transactions));
  const activeGoalsCount = goals.filter((goal) => goal.status === 'in_progress').length;

  return {
    totalIncome,
    totalExpenses,
    netSavings,
    savingsRate: totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0,
    activeBudgetsCount: budgets.length,
    overBudgetsCount: budgetStatuses.filter((budget) => budget.isOverBudget).length,
    activeGoalsCount,
    budgets: budgetStatuses,
  };
}
