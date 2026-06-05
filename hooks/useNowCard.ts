'use client';

import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_NOW_CARD_CONFIG, fetchNowCardData } from '@/lib/now-card';
import type { NowCardConfig, NowCardItem } from '@/lib/types/now-card';

export function useNowCard() {
  const [config, setConfig] = useState<NowCardConfig>(DEFAULT_NOW_CARD_CONFIG);
  const [items, setItems] = useState<NowCardItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await fetchNowCardData();
    setConfig(data.config);
    setItems(data.items);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { config, items, loading, refresh };
}
