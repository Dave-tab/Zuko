import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  ShieldAlert,
  Lightbulb,
  TrendingUp,
  BrainCircuit,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import { AIInsight, Transaction, Budget, FinancialGoal } from '../types/finance';
import { formatNaira, calculateBudgetStatus } from '../utils/financeCalculations';
import { getDemoAIResponse } from '../data/demoAIResponses';


interface AIAssistantPageProps {
  insights: AIInsight[];
  transactions: Transaction[];
  budgets: Budget[];
  goals: FinancialGoal[];
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    type: 'budget' | 'goal';
  };
}

export const AIAssistantPage: React.FC<AIAssistantPageProps> = ({
  insights,
  transactions,
  budgets,
  goals,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: 'Hello! I am Zuko, your student financial intelligence advisor. I monitor your campus spending ledger, evaluate monthly budget envelopes, and track milestone goals.',
      timestamp: 'Just now',
    },
    {
      id: 'm-2',
      sender: 'ai',
      text: 'Term Snapshot: Your Entertainment envelope is currently ₦500.00 over limit (₦8,500.00 of ₦8,000.00). Meanwhile, your MacBook Air M2 goal is on track at 64.6% funding.',
      timestamp: 'Just now',
    },
  ]);
  const [inputVal, setInputVal] = useState('');

const quickPrompts = [
  'How am I spending my money this month?',
  'Where can I reduce spending?',
  'How much did I spend on food?',
  'Give me a weekly budget',
];

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');

    // Generate responsive student finance answers based on real current state
setTimeout(() => {
  const demoResponse = getDemoAIResponse(text);

  const aiMsg: Message = {
    id: `ai-${Date.now()}`,
    sender: 'ai',
    text: demoResponse.response,
    timestamp: 'Just now',
  };

  setMessages((previous) => [...previous, aiMsg]);
}, 450);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Financial AI Advisor
            </h1>
          </div>
        </div>
      </div>

      {/* Cross-Developer Architecture Card & Disclaimer */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50/80 via-emerald-50 to-blue-50 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <BrainCircuit className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">
              Financial Intelligence
            </h4>
          </div>
        </div>

      </div>

      {/* Chat Area Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[520px]">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/40">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${
                m.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  m.sender === 'user'
                    ? 'bg-slate-900 text-white'
                    : 'bg-emerald-700 text-white'
                }`}
              >
                {m.sender === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-slate-900 text-white rounded-tr-none'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-2xs'
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>
                <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400">
                    {m.timestamp}
                  </span>
                  {m.sender === 'ai' && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-md font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Assistive AI
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Prompts */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
            Suggested:
          </span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-700 whitespace-nowrap transition-colors cursor-pointer shadow-2xs"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputVal);
          }}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask Zuko about your budget, cash reserves, or spending limits..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>
        </form>
      </div>
    </div>
  );
};
