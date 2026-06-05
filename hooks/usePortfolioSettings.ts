'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  DEFAULT_PROFILE,
  DEFAULT_RESUME,
  DEFAULT_SITE,
  DEFAULT_SOCIAL,
  fetchPortfolioSettings,
} from '@/lib/portfolio-settings';
import type { PortfolioSettingsMap } from '@/lib/types/portfolio-settings';

const INITIAL: PortfolioSettingsMap = {
  profile: DEFAULT_PROFILE,
  resume: DEFAULT_RESUME,
  social: DEFAULT_SOCIAL,
  site: DEFAULT_SITE,
};

export function usePortfolioSettings() {
  const [settings, setSettings] = useState<PortfolioSettingsMap>(INITIAL);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPortfolioSettings();
      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { settings, loading, error, refresh, setSettings };
}
