import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline';
}

export const Badge = ({ className = '', variant = 'default', ...props }: BadgeProps) => {
  const base = 'inline-flex items-center px-2 py-1 text-xs rounded border';
  const variants: Record<string, string> = {
    default: 'bg-gray-100 text-gray-800 border-gray-200',
    outline: 'bg-white text-gray-800 border-gray-300',
  };
  return <span className={`${base} ${variants[variant]} ${className}`} {...props} />;
};
