import React from 'react';
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
