import type { ResultadoROI, Touro } from '@/types';

/**
 * Simula o retorno financeiro esperado para uma compra de doses.
 *
 * A estimativa usa a metade do PTA do pai como ganho genético esperado por
 * progênie. Para sêmen sexado fêmea, o ganho é ponderado pela taxa média de
 * fêmeas nascidas, pois o valor comercial esperado está ligado à produção
 * leiteira futura das bezerras.
 */
export function simularROI(touro: Touro, precoLitroLeite: number, qtdDoses: number): ResultadoROI {
  const quantidade = Math.max(qtdDoses, 1);
  const precoLitro = Math.max(precoLitroLeite, 0);
  const taxaFemeas = touro.tipoSemen === 'Sexado Fêmea' ? 0.92 : 1;

  const ganhoEstimadoLitros = Number((touro.pta * 0.5 * taxaFemeas).toFixed(1));
  const valorMonetarioPorProgenie = Number((ganhoEstimadoLitros * precoLitro).toFixed(2));
  const custoTotal = Number((touro.precoPorDose * quantidade).toFixed(2));
  const valorMonetarioTotal = valorMonetarioPorProgenie * quantidade;
  const lucroLiquidoEstimado = Number((valorMonetarioTotal - custoTotal).toFixed(2));
  const roiPercentual = custoTotal > 0 ? Number(((lucroLiquidoEstimado / custoTotal) * 100).toFixed(1)) : 0;
  const paybackEmLactacoes =
    valorMonetarioTotal > 0 ? Number((custoTotal / valorMonetarioTotal).toFixed(1)) : 0;

  return {
    ganhoEstimadoLitros,
    valorMonetarioPorProgenie,
    custoTotal,
    roiPercentual,
    lucroLiquidoEstimado,
    paybackEmLactacoes,
  };
}
