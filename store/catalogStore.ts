import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { touros as catalogoInicial } from '@/data/touros';
import type { Touro } from '@/types';

const CATALOGO_CACHE_KEY = 'leitegen-pro:catalogo-touros';
const CATALOGO_CACHE_DATE_KEY = 'leitegen-pro:catalogo-touros:updated-at';

interface SyncStorage {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
  delete: (key: string) => void;
}

function criarStorageMMKV(): SyncStorage | null {
  try {
    const { MMKV } = require('react-native-mmkv') as typeof import('react-native-mmkv');
    return new MMKV({ id: 'leitegen-pro-cache' });
  } catch {
    return null;
  }
}

const mmkvStorage = criarStorageMMKV();

interface CatalogState {
  catalogo: Touro[];
  isHydrated: boolean;
  ultimaSincronizacao?: string;
  hidratarCatalogo: () => Promise<void>;
  refreshCacheLocal: (catalogo?: Touro[]) => Promise<void>;
}

async function lerCatalogoDoCache(): Promise<Touro[] | null> {
  const raw = mmkvStorage?.getString(CATALOGO_CACHE_KEY) ?? (await AsyncStorage.getItem(CATALOGO_CACHE_KEY));

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as Touro[];
  } catch {
    mmkvStorage?.delete(CATALOGO_CACHE_KEY);
    await AsyncStorage.removeItem(CATALOGO_CACHE_KEY);
    return null;
  }
}

export const useCatalogStore = create<CatalogState>((set, get) => ({
  catalogo: catalogoInicial,
  isHydrated: false,
  ultimaSincronizacao: undefined,
  hidratarCatalogo: async () => {
    const cachedCatalogo = await lerCatalogoDoCache();

    if (cachedCatalogo?.length) {
      const ultimaSincronizacao =
        mmkvStorage?.getString(CATALOGO_CACHE_DATE_KEY) ??
        (await AsyncStorage.getItem(CATALOGO_CACHE_DATE_KEY)) ??
        undefined;

      set({
        catalogo: cachedCatalogo,
        isHydrated: true,
        ultimaSincronizacao,
      });
      return;
    }

    await get().refreshCacheLocal(catalogoInicial);
  },
  refreshCacheLocal: async (catalogo = catalogoInicial) => {
    const agora = new Date().toISOString();
    const serializedCatalogo = JSON.stringify(catalogo);

    mmkvStorage?.set(CATALOGO_CACHE_KEY, serializedCatalogo);
    mmkvStorage?.set(CATALOGO_CACHE_DATE_KEY, agora);
    await AsyncStorage.multiSet([
      [CATALOGO_CACHE_KEY, serializedCatalogo],
      [CATALOGO_CACHE_DATE_KEY, agora],
    ]);

    set({ catalogo, isHydrated: true, ultimaSincronizacao: agora });
  },
}));
