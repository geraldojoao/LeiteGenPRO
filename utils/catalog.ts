import { calcularBonusClimatico } from '@/logic/climateBonus';
import { calcularIndiceSelecao } from '@/logic/selectionIndex';
import type { FiltrosAtivos, PesosSelecao, Touro } from '@/types';
import type { OrdenacaoBusca } from '@/store/filterStore';

export interface TouroRankeado {
  touro: Touro;
  score: number;
  bonusClimatico: number;
}

export function filtrarTouros(catalogo: Touro[], filtros: FiltrosAtivos): Touro[] {
  return catalogo.filter((touro) => {
    if (filtros.raca?.length && !filtros.raca.includes(touro.raca)) {
      return false;
    }

    if (filtros.tipoSemen?.length && !filtros.tipoSemen.includes(touro.tipoSemen)) {
      return false;
    }

    if (filtros.bioma?.length && !filtros.bioma.some((bioma) => touro.biomas.includes(bioma))) {
      return false;
    }

    if (typeof filtros.acuraciaMinima === 'number' && touro.acuracia < filtros.acuraciaMinima) {
      return false;
    }

    if (typeof filtros.ptaLeiteMínimo === 'number' && touro.pta < filtros.ptaLeiteMínimo) {
      return false;
    }

    if (typeof filtros.precoMaximo === 'number' && touro.precoPorDose > filtros.precoMaximo) {
      return false;
    }

    if (typeof filtros.compostoUbereMinimo === 'number' && touro.fenotipo.compostoUbere < filtros.compostoUbereMinimo) {
      return false;
    }

    if (typeof filtros.estaturaMinima === 'number' && touro.fenotipo.estatura < filtros.estaturaMinima) {
      return false;
    }

    if (typeof filtros.pernasEPesMinimo === 'number' && touro.fenotipo.pernasEPes < filtros.pernasEPesMinimo) {
      return false;
    }

    return true;
  });
}

export function rankearTouros(
  catalogo: Touro[],
  filtros: FiltrosAtivos,
  ordenacao: OrdenacaoBusca,
  pesos: PesosSelecao,
): TouroRankeado[] {
  const filtrados = filtrarTouros(catalogo, filtros);

  return filtrados
    .map((touro) => {
      const bonusClimatico = calcularBonusClimatico(touro, filtros.bioma ?? []);
      const score = Number((calcularIndiceSelecao(touro, pesos) + bonusClimatico).toFixed(1));
      return { touro, score, bonusClimatico };
    })
    .sort((a, b) => {
      if (ordenacao === 'pta') {
        return b.touro.pta - a.touro.pta;
      }

      if (ordenacao === 'preco') {
        return a.touro.precoPorDose - b.touro.precoPorDose;
      }

      return b.score - a.score;
    });
}

export function tourosDestaque(catalogo: Touro[], limite = 5): Touro[] {
  return [...catalogo].sort((a, b) => b.pta - a.pta).slice(0, limite);
}

export function tourosMaisAcessados(catalogo: Touro[], limite = 3): Touro[] {
  return [...catalogo]
    .sort((a, b) => b.acuracia + b.fenotipo.compostoUbere - (a.acuracia + a.fenotipo.compostoUbere))
    .slice(0, limite);
}
