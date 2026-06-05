'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchVisibleAboutGalleryItems } from '@/lib/about-gallery';
import type { AboutGalleryItem } from '@/lib/types/about-gallery';

export function useAboutGallery() {
  const [items, setItems] = useState<AboutGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await fetchVisibleAboutGalleryItems();
    setItems(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { items, loading, refresh };
}
