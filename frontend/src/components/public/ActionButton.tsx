import React from 'react';
import { Link, RoutePath } from '../../routing/router';

type Variant = 'primary' | 'outline' | 'light' | 'outlineLight';
type Size = 'md' | 'lg';

interface CommonProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
  className?: string;
  children: React.ReactNode;
}

type ButtonProps = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & { to?: undefined };
type LinkProps = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps | 'href'> & {
    to: RoutePath;
  };

/**
 * Public-page button. Mirrors the shape of components/shared/Button but uses
 * emerald-700 for primary (white-on-emerald-600 is below WCAG AA for body-size
 * text) and can render as a router link.
 */
export const ActionButton: React.FC<ButtonProps | LinkProps> = (props) => {
  const {
    variant = 'primary',
    size = 'md',
    fullWidth,
    icon,
    iconPosition = 'start',
    className = '',
    children,
    ...rest
  } = props;

  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors duration-200 select-none cursor-pointer min-h-11 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';
  const sizes: Record<Size, string> = {
    md: 'text-sm px-4 py-2.5',
    lg: 'text-base px-6 py-3',
  };
  const variants: Record<Variant, string> = {
    primary:
      'bg-emerald-700 text-white hover:bg-emerald-800 shadow-sm shadow-emerald-900/20 focus-visible:ring-emerald-600 focus-visible:ring-offset-white',
    outline:
      'bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 focus-visible:ring-slate-400 focus-visible:ring-offset-white',
    light:
      'bg-white text-emerald-950 hover:bg-emerald-50 focus-visible:ring-white focus-visible:ring-offset-emerald-950',
    outlineLight:
      'bg-transparent text-white border border-emerald-300/40 hover:bg-white/10 focus-visible:ring-white focus-visible:ring-offset-emerald-950',
  };
  const classes = `${base} ${sizes[size]} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`;

  const content = (
    <>
      {icon && iconPosition === 'start' && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'end' && <span className="shrink-0">{icon}</span>}
    </>
  );

  if ('to' in rest && rest.to) {
    const { to, ...anchorRest } = rest as Omit<LinkProps, keyof CommonProps>;
    return (
      <Link to={to} className={classes} {...anchorRest}>
        {content}
      </Link>
    );
  }

  const buttonRest = rest as Omit<ButtonProps, keyof CommonProps>;
  return (
    <button type="button" className={classes} {...buttonRest}>
      {content}
    </button>
  );
};
