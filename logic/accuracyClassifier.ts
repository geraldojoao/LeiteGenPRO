import { colors } from '@/constants/theme';
import type { NivelRisco } from '@/types';

/**
 * Classifica o risco de uso do touro com base na acurácia dos índices genéticos.
 *
 * Acurácias abaixo de 50% indicam animais jovens ou com baixa confiabilidade
 * estatística. A faixa intermediária ainda permite uso comercial, mas pede
 * diversificação. Acima de 85%, o touro é tratado como provado.
 */
export function classificarRisco(acuracia: number): NivelRisco {
  if (acuracia < 50) {
    return 'Jovem / Alto Risco';
  }

  if (acuracia <= 85) {
    return 'Intermediário';
  }

  return 'Provado / Baixo Risco';
}

/**
 * Retorna a cor institucional usada para comunicar risco genético nos badges.
 */
export function getRiskColor(nivel: NivelRisco): string {
  const riskColors: Record<NivelRisco, string> = {
    'Jovem / Alto Risco': colors.riskHigh,
    Intermediário: colors.riskMedium,
    'Provado / Baixo Risco': colors.riskLow,
  };

  return riskColors[nivel];
}

/**
 * Retorna o ícone MaterialCommunityIcons correspondente ao nível de risco.
 */
export function getRiskIcon(nivel: NivelRisco): string {
  const icons: Record<NivelRisco, string> = {
    'Jovem / Alto Risco': 'alert-circle',
    Intermediário: 'chart-timeline-variant-shimmer',
    'Provado / Baixo Risco': 'shield-check',
  };

  return icons[nivel];
}
