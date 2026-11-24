import type { MouseEventHandler, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './Icon';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'whatsapp' | 'inverse';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: 'lg' | 'md';
  href?: string;
  icon?: string;
  iconLeft?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  loading?: boolean;
  onClick?: MouseEventHandler<HTMLElement>;
  className?: string;
  target?: string;
  'aria-controls'?: string;
  children: ReactNode;
}

/**
 * Button — variant: primary | secondary | ghost | whatsapp | inverse ; size: lg (52px) | md (44px)
 * Com `href` renderiza link (react-router para rotas internas), sem `href` renderiza <button>.
 */
export function Button({ variant = 'primary', size = 'md', href, icon, iconLeft, type = 'button', disabled, loading, onClick, className = '', target, children, ...rest }: ButtonProps) {
  const cls = `btn btn--${variant} btn--${size} ${className}`.trim();
  const iconSize = size === 'lg' ? 18 : 16;
  const content = (
    <>
      {loading ? <span className="spinner" aria-hidden="true" /> : iconLeft && <Icon name={iconLeft} size={iconSize + 2} />}
      <span className="btn__label">{children}</span>
      {icon && !loading && <Icon name={icon} size={iconSize} />}
    </>
  );
  if (href) {
    if (href.startsWith('/')) return <Link className={cls} to={href} {...rest}>{content}</Link>;
    return <a className={cls} href={href} target={target} rel={target === '_blank' ? 'noopener noreferrer' : undefined} {...rest}>{content}</a>;
  }
  return <button className={cls} type={type} disabled={disabled || loading} onClick={onClick} {...rest}>{content}</button>;
}
