// Funções utilitárias para datas no timezone de Brasília

/**
 * Converte uma string ou objeto Date UTC para string formatada no timezone de Brasília.
 * @param date Data em UTC (string ISO ou Date)
 * @param options Opções de formatação (Intl.DateTimeFormatOptions)
 * @returns String formatada no fuso de Brasília
 */
export function formatDateBrasilia(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    ...options,
  })
}

/**
 * Retorna a data/hora atual em UTC (ISO string)
 */
export function nowUTC(): string {
  return new Date().toISOString()
} 