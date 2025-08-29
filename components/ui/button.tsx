import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', ...props }, ref) => {
    const base = 'px-4 py-2 rounded focus:outline-none focus:ring';
    const variants: Record<string, string> = {
      default: 'bg-blue-600 text-white hover:bg-blue-700',
      outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50',
    };
    return (
      <button ref={ref} className={`${base} ${variants[variant]} ${className}`} {...props} />
    );
  }
);
Button.displayName = 'Button';
