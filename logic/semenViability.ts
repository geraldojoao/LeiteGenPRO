import type { AlertaIATF, QualidadeSemen, TipoSemen } from '@/types';

/**
 * Analisa a qualidade seminal, calcula um score composto e estima o custo por
 * fêmea nascida. O alerta de IATF segue regra conservadora: motilidade abaixo
 * de 40% ou vigor abaixo de 3 exige atenção de protocolo.
 */
export function analisarSemen(
  qualidade: QualidadeSemen,
  tipoSemen: TipoSemen,
  precoDose: number,
): {
  alerta: AlertaIATF;
  scoreFinal: number;
  custoFemeaNascida: number;
} {
  const alerta: AlertaIATF =
    qualidade.motilidade < 40 || qualidade.vigor < 3 ? 'Atenção ao Protocolo de IATF' : qualidade.alerta;

  const motilidadeScore = qualidade.motilidade;
  const vigorScore = (qualidade.vigor / 5) * 100;
  const morfologiaScore = qualidade.morfologia;
  const concentracaoScore = Math.min((qualidade.concentracao / 30) * 100, 100);

  const scoreFinal = Math.round(
    motilidadeScore * 0.35 + vigorScore * 0.25 + morfologiaScore * 0.25 + concentracaoScore * 0.15,
  );

  const concepcao = tipoSemen === 'Convencional' ? 0.45 : 0.65;
  const taxaFemeas = tipoSemen === 'Sexado Fêmea' ? 0.92 : tipoSemen === 'Sexado Macho' ? 0.08 : 0.5;
  const custoFemeaNascida = Number((precoDose / Math.max(concepcao * taxaFemeas, 0.01)).toFixed(2));

  return {
    alerta,
    scoreFinal,
    custoFemeaNascida,
  };
}
