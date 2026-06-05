'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { usePortfolioSettings } from '@/hooks/usePortfolioSettings';
import type { PortfolioSettingsMap } from '@/lib/types/portfolio-settings';

type PortfolioSettingsContextValue = {
  settings: PortfolioSettingsMap;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  setSettings: React.Dispatch<React.SetStateAction<PortfolioSettingsMap>>;
};

const PortfolioSettingsContext = createContext<PortfolioSettingsContextValue | null>(null);

export function PortfolioSettingsProvider({ children }: { children: ReactNode }) {
  const value = usePortfolioSettings();
  return (
    <PortfolioSettingsContext.Provider value={value}>{children}</PortfolioSettingsContext.Provider>
  );
}

export function usePortfolioSettingsContext() {
  const ctx = useContext(PortfolioSettingsContext);
  if (!ctx) {
    throw new Error('usePortfolioSettingsContext must be used within PortfolioSettingsProvider');
  }
  return ctx;
}
