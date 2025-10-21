import React from 'react';

/**
 * General purpose Button component for consistent UI.
 *
 * Usage:
 * - Use <Button> for all interactive button needs in the app.
 * - Use the `variant` prop to select style: 'primary' (main action), 'secondary' (less prominent), 'ghost' (minimal, for toolbars or inline actions).
 * - Use the `size` prop for different button sizes: 'normal' (default), 'small' (compact UIs, toolbars), 'large' (prominent actions).
 * - Pass any native button props (onClick, disabled, etc.).
 *
 * Example:
 *   <Button variant="primary" size="large">Save</Button>
 *   <Button variant="secondary" size="small">Cancel</Button>
 */
import './design/components.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'normal' | 'small' | 'large';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'normal',
  className = '',
  children,
  ...props
}) => {
  let variantClass = 'themed-btn';
  if (variant === 'primary') variantClass += ' themed-btn-primary';
  if (variant === 'secondary') variantClass += ' themed-btn-secondary';
  if (variant === 'ghost') variantClass += ' themed-btn-ghost';

  let sizeClass = '';
  if (size === 'small') sizeClass = 'themed-btn-small';
  if (size === 'large') sizeClass = 'themed-btn-large';

  return (
    <button className={`${variantClass} ${sizeClass} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
};

export default Button;
