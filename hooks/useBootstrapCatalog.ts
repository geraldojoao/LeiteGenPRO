import { useEffect } from 'react';
import { useCatalogStore } from '@/store/catalogStore';

export function useBootstrapCatalog(): void {
  const hidratarCatalogo = useCatalogStore((state) => state.hidratarCatalogo);

  useEffect(() => {
    void hidratarCatalogo();
  }, [hidratarCatalogo]);
}
