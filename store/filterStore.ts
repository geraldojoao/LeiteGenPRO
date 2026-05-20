import { create } from 'zustand';
import { PESOS_PADRAO } from '@/constants/domain';
import type { Bioma, FiltrosAtivos, PesosSelecao, RacaTouro, TipoSemen } from '@/types';

export type OrdenacaoBusca = 'score' | 'pta' | 'preco';

interface FilterState {
  filtros: FiltrosAtivos;
  ordenacao: OrdenacaoBusca;
  setOrdenacao: (ordenacao: OrdenacaoBusca) => void;
  setFiltro: <K extends keyof FiltrosAtivos>(chave: K, valor: FiltrosAtivos[K]) => void;
  toggleRaca: (raca: RacaTouro) => void;
  toggleTipoSemen: (tipo: TipoSemen) => void;
  toggleBioma: (bioma: Bioma) => void;
  setPesosPersonalizados: (pesos: PesosSelecao) => void;
  resetFiltros: () => void;
}

const toggleValue = <T,>(values: T[] | undefined, value: T): T[] => {
  const current = values ?? [];
  return current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
};

export const filtrosPadrao: FiltrosAtivos = {
  acuraciaMinima: 0,
  ptaLeiteMínimo: 0,
  precoMaximo: 450,
  compostoUbereMinimo: 1,
  estaturaMinima: 1,
  pernasEPesMinimo: 1,
  pesosPersonalizados: PESOS_PADRAO,
};

export const useFilterStore = create<FilterState>((set) => ({
  filtros: filtrosPadrao,
  ordenacao: 'score',
  setOrdenacao: (ordenacao) => set({ ordenacao }),
  setFiltro: (chave, valor) =>
    set((state) => ({
      filtros: {
        ...state.filtros,
        [chave]: valor,
      },
    })),
  toggleRaca: (raca) =>
    set((state) => ({
      filtros: {
        ...state.filtros,
        raca: toggleValue(state.filtros.raca, raca),
      },
    })),
  toggleTipoSemen: (tipo) =>
    set((state) => ({
      filtros: {
        ...state.filtros,
        tipoSemen: toggleValue(state.filtros.tipoSemen, tipo),
      },
    })),
  toggleBioma: (bioma) =>
    set((state) => ({
      filtros: {
        ...state.filtros,
        bioma: toggleValue(state.filtros.bioma, bioma),
      },
    })),
  setPesosPersonalizados: (pesos) =>
    set((state) => ({
      filtros: {
        ...state.filtros,
        pesosPersonalizados: pesos,
      },
    })),
  resetFiltros: () => set({ filtros: filtrosPadrao, ordenacao: 'score' }),
}));
