import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface FavoritesState {
  favoritos: string[];
  adicionarFavorito: (touroId: string) => void;
  removerFavorito: (touroId: string) => void;
  isFavorito: (touroId: string) => boolean;
  toggleFavorito: (touroId: string) => void;
  limparFavoritos: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoritos: [],
      adicionarFavorito: (touroId) =>
        set((state) => ({
          favoritos: Array.from(new Set([...state.favoritos, touroId])),
        })),
      removerFavorito: (touroId) =>
        set((state) => ({
          favoritos: state.favoritos.filter((id) => id !== touroId),
        })),
      isFavorito: (touroId) => get().favoritos.includes(touroId),
      toggleFavorito: (touroId) =>
        set((state) => ({
          favoritos: state.favoritos.includes(touroId)
            ? state.favoritos.filter((id) => id !== touroId)
            : Array.from(new Set([...state.favoritos, touroId])),
        })),
      limparFavoritos: () => set({ favoritos: [] }),
    }),
    {
      name: 'leitegen-pro:favoritos',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
