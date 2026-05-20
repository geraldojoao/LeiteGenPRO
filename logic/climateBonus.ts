import type { Bioma, RacaTouro, Touro } from '@/types';

const HOT_BIOMAS: Bioma[] = ['Cerrado', 'Semiárido', 'Amazônia', 'Tropical Úmido', 'Pantanal'];
const EUROPEAN_RACES: RacaTouro[] = ['Holandês', 'Jersey'];

/**
 * Calcula o ajuste climático aplicado ao ranking técnico do touro.
 *
 * O objetivo é aproximar o score da realidade produtiva brasileira: animais
 * com maior sangue zebuíno são favorecidos em clima quente, enquanto raças
 * europeias ganham força em sistemas do Sul/Frio. Penalidades explícitas
 * evitam recomendações frágeis, como Holandês puro em Semiárido.
 */
export function calcularBonusClimatico(touro: Touro, biomasSelecionados: Bioma[]): number {
  if (biomasSelecionados.length === 0) {
    return 0;
  }

  const selecionouClimaQuente = biomasSelecionados.some((bioma) => HOT_BIOMAS.includes(bioma));
  const selecionouSulFrio = biomasSelecionados.includes('Sul/Frio');
  let bonus = 0;

  if (selecionouClimaQuente && touro.grauSanguePuroZebu > 50) {
    bonus += 15;
  }

  if (biomasSelecionados.includes('Semiárido') && touro.raca === 'Holandês' && touro.grauSanguePuroZebu === 0) {
    bonus -= 20;
  }

  if (selecionouSulFrio && EUROPEAN_RACES.includes(touro.raca)) {
    bonus += 10;
  }

  if (selecionouSulFrio && touro.grauSanguePuroZebu >= 90) {
    bonus -= 15;
  }

  return bonus;
}
