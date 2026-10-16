import React from 'react';

/**
 * Lightweight product-style preview. EVERY figure here is a hard-coded
 * illustration, labelled as such. Note the wallet balance is intentionally
 * NOT derived from the other numbers (financial rule D05).
 */
const Bar: React.FC<{ label: string; value: number; caption: string }> = ({ label, value, caption }) => (
  <div>
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <span className="font-semibold text-emerald-50">{label}</span>
      <span className="text-emerald-200/80">{caption}</span>
    </div>
    <div
      role="progressbar"
      aria-label={`${label} progress`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      className="mt-2 h-2 rounded-full bg-emerald-900"
    >
      <div className="h-full rounded-full bg-emerald-400" style={{ width: `${value}%` }} />
    </div>
  </div>
);

export const HeroPreview: React.FC = () => (
  <figure className="m-0">
    <div className="rounded-3xl bg-emerald-950 p-5 sm:p-6 text-white shadow-xl shadow-emerald-950/20 ring-1 ring-emerald-900">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-emerald-100">Overview</p>
        <span className="rounded-full border border-amber-300/40 bg-amber-300/10 px-2.5 py-1 text-xs font-semibold text-amber-200">
          Illustrative data
        </span>
      </div>

      <div className="mt-5 rounded-2xl bg-emerald-900/60 p-4">
        <p className="text-xs font-semibold tracking-wide text-emerald-200/80">WALLET BALANCE</p>
        <p className="mt-1 text-3xl font-black tracking-tight">₦125,000</p>
        <p className="mt-1 text-xs text-emerald-200/70">Reported by the wallet. Separate from the figures below.</p>
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
        {[
          { term: 'Income', value: '₦80,000' },
          { term: 'Expenses', value: '₦52,500' },
          { term: 'Net cash flow', value: '₦27,500' },
        ].map((item) => (
          <div key={item.term} className="rounded-xl border border-emerald-900 bg-emerald-950 p-2.5 sm:p-3">
            <dt className="text-[11px] sm:text-xs font-semibold text-emerald-200/80">{item.term}</dt>
            <dd className="mt-1 text-sm sm:text-base font-bold">{item.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 space-y-4">
        <Bar label="Food budget" value={70} caption="70% used" />
        <Bar label="Laptop fund goal" value={45} caption="45% of target" />
      </div>
    </div>
    <figcaption className="mt-3 text-center text-xs text-slate-600">
      Example layout with made-up numbers. Not real account data.
    </figcaption>
  </figure>
);
