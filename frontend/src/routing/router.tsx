import React, { useSyncExternalStore } from 'react';

/**
 * Minimal History-API router.
 *
 * The existing app has no router (App.tsx switches pages with local state), and
 * the public pages only need four URL destinations, so this avoids adding a
 * dependency. The signed-in financial application is mounted untouched at /app.
 */
export const ROUTES = {
  landing: '/',
  login: '/login',
  signup: '/signup',
  connectWallet: '/connect-wallet',
  app: '/app',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

const KNOWN_PATHS = new Set<string>(Object.values(ROUTES));
const NAVIGATE_EVENT = 'zuko:navigate';

function normalize(pathname: string): string {
  const trimmed = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return trimmed || '/';
}

/** Returns the matching route, or null for an unknown path. */
export function resolveRoute(pathname: string): RoutePath | null {
  const path = normalize(pathname);
  return KNOWN_PATHS.has(path) ? (path as RoutePath) : null;
}

function subscribe(callback: () => void) {
  window.addEventListener('popstate', callback);
  window.addEventListener(NAVIGATE_EVENT, callback);
  return () => {
    window.removeEventListener('popstate', callback);
    window.removeEventListener(NAVIGATE_EVENT, callback);
  };
}

export function usePathname(): string {
  return useSyncExternalStore(
    subscribe,
    () => window.location.pathname,
    () => '/'
  );
}

export function navigate(to: RoutePath, options: { replace?: boolean } = {}) {
  if (normalize(window.location.pathname) !== to) {
    if (options.replace) {
      window.history.replaceState(null, '', to);
    } else {
      window.history.pushState(null, '', to);
    }
    window.dispatchEvent(new Event(NAVIGATE_EVENT));
  }
  window.scrollTo({ top: 0, behavior: 'instant' });
}

type LinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  to: RoutePath;
};

/** Real <a href> (works with open-in-new-tab, copy link) that navigates client-side. */
export const Link: React.FC<LinkProps> = ({ to, onClick, children, ...rest }) => {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      rest.target === '_blank'
    ) {
      return;
    }
    event.preventDefault();
    navigate(to);
  };

  return (
    <a href={to} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
};
