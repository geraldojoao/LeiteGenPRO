export type RacaTouro = 'Holandês' | 'Gir Leiteiro' | 'Girolando' | 'Jersey' | 'Pardo Suíço';

export type TipoSemen = 'Sexado Fêmea' | 'Sexado Macho' | 'Convencional';

export type Bioma = 'Cerrado' | 'Semiárido' | 'Sul/Frio' | 'Amazônia' | 'Pantanal' | 'Tropical Úmido';

export type NivelRisco = 'Jovem / Alto Risco' | 'Intermediário' | 'Provado / Baixo Risco';

export type AlertaIATF = 'OK' | 'Atenção ao Protocolo de IATF';

export type StatusMatriz = 'Ativa' | 'Seca' | 'Descarte';

export interface DEPs {
  leite: number;
  gordura: number;
  proteina: number;
  vidaProdutiva: number;
  celulaSomatica: number;
  facilidadeParto: number;
  temperamento: number;
}

export interface Fenótipo {
  estatura: number;
  profundidadeCorporal: number;
  anguloGarupa: number;
  compostoUbere: number;
  inserçãoUberePosterior: number;
  ligamentoCentral: number;
  pernasEPes: number;
}

export type Fenotipo = Fenótipo;

export interface QualidadeSemen {
  motilidade: number;
  vigor: number;
  morfologia: number;
  concentracao: number;
  alerta: AlertaIATF;
}

export interface Central {
  nome: string;
  logo: string;
  website: string;
}

export interface Touro {
  id: string;
  nome: string;
  registro: string;
  raca: RacaTouro;
  nascimento: number;
  biomas: Bioma[];
  deps: DEPs;
  pta: number;
  acuracia: number;
  nivelRisco: NivelRisco;
  fenotipo: Fenótipo;
  tipoSemen: TipoSemen;
  qualidadeSemen: QualidadeSemen;
  central: Central;
  precoPorDose: number;
  foto: string;
  descricao: string;
  grauSanguePuroZebu: number;
}

export interface Matriz {
  id: string;
  nome: string;
  brinco: string;
  raca: string;
  nascimento: string;
  producaoMediaLitros: number;
  deps: Partial<DEPs>;
  fenotipo: Partial<Fenótipo>;
  genealogia: {
    pai: string;
    mae: string;
    avoPaterno: string;
    avoMaterno: string;
    genealogiaDesconhecida: boolean;
  };
  observacoes: string;
  fotoUrl?: string;
  status: StatusMatriz;
  numeroLactacoes: number;
  intervaloEntrePartosDias: number;
  criadaEm: string;
  atualizadaEm: string;
}

export interface FiltrosAtivos {
  raca?: RacaTouro[];
  tipoSemen?: TipoSemen[];
  bioma?: Bioma[];
  acuraciaMinima?: number;
  ptaLeiteMínimo?: number;
  precoMaximo?: number;
  compostoUbereMinimo?: number;
  estaturaMinima?: number;
  pernasEPesMinimo?: number;
  pesosPersonalizados?: PesosSelecao;
}

export interface PesosSelecao {
  leite: number;
  gordura: number;
  proteina: number;
  vidaProdutiva: number;
  celulaSomatica: number;
  facilidadeParto: number;
  fenotipo: number;
}

export interface ResultadoROI {
  ganhoEstimadoLitros: number;
  valorMonetarioPorProgenie: number;
  custoTotal: number;
  roiPercentual: number;
  lucroLiquidoEstimado: number;
  paybackEmLactacoes: number;
}

export interface RecomendacaoTouro {
  touro: Touro;
  score: number;
  justificativas: string[];
}
