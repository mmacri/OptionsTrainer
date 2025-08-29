import React from 'react';

export const TooltipProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export const Tooltip = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export const TooltipTrigger = ({ children }: { children: React.ReactNode }) => <span>{children}</span>;

export const TooltipContent = ({ children }: { children: React.ReactNode }) => (
  <div className="p-2 text-sm bg-black text-white rounded shadow" role="tooltip">
    {children}
  </div>
);
