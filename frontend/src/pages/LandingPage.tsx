import React from 'react';
import {
  ArrowRight,
  PieChart,
  Receipt,
  Sparkles,
  Target,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';
import { motion } from 'motion/react';
import { ActionButton } from '../components/public/ActionButton';
import { Reveal } from '../components/public/Reveal';
import { LandingNav } from '../components/landing/LandingNav';
import { LandingFooter } from '../components/landing/LandingFooter';
import { HeroPreview } from '../components/landing/HeroPreview';
import { ROUTES } from '../routing/router';

const container = 'mx-auto max-w-6xl px-5 sm:px-8';
const eyebrow = 'text-xs font-bold tracking-[0.18em] text-emerald-800';
const h2 = 'mt-3 text-3xl sm:text-4xl font-black tracking-tight text-slate-950 text-balance';

const FEATURES: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: TrendingUp,
    title: 'Understand your spending',
    description:
      'See your transactions in context and build a clearer understanding of where your money goes.',
  },
  {
    icon: PieChart,
    title: 'Build better budgets',
    description: 'Organize your spending around budgets that help you plan and monitor your money.',
  },
  {
    icon: Target,
    title: 'Keep your goals in sight',
    description: 'Track progress toward the financial goals that matter to you.',
  },
  {
    icon: Receipt,
    title: 'Make sense of transactions',
    description: 'Review your financial activity in a more organized and understandable way.',
  },
  {
    icon: Sparkles,
    title: 'Get AI-assisted insights',
    description:
      'Explore AI-assisted guidance designed to help you think more clearly about your financial activity.',
  },
];

const MEASURES = [
  {
    term: 'Wallet balance',
    description:
      'The spendable amount your wallet reports. ZUKO shows it as provided and never works it out from your budgets.',
  },
  { term: 'Income', description: 'Money coming in during a period.' },
  { term: 'Expenses', description: 'Money going out during a period.' },
  {
    term: 'Net cash flow',
    description:
      'Income minus expenses for the same period. It describes the period, not what is in your wallet.',
  },
  {
    term: 'Budget progress',
    description: 'How much of a spending limit you have used for a category and period.',
  },
  {
    term: 'Goal progress',
    description: 'How far you are toward a target you set. It tracks progress; it does not set money aside.',
  },
];

const STEPS = [
  {
    title: 'Create your account.',
    description: 'Sign up with your name and email to get started.',
  },
  {
    title: 'Complete the wallet onboarding process.',
    description: 'Set up your wallet so your wallet balance can be shown on its own.',
  },
  {
    title: 'Start building a clearer understanding of your finances.',
    description: 'Review spending, set budgets and follow your goals in one place.',
  },
];

export const LandingPage: React.FC = () => (
  <div className="min-h-dvh bg-white text-slate-900">
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:shadow-lg"
    >
      Skip to content
    </a>
    <LandingNav />

    <main id="main">
      {/* HERO */}
      <section aria-labelledby="hero-heading" className="bg-white">
        <div className={`${container} grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-24`}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <p className={eyebrow}>YOUR MONEY. BETTER UNDERSTOOD.</p>
            <h1
              id="hero-heading"
              className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-slate-950 text-balance"
            >
              Take control of your money. One clear picture at a time.
            </h1>
            <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-slate-600">
              ZUKO helps you understand your spending, manage your budgets, track your financial goals
              and make more informed decisions about your money. Less guesswork. More clarity about
              where your money goes and what you want it to do.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ActionButton
                size="lg"
                to={ROUTES.signup}
                icon={<ArrowRight className="w-4 h-4" aria-hidden="true" />}
                iconPosition="end"
              >
                Get Started
              </ActionButton>
              <ActionButton size="lg" variant="outline" to={ROUTES.login}>
                Log In
              </ActionButton>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            className="mx-auto w-full max-w-md lg:max-w-none"
          >
            <HeroPreview />
          </motion.div>
        </div>
      </section>

      {/* PROBLEM / VALUE */}
      <section id="why-zuko" aria-labelledby="why-heading" className="scroll-mt-20 bg-slate-50 border-y border-slate-200">
        <div className={`${container} grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:gap-16`}>
          <Reveal>
            <p className={eyebrow}>WHY ZUKO</p>
            <h2 id="why-heading" className={h2}>
              Your money moves. Can you see the bigger picture?
            </h2>
            <p className="mt-5 text-base sm:text-lg leading-relaxed text-slate-600">
              Your spending, budgets and financial goals can easily become disconnected. ZUKO brings
              these parts of your financial life into a clearer view, helping you understand your
              habits and make more intentional decisions.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-5">
                <p className="text-sm font-bold text-slate-900">Scattered</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  <li className="rounded-lg bg-slate-100 px-3 py-2">Spending in one place</li>
                  <li className="rounded-lg bg-slate-100 px-3 py-2">Budgets somewhere else</li>
                  <li className="rounded-lg bg-slate-100 px-3 py-2">Goals in your head</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <p className="text-sm font-bold text-emerald-950">With ZUKO</p>
                <ul className="mt-3 space-y-2 text-sm text-emerald-950">
                  <li className="rounded-lg bg-white px-3 py-2 border border-emerald-100">Spending</li>
                  <li className="rounded-lg bg-white px-3 py-2 border border-emerald-100">Budgets</li>
                  <li className="rounded-lg bg-white px-3 py-2 border border-emerald-100">Goals</li>
                </ul>
                <p className="mt-3 text-sm text-emerald-900">One clearer view.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" aria-labelledby="features-heading" className="scroll-mt-20 bg-white">
        <div className={`${container} py-16 sm:py-20`}>
          <Reveal className="max-w-2xl">
            <p className={eyebrow}>FEATURES</p>
            <h2 id="features-heading" className={h2}>
              What ZUKO helps you do
            </h2>
          </Reveal>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, description }, i) => (
              <li key={title}>
                <Reveal delay={i * 0.05} className="h-full">
                  <article className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <span
                      aria-hidden="true"
                      className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100"
                    >
                      <Icon className="w-5 h-5" />
                    </span>
                    <h3 className="mt-4 text-lg font-bold text-slate-950">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FINANCIAL OVERVIEW */}
      <section id="overview" aria-labelledby="overview-heading" className="scroll-mt-20 bg-slate-50 border-y border-slate-200">
        <div className={`${container} py-16 sm:py-20`}>
          <Reveal className="max-w-2xl">
            <p className={eyebrow}>FINANCIAL OVERVIEW</p>
            <h2 id="overview-heading" className={h2}>
              See your financial picture more clearly.
            </h2>
            <p className="mt-5 text-base sm:text-lg leading-relaxed text-slate-600">
              Each figure answers a different question, so ZUKO keeps them apart instead of blending
              them into one number.
            </p>
          </Reveal>
          <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MEASURES.map((m) => (
              <div key={m.term} className="rounded-2xl border border-slate-200 bg-white p-5">
                <dt className="text-base font-bold text-slate-950">{m.term}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-slate-600">{m.description}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 max-w-2xl text-sm text-slate-600">
            ZUKO does not read your bank logins or scrape your accounts, and it does not claim to
            sync automatically with a bank.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" aria-labelledby="how-heading" className="scroll-mt-20 bg-white">
        <div className={`${container} py-16 sm:py-20`}>
          <Reveal className="max-w-2xl">
            <p className={eyebrow}>HOW IT WORKS</p>
            <h2 id="how-heading" className={h2}>
              Three steps to a clearer view
            </h2>
          </Reveal>
          <ol className="mt-10 grid gap-5 lg:grid-cols-3">
            {STEPS.map((step, i) => (
              <li key={step.title}>
                <Reveal delay={i * 0.08} className="h-full">
                  <div className="h-full rounded-2xl border border-slate-200 bg-white p-6">
                    <span
                      aria-hidden="true"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-700 text-base font-black text-white"
                    >
                      {i + 1}
                    </span>
                    <h3 className="mt-4 text-lg font-bold text-slate-950">
                      <span className="sr-only">Step {i + 1}: </span>
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.description}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FINAL CTA */}
      <section aria-labelledby="cta-heading" className="bg-emerald-950 text-white">
        <div className={`${container} py-16 sm:py-20 text-center`}>
          <Reveal>
            <h2
              id="cta-heading"
              className="mx-auto max-w-2xl text-3xl sm:text-4xl font-black tracking-tight text-balance"
            >
              Your next financial decision deserves more clarity.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base sm:text-lg text-emerald-100/85">
              Start building a clearer picture of your money with ZUKO.
            </p>
            <div className="mt-8 flex justify-center">
              <ActionButton
                size="lg"
                variant="light"
                to={ROUTES.signup}
                icon={<ArrowRight className="w-4 h-4" aria-hidden="true" />}
                iconPosition="end"
              >
                Get Started
              </ActionButton>
            </div>
          </Reveal>
        </div>
      </section>
    </main>

    <LandingFooter />
  </div>
);
