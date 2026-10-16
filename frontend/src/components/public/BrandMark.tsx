import React from 'react';
import { Sparkles } from 'lucide-react';

interface BrandMarkProps {
  /** "dark" = for light backgrounds, "light" = for dark-green backgrounds. */
  tone?: 'dark' | 'light';
  className?: string;
}

/** Reuses the existing sidebar logo treatment (emerald tile + sparkle + ZUKO wordmark). */
export const BrandMark: React.FC<BrandMarkProps> = ({ tone = 'dark', className = '' }) => (
  <span className={`inline-flex items-center gap-2.5 ${className}`}>
    <span
      aria-hidden="true"
      className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-800 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-700/20"
    >
      <Sparkles className="w-4.5 h-4.5 text-emerald-200" />
    </span>
    <span
      className={`text-xl font-black tracking-tight ${
        tone === 'light' ? 'text-white' : 'text-slate-950'
      }`}
    >
      ZUKO
    </span>
  </span>
);
