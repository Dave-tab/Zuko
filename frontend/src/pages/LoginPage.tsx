import React, { useRef, useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { AuthShell } from '../components/public/AuthShell';
import { ActionButton } from '../components/public/ActionButton';
import {
  EMAIL_PATTERN,
  FormNotice,
  PasswordField,
  TextField,
  focusFirstInvalid,
} from '../components/public/FormFields';
import { Link, ROUTES, navigate } from '../routing/router';
import { authService } from '../services/authService';

type Errors = { 'login-email'?: string; 'login-password'?: string };
type Notice = { tone: 'error' | 'info'; title: string; message: string } | null;

const FIELD_IDS = ['login-email', 'login-password'];

function validate(email: string, password: string): Errors {
  const errors: Errors = {};
  if (!email.trim()) errors['login-email'] = 'Enter your email address.';
  else if (!EMAIL_PATTERN.test(email.trim())) errors['login-email'] = 'Enter a valid email address, like name@example.com.';
  if (!password) errors['login-password'] = 'Enter your password.';
  return errors;
}

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const inFlight = useRef(false);

  // After the first failed submit, re-validate as the user corrects fields.
  const revalidate = (nextEmail: string, nextPassword: string) => {
    if (submitted) setErrors(validate(nextEmail, nextPassword));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (inFlight.current) return; // guard against duplicate submissions
    setNotice(null);
    setSubmitted(true);

    const found = validate(email, password);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      focusFirstInvalid(FIELD_IDS, found);
      return;
    }

    inFlight.current = true;
    setSubmitting(true);
    try {
      const outcome = await authService.logIn({ email: email.trim(), password });
      if (outcome.kind === 'success') {
        navigate(ROUTES.app);
        return;
      }
      if (outcome.kind === 'rejected') {
        setNotice({ tone: 'error', title: 'We couldn’t log you in', message: outcome.message });
      } else {
        setNotice({
          tone: 'info',
          title: 'Log in isn’t available yet',
          message:
            'This version of ZUKO isn’t connected to an authentication service yet, so your details were not checked and you haven’t been logged in.',
        });
      }
    } catch {
      setNotice({
        tone: 'error',
        title: 'Something went wrong',
        message: 'We couldn’t complete your request. Please try again in a moment.',
      });
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  };

  return (
    <AuthShell>
      <h1 className="text-3xl font-black tracking-tight text-slate-950">Welcome back.</h1>
      <p className="mt-2 text-base text-slate-600">
        Log in to continue managing your money with ZUKO.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5" aria-busy={submitting}>
        {notice && (
          <FormNotice tone={notice.tone} title={notice.title}>
            {notice.message}
          </FormNotice>
        )}

        <TextField
          id="login-email"
          name="email"
          type="email"
          label="Email address"
          autoComplete="email"
          inputMode="email"
          autoCapitalize="none"
          spellCheck={false}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            revalidate(e.target.value, password);
          }}
          error={errors['login-email']}
          disabled={submitting}
        />

        <PasswordField
          id="login-password"
          name="password"
          label="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            revalidate(email, e.target.value);
          }}
          error={errors['login-password']}
          disabled={submitting}
        />

        <ActionButton
          type="submit"
          size="lg"
          fullWidth
          disabled={submitting}
          icon={
            submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            ) : (
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            )
          }
          iconPosition={submitting ? 'start' : 'end'}
        >
          {submitting ? 'Logging in…' : 'Log In'}
        </ActionButton>
      </form>

      <p className="mt-6 text-sm text-slate-600 text-center">
        New to ZUKO?{' '}
        <Link
          to={ROUTES.signup}
          className="font-semibold text-emerald-800 underline underline-offset-2 hover:text-emerald-950 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
        >
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
};
