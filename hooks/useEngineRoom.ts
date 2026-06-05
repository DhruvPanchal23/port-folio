'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchEngineRoomData } from '@/lib/engine-room';
import type { EngineRoomData } from '@/lib/types/engine-room';
import { DEFAULT_ENGINE_ROOM_CONFIG } from '@/lib/engine-room';

const EMPTY: EngineRoomData = {
  config: DEFAULT_ENGINE_ROOM_CONFIG,
  stats: [],
  navLinks: [],
  ctaButtons: [],
  sections: [],
  sectionItems: [],
};

export function useEngineRoom() {
  const [data, setData] = useState<EngineRoomData>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const result = await fetchEngineRoomData(true);
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { ...data, loading, error, refresh };
}
