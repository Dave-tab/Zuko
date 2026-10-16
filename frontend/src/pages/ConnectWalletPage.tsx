import React, { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, ShieldCheck, Wallet } from 'lucide-react';
import { AuthShell } from '../components/public/AuthShell';
import { ActionButton } from '../components/public/ActionButton';
import { FormNotice } from '../components/public/FormFields';
import { ROUTES } from '../routing/router';
import { walletOnboardingService } from '../services/walletOnboardingService';

type WalletState =
  | { status: 'idle' }
  | { status: 'connecting' }
  | { status: 'unavailable' }
  | { status: 'failed'; message: string }
  | { status: 'connected'; providerName?: string }
  | { status: 'demo' };

export const ConnectWalletPage: React.FC = () => {
  const [state, setState] = useState<WalletState>({ status: 'idle' });
  const inFlight = useRef(false);

  const connecting = state.status === 'connecting';
  const connected = state.status === 'connected';
  const demoMode = state.status === 'demo';
  const hasAttempted = state.status === 'unavailable' || state.status === 'failed';

  const handleConnect = async () => {
    if (inFlight.current) return; // guard against duplicate requests
    inFlight.current = true;
    setState({ status: 'connecting' });
    try {
      const outcome = await walletOnboardingService.connectWallet();
      // "connected" is shown only when the service reports a real connection.
      if (outcome.kind === 'connected') {
        setState({ status: 'connected', providerName: outcome.providerName });
      } else if (outcome.kind === 'failed') {
        setState({ status: 'failed', message: outcome.message });
      } else {
        setState({ status: 'unavailable' });
      }
    } catch {
      setState({
        status: 'failed',
        message: 'We couldn’t reach the wallet service. Please try again in a moment.',
      });
    } finally {
      inFlight.current = false;
    }
  };
  
const handleDemo = () => {
  setState({ status: 'demo' });
};


  return (
    <AuthShell>
      <p className="text-xs font-bold tracking-[0.18em] text-emerald-800">STEP 2 OF 2</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Connect your wallet.</h1>
      <p className="mt-2 text-base text-slate-600">
        Complete your wallet setup to continue your ZUKO onboarding.
      </p>

      <section aria-labelledby="wallet-why" className="mt-8">
        <h2 id="wallet-why" className="text-sm font-bold text-slate-900">
          Why this step?
        </h2>
        <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
          Your wallet balance is shown exactly as your wallet reports it, separately from your
          income, expenses, budgets and goals. Connecting a wallet is what lets ZUKO show it.
        </p>
      </section>

      {/* Honest, always-visible connection state */}
      <div
        className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4"
        aria-live="polite"
      >
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${
              connected ? 'bg-emerald-100 text-emerald-800' : 'bg-white border border-slate-200 text-slate-500'
            }`}
          >
            {connected ? <CheckCircle2 className="w-5 h-5" /> : <Wallet className="w-5 h-5" />}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900">
              Wallet status:{' '}
              <span className={connected ? 'text-emerald-800' : 'text-slate-700'}>
                {demoMode
  ? 'Demo mode'
  : connected
    ? 'Connected'
    : connecting
      ? 'Connecting…'
      : 'Not connected'}
              </span>
            </p>
            
<p className="mt-0.5 text-sm text-slate-600 leading-relaxed">
  {demoMode
    ? 'You’re exploring ZUKO with simulated wallet data. No real bank account is connected.'
    : connected
      ? state.status === 'connected' && state.providerName
        ? `Your wallet is connected through ${state.providerName}.`
        : 'Your wallet is connected.'
      : 'No wallet provider is connected to this version of ZUKO yet.'}
</p>

          </div>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {state.status === 'unavailable' && (
          <FormNotice tone="info" title="Wallet connection isn’t available yet">
            Nothing was connected and no balance was fetched. This step will work once a wallet
            provider is integrated.
          </FormNotice>
        )}
        {state.status === 'failed' && (
          <FormNotice tone="error" title="We couldn’t connect your wallet">
            {state.message}
          </FormNotice>
        )}

        {connected || demoMode ? (
          <ActionButton
            size="lg"
            fullWidth
            to={ROUTES.app}
            icon={<ArrowRight className="w-4 h-4" aria-hidden="true" />}
            iconPosition="end"
          >
            Continue
          </ActionButton>
        ) : (
          <ActionButton
            size="lg"
            fullWidth
            onClick={handleConnect}
            disabled={connecting}
            aria-busy={connecting}
            icon={
              connecting ? (
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              ) : (
                <Wallet className="w-4 h-4" aria-hidden="true" />
              )
            }
          >
      {connecting
  ? 'Connecting…'
  : hasAttempted
    ? 'Try Again'
    : 'Connect Wallet'}
          </ActionButton>
        )}

        
{!connected && !demoMode && (
  <ActionButton
    variant="outline"
    size="lg"
    fullWidth
    onClick={handleDemo}
  >
    Try Demo Wallet
  </ActionButton>
)}


        <ActionButton
          variant="outline"
          fullWidth
          to={ROUTES.signup}
          icon={<ArrowLeft className="w-4 h-4" aria-hidden="true" />}
        >
          Back
        </ActionButton>
      </div>

      <p className="mt-6 flex items-start gap-2 text-sm text-slate-600">
        <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-emerald-800" aria-hidden="true" />
        <span>
          ZUKO will never ask for your seed phrase, private key, or the password to another
          financial service.
        </span>
      </p>
    </AuthShell>
  );
};
