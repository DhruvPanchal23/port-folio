'use client';

import { createContext, useCallback, useContext, useMemo, useState, type Dispatch, type SetStateAction } from 'react';

type CommandMenuContextValue = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  toggle: () => void;
};

const CommandMenuContext = createContext<CommandMenuContextValue | null>(null);

export function CommandMenuProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((o) => !o), []);

  const value = useMemo(() => ({ open, setOpen, toggle }), [open, toggle]);

  return <CommandMenuContext.Provider value={value}>{children}</CommandMenuContext.Provider>;
}

export function useCommandMenu() {
  const ctx = useContext(CommandMenuContext);
  if (!ctx) {
    throw new Error('useCommandMenu must be used within CommandMenuProvider');
  }
  return ctx;
}
