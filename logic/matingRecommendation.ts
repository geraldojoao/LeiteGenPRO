import { PESOS_PADRAO } from '@/constants/domain';
import { calcularBonusClimatico } from '@/logic/climateBonus';
import { calcularIndiceSelecao } from '@/logic/selectionIndex';
import type { Matriz, RecomendacaoTouro, Touro } from '@/types';

function ancestralidadeConhecida(matriz: Matriz): string[] {
  if (matriz.genealogia.genealogiaDesconhecida) {
    return [];
  }

  return [
    matriz.genealogia.pai,
    matriz.genealogia.mae,
    matriz.genealogia.avoPaterno,
    matriz.genealogia.avoMaterno,
  ].filter(Boolean);
}

function temParentescoRelevante(touro: Touro, matriz: Matriz): boolean {
  const ancestrais = ancestralidadeConhecida(matriz).map((item) => item.toLowerCase());
  const termosTouro = [touro.nome, touro.registro].map((item) => item.toLowerCase());

  return ancestrais.some((ancestral) => termosTouro.some((termo) => termo.includes(ancestral) || ancestral.includes(termo)));
}

/**
 * Sugere touros complementares para uma matriz a partir de pontos fracos de
 * fenótipo e dados de genealogia disponíveis.
 *
 * A recomendação prioriza touros que compensam características abaixo de 6,
 * evita parentesco detectável quando a genealogia é conhecida e mantém o
 * índice de seleção como base de qualidade genética.
 */
export function sugerirTourosComplementares(matriz: Matriz, catalogo: Touro[]): RecomendacaoTouro[] {
  const pontosFracos = {
    estatura: (matriz.fenotipo.estatura ?? 7) < 6,
    profundidadeCorporal: (matriz.fenotipo.profundidadeCorporal ?? 7) < 6,
    compostoUbere: (matriz.fenotipo.compostoUbere ?? 7) < 6,
    pernasEPes: (matriz.fenotipo.pernasEPes ?? 7) < 6,
  };

  return catalogo
    .filter((touro) => !temParentescoRelevante(touro, matriz))
    .map((touro) => {
      const justificativas: string[] = [];
      let bonusComplementar = 0;

      if (pontosFracos.estatura && touro.fenotipo.estatura >= 6) {
        bonusComplementar += 8;
        justificativas.push('corrige estatura sem exagerar porte');
      }

      if (pontosFracos.profundidadeCorporal && touro.fenotipo.profundidadeCorporal >= 7) {
        bonusComplementar += 8;
        justificativas.push('melhora profundidade corporal');
      }

      if (pontosFracos.compostoUbere && touro.fenotipo.compostoUbere >= 8) {
        bonusComplementar += 12;
        justificativas.push('fortalece composto de úbere');
      }

      if (pontosFracos.pernasEPes && touro.fenotipo.pernasEPes >= 8) {
        bonusComplementar += 10;
        justificativas.push('compensa pernas e pés');
      }

      if (touro.deps.celulaSomatica < 0) {
        bonusComplementar += 4;
        justificativas.push('favorece saúde de úbere');
      }

      if (justificativas.length === 0) {
        justificativas.push('mantém equilíbrio genético sem parentesco detectado');
      }

      const scoreBase = calcularIndiceSelecao(touro, PESOS_PADRAO);
      const bonusClimatico = calcularBonusClimatico(touro, touro.biomas);

      return {
        touro,
        justificativas,
        score: Number((scoreBase + bonusComplementar + bonusClimatico * 0.25).toFixed(1)),
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}
