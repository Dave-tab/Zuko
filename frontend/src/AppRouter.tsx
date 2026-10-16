import { useEffect } from 'react';
import { MotionConfig } from 'motion/react';
import App from './App';
import { navigate, resolveRoute, usePathname } from './routing/router';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { ConnectWalletPage } from './pages/ConnectWalletPage';

const DEFAULT_TITLE = 'Zuko - Student Financial Intelligence';

const TITLES: Record<string, string> = {
  '/login': 'Log in · ZUKO',
  '/signup': 'Sign up · ZUKO',
  '/connect-wallet': 'Connect your wallet · ZUKO',
};

/**
 * Top-level route switch. Public pages render on their own; the existing
 * financial application (App) is mounted unchanged at /app.
 */
export default function AppRouter() {
  const pathname = usePathname();
  const route = resolveRoute(pathname);

  useEffect(() => {
    // Unknown URL: fall back to the landing page.
    if (route === null) navigate('/', { replace: true });
  }, [route]);

  useEffect(() => {
    document.title = (route && TITLES[route]) || DEFAULT_TITLE;
  }, [route]);

  let page;
  switch (route) {
    case '/login':
      page = <LoginPage />;
      break;
    case '/signup':
      page = <SignUpPage />;
      break;
    case '/connect-wallet':
      page = <ConnectWalletPage />;
      break;
    case '/app':
      page = <App />;
      break;
    default:
      page = <LandingPage />;
  }

  // reducedMotion="user" disables transform animations for users who request it.
  return <MotionConfig reducedMotion="user">{page}</MotionConfig>;
}
