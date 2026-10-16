import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { ActionButton } from '../public/ActionButton';
import { BrandMark } from '../public/BrandMark';
import { Link, ROUTES } from '../../routing/router';

const SECTION_LINKS = [
  { href: '#why-zuko', label: 'Why ZUKO' },
  { href: '#features', label: 'Features' },
  { href: '#overview', label: 'Financial overview' },
  { href: '#how-it-works', label: 'How it works' },
];

const linkClass =
  'rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600';

export const LandingNav: React.FC = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <nav aria-label="Primary" className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link
          to={ROUTES.landing}
          aria-label="ZUKO home"
          className="rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
        >
          <BrandMark />
        </Link>

        <ul className="hidden lg:flex items-center gap-1">
          {SECTION_LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className={linkClass}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-2">
          <ActionButton variant="outline" to={ROUTES.login}>
            Log In
          </ActionButton>
          <ActionButton to={ROUTES.signup}>Get Started</ActionButton>
        </div>

        <button
          type="button"
          className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-xl text-slate-800 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="lg:hidden border-t border-slate-200 bg-white px-5 sm:px-8 pb-5 pt-3">
          <ul className="flex flex-col">
            {SECTION_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`${linkClass} flex min-h-11 items-center text-base`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ActionButton variant="outline" to={ROUTES.login}>
              Log In
            </ActionButton>
            <ActionButton to={ROUTES.signup}>Get Started</ActionButton>
          </div>
        </div>
      )}
    </header>
  );
};
