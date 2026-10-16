import React, { useRef, useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { AuthShell } from '../components/public/AuthShell';
import { ActionButton } from '../components/public/ActionButton';
import {
  EMAIL_PATTERN,
  FormNotice,
  PasswordField,
  PasswordRequirements,
  TextField,
  focusFirstInvalid,
  passwordMeetsRules,
} from '../components/public/FormFields';
import { Link, ROUTES, navigate } from '../routing/router';
import { authService } from '../services/authService';

type FieldId = 'signup-name' | 'signup-email' | 'signup-password' | 'signup-confirm';
type Errors = Partial<Record<FieldId, string>>;
type Notice = { tone: 'error' | 'info'; title: string; message: string; previewNext?: boolean } | null;

const FIELD_IDS: FieldId[] = ['signup-name', 'signup-email', 'signup-password', 'signup-confirm'];

interface Values {
  name: string;
  email: string;
  password: string;
  confirm: string;
}

function validate({ name, email, password, confirm }: Values): Errors {
  const errors: Errors = {};
  if (!name.trim()) errors['signup-name'] = 'Enter your full name.';
  if (!email.trim()) errors['signup-email'] = 'Enter your email address.';
  else if (!EMAIL_PATTERN.test(email.trim())) errors['signup-email'] = 'Enter a valid email address, like name@example.com.';
  if (!password) errors['signup-password'] = 'Create a password.';
  else if (!passwordMeetsRules(password)) errors['signup-password'] = 'Your password doesn’t meet all the requirements below yet.';
  if (!confirm) errors['signup-confirm'] = 'Re-enter your password to confirm it.';
  else if (confirm !== password) errors['signup-confirm'] = 'The passwords don’t match.';
  return errors;
}

export const SignUpPage: React.FC = () => {
  const [values, setValues] = useState<Values>({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const inFlight = useRef(false);

  const update = (key: keyof Values) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = { ...values, [key]: e.target.value };
    setValues(next);
    if (submitted) setErrors(validate(next));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (inFlight.current) return; // guard against duplicate submissions
    setNotice(null);
    setSubmitted(true);

    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      focusFirstInvalid(FIELD_IDS, found);
      return;
    }

    inFlight.current = true;
    setSubmitting(true);
    try {
      const outcome = await authService.signUp({
        fullName: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      });

      


if (outcome.kind === 'confirmation_required') {
  setValues({
    name: '',
    email: '',
    password: '',
    confirm: '',
  });

  setErrors({});
  setSubmitted(false);

  setNotice({
    tone: 'info',
    title: 'Confirmation email sent',
    message:
      'We’ve sent you a verification link. Please check your inbox and spam folder to verify your account before logging in.',
  });

  return;
}




      if (outcome.kind === 'success') {
        navigate(ROUTES.connectWallet);
        return;
      }
      if (outcome.kind === 'rejected') {
        setNotice({ tone: 'error', title: 'We couldn’t create your account', message: outcome.message });
      } else {
        setNotice({
          tone: 'info',
          title: 'Account creation isn’t available yet',
          message:
            'This version of ZUKO isn’t connected to an authentication service yet, so no account was created.',
          previewNext: true,
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
      <p className="text-xs font-bold tracking-[0.18em] text-emerald-800">STEP 1 OF 2</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
        Start your journey with ZUKO.
      </h1>
      <p className="mt-2 text-base text-slate-600">
        Create your account and take the first step toward a clearer picture of your finances.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5" aria-busy={submitting}>
        {notice && (
          <FormNotice tone={notice.tone} title={notice.title}>
            {notice.message}
            {notice.previewNext && (
              <>
                {' '}
                You can still{' '}
                <Link
                  to={ROUTES.connectWallet}
                  className="font-semibold underline underline-offset-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
                >
                  preview the wallet step
                </Link>
                .
              </>
            )}
          </FormNotice>
        )}

        <TextField
          id="signup-name"
          name="name"
          label="Full name"
          autoComplete="name"
          value={values.name}
          onChange={update('name')}
          error={errors['signup-name']}
          disabled={submitting}
        />

        <TextField
          id="signup-email"
          name="email"
          type="email"
          label="Email address"
          autoComplete="email"
          inputMode="email"
          autoCapitalize="none"
          spellCheck={false}
          value={values.email}
          onChange={update('email')}
          error={errors['signup-email']}
          disabled={submitting}
        />

        <div>
          <PasswordField
            id="signup-password"
            name="new-password"
            label="Password"
            autoComplete="new-password"
            value={values.password}
            onChange={update('password')}
            error={errors['signup-password']}
            describedBy="signup-password-rules"
            disabled={submitting}
          />
          <PasswordRequirements id="signup-password-rules" value={values.password} />
        </div>

        <PasswordField
          id="signup-confirm"
          name="confirm-password"
          label="Confirm password"
          autoComplete="new-password"
          value={values.confirm}
          onChange={update('confirm')}
          error={errors['signup-confirm']}
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
          {submitting ? 'Creating account…' : 'Create Account'}
        </ActionButton>
      </form>

      <p className="mt-6 text-sm text-slate-600 text-center">
        Already have an account?{' '}
        <Link
          to={ROUTES.login}
          className="font-semibold text-emerald-800 underline underline-offset-2 hover:text-emerald-950 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
        >
          Log in
        </Link>
      </p>
    </AuthShell>
  );
};
