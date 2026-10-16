/**
 * WALLET ONBOARDING INTEGRATION BOUNDARY
 *
 * docs/integrations/bmoni.md states that BMONI is NOT integrated and that no
 * provider endpoints, mock provider payloads or client-side provider
 * credentials may be invented. The documentation also does not define a
 * frontend wallet-onboarding contract (inputs, redirect/consent flow, etc.).
 *
 * This page is therefore provider-neutral: it asks the service to connect and
 * renders whatever the service honestly reports. When the backend developer
 * defines the real contract, extend `WalletConnectionOutcome` / the method
 * signature and implement `connectWallet` against the authenticated server
 * endpoint. Provider secrets must stay server-side (see docs, "Zero Client
 * Secrets").
 */

export type WalletConnectionOutcome =
  /** Return ONLY after the server has confirmed a real wallet connection. */
  | { kind: 'connected'; providerName?: string }
  /** No wallet provider is wired up to this build. */
  | { kind: 'unavailable' }
  /** The service responded with a failure; `message` is user-safe. */
  | { kind: 'failed'; message: string };

export interface IWalletOnboardingService {
  connectWallet(): Promise<WalletConnectionOutcome>;
}

export const walletOnboardingService: IWalletOnboardingService = {
  // TODO(backend): call the authenticated wallet-onboarding endpoint here.
  async connectWallet() {
    return { kind: 'unavailable' };
  },
};
