import type { Bioma, PesosSelecao, RacaTouro, TipoSemen } from '@/types';

export const RACAS: RacaTouro[] = ['Holandês', 'Gir Leiteiro', 'Girolando', 'Jersey', 'Pardo Suíço'];

export const TIPOS_SEMEN: TipoSemen[] = ['Sexado Fêmea', 'Sexado Macho', 'Convencional'];

export const BIOMAS: Bioma[] = ['Cerrado', 'Semiárido', 'Sul/Frio', 'Amazônia', 'Pantanal', 'Tropical Úmido'];

export const PESOS_PADRAO: PesosSelecao = {
  leite: 45,
  gordura: 10,
  proteina: 10,
  vidaProdutiva: 15,
  celulaSomatica: 8,
  facilidadeParto: 5,
  fenotipo: 7,
};
