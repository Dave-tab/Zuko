
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);

// env.js is in backend/src/config, so go up two levels.
const envPath = path.resolve(currentDir, '../../.env');

dotenv.config({ path: envPath });

export const env = {
  port: Number(process.env.PORT || 5000),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  bmoniBaseUrl: process.env.BMONI_BASE_URL || 'https://embedded-dev.bmoni.com',
  bmoniApiKey: process.env.BMONI_API_KEY,
  bmoniWebhookSecret: process.env.BMONI_WEBHOOK_SECRET,
};

export function assertSupabaseConfigured() {
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    throw new Error(
      'Missing SUPABASE_URL or SUPABASE_ANON_KEY in backend/.env'
    );
  }
}
