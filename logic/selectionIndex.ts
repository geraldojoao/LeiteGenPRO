import { touros } from '@/data/touros';
import type { PesosSelecao, RacaTouro, Touro } from '@/types';

type NumericSelector = (touro: Touro) => number;

const clamp = (value: number, min = 0, max = 100): number => Math.min(Math.max(value, min), max);

const average = (values: number[]): number => values.reduce((sum, value) => sum + value, 0) / Math.max(values.length, 1);

const standardDeviation = (values: number[], mean: number): number => {
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / Math.max(values.length, 1);
  return Math.sqrt(variance) || 1;
};

function scoreZPorRaca(touro: Touro, selector: NumericSelector, inverter = false): number {
  const grupo = touros.filter((item) => item.raca === touro.raca);
  const valores = grupo.map(selector);
  const media = average(valores);
  const desvio = standardDeviation(valores, media);
  const valor = selector(touro);
  const zScore = inverter ? (media - valor) / desvio : (valor - media) / desvio;

  return clamp(50 + zScore * 15);
}

function scoreFenotipoPorRaca(touro: Touro): number {
  return scoreZPorRaca(touro, (item) => {
    const fenotipo = item.fenotipo;
    return (
      fenotipo.estatura * 0.08 +
      fenotipo.profundidadeCorporal * 0.12 +
      fenotipo.compostoUbere * 0.3 +
      fenotipo.inserçãoUberePosterior * 0.14 +
      fenotipo.ligamentoCentral * 0.12 +
      fenotipo.pernasEPes * 0.18 +
      fenotipo.anguloGarupa * 0.06
    );
  });
}

function normalizarPesos(pesos: PesosSelecao): PesosSelecao {
  const soma = Object.values(pesos).reduce((total, value) => total + value, 0);

  if (soma === 100) {
    return pesos;
  }

  const fator = soma === 0 ? 0 : 100 / soma;

  return {
    leite: pesos.leite * fator,
    gordura: pesos.gordura * fator,
    proteina: pesos.proteina * fator,
    vidaProdutiva: pesos.vidaProdutiva * fator,
    celulaSomatica: pesos.celulaSomatica * fator,
    facilidadeParto: pesos.facilidadeParto * fator,
    fenotipo: pesos.fenotipo * fator,
  };
}

/**
 * Normaliza uma DEP específica dentro da raça do touro usando Z-score.
 *
 * A comparação dentro da raça evita distorções entre bases genéticas muito
 * diferentes, como Holandês e Gir Leiteiro. Para célula somática, valores
 * menores são favoráveis, então o score é invertido.
 */
export function normalizarDEPPorRaca(
  touro: Touro,
  dep: keyof Pick<
    Touro['deps'],
    'leite' | 'gordura' | 'proteina' | 'vidaProdutiva' | 'celulaSomatica' | 'facilidadeParto'
  >,
): number {
  const inverter = dep === 'celulaSomatica';
  return scoreZPorRaca(touro, (item) => item.deps[dep], inverter);
}

/**
 * Calcula um índice de seleção personalizado para um touro.
 *
 * Cada DEP é normalizada numa escala 0-100 em relação ao catálogo da própria
 * raça. Em seguida, os pesos definidos pelo produtor são aplicados. A soma dos
 * pesos é ajustada automaticamente para 100 quando o usuário edita sliders.
 */
export function calcularIndiceSelecao(touro: Touro, pesos: PesosSelecao): number {
  const pesosNormalizados = normalizarPesos(pesos);
  const componentes: Record<keyof PesosSelecao, number> = {
    leite: normalizarDEPPorRaca(touro, 'leite'),
    gordura: normalizarDEPPorRaca(touro, 'gordura'),
    proteina: normalizarDEPPorRaca(touro, 'proteina'),
    vidaProdutiva: normalizarDEPPorRaca(touro, 'vidaProdutiva'),
    celulaSomatica: normalizarDEPPorRaca(touro, 'celulaSomatica'),
    facilidadeParto: normalizarDEPPorRaca(touro, 'facilidadeParto'),
    fenotipo: scoreFenotipoPorRaca(touro),
  };

  const score = (Object.keys(componentes) as (keyof PesosSelecao)[]).reduce(
    (total, chave) => total + componentes[chave] * (pesosNormalizados[chave] / 100),
    0,
  );

  return Number(clamp(score).toFixed(1));
}

/**
 * Retorna os limites de PTA por raça para calibrar sliders e mensagens da UI.
 */
export function obterFaixaPTAPorRaca(raca: RacaTouro): { minimo: number; maximo: number } {
  const valores = touros.filter((touro) => touro.raca === raca).map((touro) => touro.pta);

  return {
    minimo: Math.min(...valores),
    maximo: Math.max(...valores),
  };
}
