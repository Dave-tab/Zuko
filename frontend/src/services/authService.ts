
import { supabase } from '../lib/supabase';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpDetails {
  fullName: string;
  email: string;
  password: string;
}

export type AuthOutcome =
  | { kind: 'success' }
  | { kind: 'confirmation_required' }
  | { kind: 'unavailable' }
  | { kind: 'rejected'; message: string };

export interface IAuthService {
  logIn(credentials: LoginCredentials): Promise<AuthOutcome>;
  signUp(details: SignUpDetails): Promise<AuthOutcome>;
}

function safeErrorMessage(message: string): string {
  const error = message.toLowerCase();

  if (
    error.includes('invalid login credentials') ||
    error.includes('invalid credentials')
  ) {
    return 'Incorrect email or password. Please check your details and try again.';
  }

  if (error.includes('email not confirmed')) {
    return 'Please verify your email address before logging in.';
  }

  if (error.includes('already registered')) {
    return 'An account with this email may already exist. Try logging in instead.';
  }

  if (error.includes('password')) {
    return 'Please check your password and try again.';
  }

  if (error.includes('network') || error.includes('fetch')) {
    return 'Unable to connect. Check your internet connection and try again.';
  }

  return 'Something went wrong. Please try again.';
}

export const authService: IAuthService = {
  async logIn({ email, password }) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        kind: 'rejected',
        message: safeErrorMessage(error.message),
      };
    }

    return { kind: 'success' };
  },

  async signUp({ fullName, email, password }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
options: {
  data: {
    full_name: fullName,
  },
  emailRedirectTo: `${window.location.origin}/login`,
},
    });

    if (error) {
      return {
        kind: 'rejected',
        message: safeErrorMessage(error.message),
      };
    }

    if (!data.session) {
      return { kind: 'confirmation_required' };
    }

    return { kind: 'success' };
  },
};
