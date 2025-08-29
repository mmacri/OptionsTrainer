import React, { createContext, useContext, useState } from 'react';

interface TabsContextValue {
  value: string;
  setValue: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

export const Tabs = ({ defaultValue, children }: { defaultValue: string; children: React.ReactNode }) => {
  const [value, setValue] = useState(defaultValue);
  return <TabsContext.Provider value={{ value, setValue }}>{children}</TabsContext.Provider>;
};

export const TabsList = ({ children }: { children: React.ReactNode }) => <div className="flex gap-2">{children}</div>;

export const TabsTrigger = ({ value, children }: { value: string; children: React.ReactNode }) => {
  const ctx = useContext(TabsContext)!;
  const active = ctx.value === value;
  return (
    <button
      className={`px-2 py-1 border-b-2 ${active ? 'border-blue-600' : 'border-transparent'}`}
      onClick={() => ctx.setValue(value)}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ value, children }: { value: string; children: React.ReactNode }) => {
  const ctx = useContext(TabsContext)!;
  return ctx.value === value ? <div className="mt-2">{children}</div> : null;
};
