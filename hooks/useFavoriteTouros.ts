import { useMemo } from 'react';
import { useCatalogStore } from '@/store/catalogStore';
import { useFavoritesStore } from '@/store/favoritesStore';
import type { Touro } from '@/types';

export function useFavoriteTouros(): {
  favoriteIds: string[];
  touros: Touro[];
  total: number;
} {
  const catalogo = useCatalogStore((state) => state.catalogo);
  const favoritos = useFavoritesStore((state) => state.favoritos);

  return useMemo(() => {
    const favoriteIds = Array.from(new Set(favoritos));
    const catalogoPorId = new Map(catalogo.map((touro) => [touro.id, touro]));
    const touros = favoriteIds
      .map((id) => catalogoPorId.get(id))
      .filter((touro): touro is Touro => Boolean(touro));

    return {
      favoriteIds,
      touros,
      total: touros.length,
    };
  }, [catalogo, favoritos]);
}
