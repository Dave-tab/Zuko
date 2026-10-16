import React, { useState } from 'react';
import { AlertCircle, Check, Circle, Eye, EyeOff, Info } from 'lucide-react';

interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id'> {
  id: string;
  label: string;
  error?: string;
  hint?: React.ReactNode;
  /** Extra aria-describedby ids (e.g. a password-requirements list). */
  describedBy?: string;
  trailing?: React.ReactNode;
}

export const TextField: React.FC<TextFieldProps> = ({
  id,
  label,
  error,
  hint,
  describedBy,
  trailing,
  className = '',
  ...inputProps
}) => {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const described =
    [hint ? hintId : null, error ? errorId : null, describedBy].filter(Boolean).join(' ') ||
    undefined;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-slate-800 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={described}
          className={`block w-full min-h-11 rounded-xl border bg-white px-3.5 py-2.5 text-base text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-600/30 disabled:bg-slate-50 disabled:text-slate-500 ${
            trailing ? 'pr-12' : ''
          } ${
            error
              ? 'border-rose-600 focus:border-rose-600 focus:ring-rose-600/25'
              : 'border-slate-300 focus:border-emerald-700'
          } ${className}`}
          {...inputProps}
        />
        {trailing && <div className="absolute inset-y-0 right-1 flex items-center">{trailing}</div>}
      </div>
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-sm text-slate-600">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-rose-700">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

type PasswordFieldProps = Omit<TextFieldProps, 'type' | 'trailing'>;

/** Password input, masked by default, with an accessible show/hide toggle. */
export const PasswordField: React.FC<PasswordFieldProps> = (props) => {
  const [visible, setVisible] = useState(false);
  return (
    <TextField
      {...props}
      type={visible ? 'text' : 'password'}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-pressed={visible}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="w-10 h-10 inline-flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
        >
          {visible ? (
            <EyeOff className="w-5 h-5" aria-hidden="true" />
          ) : (
            <Eye className="w-5 h-5" aria-hidden="true" />
          )}
        </button>
      }
    />
  );
};

export interface PasswordRule {
  id: string;
  label: string;
  test: (value: string) => boolean;
}

export const PASSWORD_RULES: PasswordRule[] = [
  { id: 'length', label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { id: 'letter', label: 'At least one letter', test: (v) => /[A-Za-z]/.test(v) },
  { id: 'number', label: 'At least one number', test: (v) => /\d/.test(v) },
];

export const passwordMeetsRules = (value: string) => PASSWORD_RULES.every((r) => r.test(value));

/** Requirement checklist. Met/unmet is conveyed by icon AND text, not colour alone. */
export const PasswordRequirements: React.FC<{ id: string; value: string }> = ({ id, value }) => (
  <div id={id} className="mt-2.5">
    <p className="text-sm font-medium text-slate-700">Your password needs:</p>
    <ul className="mt-1.5 space-y-1">
      {PASSWORD_RULES.map((rule) => {
        const met = rule.test(value);
        return (
          <li
            key={rule.id}
            className={`flex items-center gap-2 text-sm ${met ? 'text-emerald-800' : 'text-slate-600'}`}
          >
            {met ? (
              <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
            ) : (
              <Circle className="w-4 h-4 shrink-0" aria-hidden="true" />
            )}
            <span>
              {rule.label}
              <span className="sr-only">{met ? ' (met)' : ' (not met yet)'}</span>
            </span>
          </li>
        );
      })}
    </ul>
  </div>
);

interface FormNoticeProps {
  tone: 'error' | 'info';
  title: string;
  children: React.ReactNode;
}

/** Form-level feedback. Error uses role="alert"; info uses role="status". */
export const FormNotice: React.FC<FormNoticeProps> = ({ tone, title, children }) => {
  const isError = tone === 'error';
  const Icon = isError ? AlertCircle : Info;
  return (
    <div
      role={isError ? 'alert' : 'status'}
      className={`flex gap-3 rounded-xl border p-3.5 text-sm ${
        isError
          ? 'border-rose-200 bg-rose-50 text-rose-900'
          : 'border-amber-200 bg-amber-50 text-amber-950'
      }`}
    >
      <Icon className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
      <div className="min-w-0">
        <p className="font-semibold">{title}</p>
        <div className="mt-0.5 leading-relaxed">{children}</div>
      </div>
    </div>
  );
};

/** Focus the first invalid field after a failed submit. */
export function focusFirstInvalid(fieldIds: string[], errors: Record<string, string | undefined>) {
  const firstId = fieldIds.find((id) => errors[id]);
  if (firstId) document.getElementById(firstId)?.focus();
}

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
