import { supabase } from '../lib/supabase';
import type { Transaction } from '../types/finance';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

async function getAccessToken(): Promise<string> {
  const { data, error } = await supabase.auth.getSession();

  if (error || !data.session?.access_token) {
    throw new Error('Please log in again to continue.');
  }

  return data.session.access_token;
}

async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getAccessToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Request failed.');
  }

  return result as T;
}

export function getSavedTransactions(): Promise<Transaction[]> {
  return apiRequest<Transaction[]>('/api/transactions');
}

export function saveTransaction(
  transaction: Omit<Transaction, 'id'>,
): Promise<Transaction> {
  return apiRequest<Transaction>('/api/transactions', {
    method: 'POST',
    body: JSON.stringify(transaction),
  });
}