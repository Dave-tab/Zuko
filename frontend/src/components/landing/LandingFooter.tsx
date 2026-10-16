import React from 'react';
import { BrandMark } from '../public/BrandMark';
import { Link, ROUTES } from '../../routing/router';

const linkClass =
  'inline-flex min-h-11 items-center rounded text-sm text-emerald-100/90 hover:text-white underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-white';

export const LandingFooter: React.FC = () => (
  <footer className="bg-emerald-950 text-white">
    <div className="mx-auto max-w-6xl px-5 sm:px-8 py-12">
      <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link
            to={ROUTES.landing}
            aria-label="ZUKO home"
            className="inline-block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <BrandMark tone="light" />
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-emerald-100/80">
            ZUKO is a personal finance app that helps you understand your spending, manage
            budgets and track financial goals.
          </p>
        </div>

        <nav aria-label="Explore">
          <p className="text-xs font-bold tracking-[0.18em] text-emerald-300">EXPLORE</p>
          <ul className="mt-3">
            <li><a href="#features" className={linkClass}>Features</a></li>
            <li><a href="#overview" className={linkClass}>Financial overview</a></li>
            <li><a href="#how-it-works" className={linkClass}>How it works</a></li>
          </ul>
        </nav>

        <nav aria-label="Account">
          <p className="text-xs font-bold tracking-[0.18em] text-emerald-300">ACCOUNT</p>
          <ul className="mt-3">
            <li><Link to={ROUTES.landing} className={linkClass}>Home</Link></li>
            <li><Link to={ROUTES.login} className={linkClass}>Log In</Link></li>
            <li><Link to={ROUTES.signup} className={linkClass}>Sign Up</Link></li>
            <li><Link to={ROUTES.app} className={linkClass}>Demo workspace (simulated data)</Link></li>
          </ul>
        </nav>
      </div>

      <p className="mt-10 border-t border-emerald-900 pt-6 text-xs text-emerald-200/70">
        Figures on this page are illustrative, not real account data.
      </p>
    </div>
  </footer>
);
