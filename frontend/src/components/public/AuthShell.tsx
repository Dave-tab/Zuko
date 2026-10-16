import React from 'react';
import { ArrowLeft, PieChart, Sparkles, Target, TrendingUp } from 'lucide-react';
import { Link, ROUTES } from '../../routing/router';
import { BrandMark } from './BrandMark';

interface AuthShellProps {
  children: React.ReactNode;
}

const ASIDE_POINTS = [
  { icon: TrendingUp, text: 'See where your money goes, in context.' },
  { icon: PieChart, text: 'Plan spending with budgets you can monitor.' },
  { icon: Target, text: 'Keep the goals that matter in sight.' },
  { icon: Sparkles, text: 'Explore AI-assisted insights about your activity.' },
];

/**
 * Shared two-pane layout for login, sign-up and connect-wallet.
 * Left: brand panel (lg+). Right: the form, with a compact brand header on mobile.
 */
export const AuthShell: React.FC<AuthShellProps> = ({ children }) => (
  <div className="min-h-dvh bg-white lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
    <aside className="hidden lg:flex flex-col justify-between bg-emerald-950 text-white p-12 xl:p-16">
      <Link
        to={ROUTES.landing}
        aria-label="ZUKO home"
        className="self-start rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-950"
      >
        <BrandMark tone="light" />
      </Link>

      <div className="max-w-md">
        <p className="text-xs font-bold tracking-[0.18em] text-emerald-300">
          YOUR MONEY. BETTER UNDERSTOOD.
        </p>
        <p className="mt-4 text-3xl xl:text-4xl font-black tracking-tight leading-tight">
          One clear picture at a time.
        </p>
        <ul className="mt-8 space-y-4">
          {ASIDE_POINTS.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-3 text-emerald-50/90">
              <span
                aria-hidden="true"
                className="mt-0.5 w-8 h-8 shrink-0 rounded-lg bg-emerald-900 border border-emerald-800 flex items-center justify-center"
              >
                <Icon className="w-4 h-4 text-emerald-300" />
              </span>
              <span className="text-base leading-snug pt-1">{text}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-sm text-emerald-200/70">
        ZUKO helps you understand your money. It does not move it on your behalf.
      </p>
    </aside>

    <div className="flex flex-col min-h-dvh lg:min-h-0">
      <header className="flex items-center justify-between gap-4 px-5 sm:px-8 py-4">
        <Link
          to={ROUTES.landing}
          aria-label="ZUKO home"
          className="lg:hidden rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
        >
          <BrandMark />
        </Link>
        <Link
          to={ROUTES.landing}
          className="ml-auto inline-flex items-center gap-1.5 min-h-11 px-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back to home
        </Link>
      </header>

      <main className="flex-1 flex items-start sm:items-center justify-center px-5 sm:px-8 pb-12 pt-2">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  </div>
);
