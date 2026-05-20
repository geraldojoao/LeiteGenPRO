import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { matrizesIniciais } from '@/data/matrizes';
import type { Matriz } from '@/types';

type MatrizInput = Omit<Matriz, 'id' | 'criadaEm' | 'atualizadaEm'>;

interface MatrizState {
  matrizes: Matriz[];
  adicionarMatriz: (matriz: MatrizInput) => Matriz;
  atualizarMatriz: (id: string, matriz: Partial<MatrizInput>) => void;
  removerMatriz: (id: string) => void;
  buscarPorId: (id: string) => Matriz | undefined;
}

const criarIdMatriz = (): string => `MAT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

export const useMatrizStore = create<MatrizState>()(
  persist(
    (set, get) => ({
      matrizes: matrizesIniciais,
      adicionarMatriz: (matrizInput) => {
        const agora = new Date().toISOString();
        const matriz: Matriz = {
          ...matrizInput,
          id: criarIdMatriz(),
          criadaEm: agora,
          atualizadaEm: agora,
        };

        set((state) => ({ matrizes: [matriz, ...state.matrizes] }));
        return matriz;
      },
      atualizarMatriz: (id, matriz) =>
        set((state) => ({
          matrizes: state.matrizes.map((item) =>
            item.id === id ? { ...item, ...matriz, atualizadaEm: new Date().toISOString() } : item,
          ),
        })),
      removerMatriz: (id) =>
        set((state) => ({
          matrizes: state.matrizes.filter((matriz) => matriz.id !== id),
        })),
      buscarPorId: (id) => get().matrizes.find((matriz) => matriz.id === id),
    }),
    {
      name: 'leitegen-pro:matrizes',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
