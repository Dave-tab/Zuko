export interface DemoAIResponse {
  id: string;
  prompt: string;
  intent: "spending_summary" | "budget_advice" | "savings_advice" | "transaction_help" | "general";
  response: string;
  insights?: {
    label: string;
    value: string;
  }[];
  suggestedPrompts?: string[];
}

/**
 * Zuko demo fixtures.
 * These are predefined responses for the hackathon demo, not live AI output.
 * Update the amounts to match the transactions in your demo account.
 */
export const demoAIResponses: DemoAIResponse[] = [
  {
    id: "spending-summary",
    prompt: "How am I spending my money this month?",
    intent: "spending_summary",
    response:
      "Based on the demo transactions available, you've recorded ₦19,200 in expenses across food, transport, education, utilities, and entertainment. Education is your largest expense in this sample, mainly because of the CSC textbook purchase. Consider separating essential academic costs from flexible spending so you can plan the rest of the month more confidently.",
    insights: [
      { label: "Recorded expenses", value: "₦19,200" },
      { label: "Largest category", value: "Education" },
      { label: "Transactions", value: "5" },
    ],
    suggestedPrompts: [
      "Where can I reduce spending?",
      "Give me a weekly budget",
      "How much did I spend on food?",
    ],
  },
  {
    id: "reduce-spending",
    prompt: "Where can I reduce spending?",
    intent: "savings_advice",
    response:
      "Start with the categories you can adjust without affecting your studies. In this demo, entertainment is ₦4,000 and food is ₦2,500. You could set a weekly limit for outings and plan meals around your class schedule. Treat these as planning ideas—not guaranteed savings—and compare them with your actual spending before making changes.",
    insights: [
      { label: "Entertainment", value: "₦4,000" },
      { label: "Food", value: "₦2,500" },
      { label: "Suggested action", value: "Set weekly limits" },
    ],
    suggestedPrompts: [
      "Create a student budget",
      "How can I save ₦5,000?",
      "Review my spending",
    ],
  },
  {
    id: "budget-plan",
    prompt: "Give me a weekly budget",
    intent: "budget_advice",
    response:
      "A useful starting point is to divide your available money into essentials, academic needs, transport, and flexible spending. Before setting exact limits, Zuko needs your available balance and any expected income. For this demo, use a weekly plan that prioritises food and transport, reserves money for school materials, and gives entertainment a clear cap.",
    insights: [
      { label: "Priority 1", value: "Food & transport" },
      { label: "Priority 2", value: "Academic needs" },
      { label: "Priority 3", value: "Flexible spending" },
    ],
    suggestedPrompts: [
      "How am I spending my money this month?",
      "Where can I reduce spending?",
      "Help me set a savings goal",
    ],
  },
  {
    id: "food-spending",
    prompt: "How much did I spend on food?",
    intent: "spending_summary",
    response:
      "Your current demo dataset contains one food transaction: ₦2,500 for lunch on campus. This total only reflects the sample transactions loaded for this presentation. Add any other food purchases to get a more complete picture.",
    insights: [
      { label: "Food expenses", value: "₦2,500" },
      { label: "Food transactions", value: "1" },
    ],
    suggestedPrompts: [
      "How much did I spend in total?",
      "Where can I reduce spending?",
    ],
  },
  {
    id: "save-5000",
    prompt: "How can I save ₦5,000?",
    intent: "savings_advice",
    response:
      "Try a simple plan: set aside a small amount whenever you receive money, limit unplanned outings, and review recurring data or subscription costs. Only commit to a ₦5,000 target if your available balance and essential expenses allow it. A realistic target is better than a plan that leaves you short of transport or food money.",
    insights: [
      { label: "Goal", value: "₦5,000" },
      { label: "First step", value: "Review flexible spending" },
    ],
    suggestedPrompts: [
      "Help me set a savings goal",
      "Give me a weekly budget",
    ],
  },
  {
    id: "transaction-help",
    prompt: "How do I track a cash expense?",
    intent: "transaction_help",
    response:
      "Open Transaction Ledger, choose the option to add a transaction, enter a clear description, amount, category, and date, then save it. Use Expense for money spent and check that the amount and category are correct. Your dashboard should update after the transaction is saved and loaded successfully.",
    suggestedPrompts: [
      "How am I spending my money this month?",
      "Where can I reduce spending?",
    ],
  },
  {
    id: "savings-goal",
    prompt: "Help me set a savings goal",
    intent: "savings_advice",
    response:
      "Choose a specific goal, its target amount, and a date you want to reach it. Then estimate how much you can set aside each week after essentials. For example, a ₦20,000 goal over 10 weeks would require ₦2,000 per week. Adjust the timeline if that amount is not affordable.",
    insights: [
      { label: "Example target", value: "₦20,000" },
      { label: "Example timeline", value: "10 weeks" },
      { label: "Weekly amount", value: "₦2,000" },
    ],
    suggestedPrompts: [
      "How can I save ₦5,000?",
      "Give me a weekly budget",
    ],
  },
  {
    id: "total-spending",
    prompt: "How much did I spend in total?",
    intent: "spending_summary",
    response:
      "The five transactions in this prepared demo dataset add up to ₦19,200 in expenses. This is the total of the sample records, not necessarily your real-world spending. If you add or remove demo transactions, update this response or calculate the total directly from the transaction data.",
    insights: [
      { label: "Total sample expenses", value: "₦19,200" },
      { label: "Sample records", value: "5" },
    ],
    suggestedPrompts: [
      "How am I spending my money this month?",
      "Where can I reduce spending?",
    ],
  },
  {
    id: "general",
    prompt: "What can you help me with?",
    intent: "general",
    response:
      "I can help you understand spending patterns, think through a student budget, explore practical savings habits, and explain how to record transactions. In this demo, my answers come from prepared examples. When the live AI service is connected, responses can be generated from your actual financial data.",
    suggestedPrompts: [
      "How am I spending my money this month?",
      "Give me a weekly budget",
      "Where can I reduce spending?",
    ],
  },
];

/**
 * Returns a prepared response for a matching demo question.
 * Falls back to the general response if no prompt matches.
 */
export function getDemoAIResponse(prompt: string): DemoAIResponse {
  const normalizedPrompt = prompt.trim().toLowerCase();

  const match = demoAIResponses.find(
    (item) => item.prompt.toLowerCase() === normalizedPrompt,
  );

  return (
    match ??
    demoAIResponses.find((item) => item.id === "general")!
  );
}
