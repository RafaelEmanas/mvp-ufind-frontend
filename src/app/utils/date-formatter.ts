/**
 * Formats a date string from YYYY-MM-DD format to pt-BR locale (DD/MM/YYYY).
 * 
 * @param dateString - A date string in YYYY-MM-DD format
 * @returns The formatted date string in DD/MM/YYYY format, or 'Data inválida' for invalid dates
 */
export function formatDate(dateString: string): string {
  if (!dateString || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return 'Data inválida';
  }

  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  if (isNaN(date.getTime())) {
    return 'Data inválida';
  }

  return date.toLocaleDateString('pt-BR');
}
