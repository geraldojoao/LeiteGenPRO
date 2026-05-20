export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 2,
  }).format(value);

export const formatNumber = (value: number, fractionDigits = 0): string =>
  new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);

export const formatKg = (value: number): string => `${value >= 0 ? '+' : ''}${formatNumber(value)} kg`;

export const formatPercent = (value: number, fractionDigits = 0): string => `${formatNumber(value, fractionDigits)}%`;

export const formatDate = (isoDate: string): string =>
  new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(isoDate));

export const pluralize = (count: number, singular: string, plural: string): string =>
  count === 1 ? `${count} ${singular}` : `${count} ${plural}`;
