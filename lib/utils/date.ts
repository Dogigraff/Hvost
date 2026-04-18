import { differenceInMonths, differenceInYears } from 'date-fns';
import { ru as locale } from 'date-fns/locale';
import { format } from 'date-fns';

export function formatAge(birthDate: string): string {
  const birth = new Date(birthDate);
  const now = new Date();
  const years = differenceInYears(now, birth);
  const months = differenceInMonths(now, birth) % 12;

  const pluralYears = (n: number) => {
    if (n % 10 === 1 && n % 100 !== 11) return 'год';
    if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'года';
    return 'лет';
  };

  const pluralMonths = (n: number) => {
    if (n % 10 === 1 && n % 100 !== 11) return 'месяц';
    if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'месяца';
    return 'месяцев';
  };

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} ${pluralYears(years)}`);
  if (months > 0) parts.push(`${months} ${pluralMonths(months)}`);
  return parts.join(' ') || 'Меньше месяца';
}

export function formatEventDate(dateStr: string): string {
  return format(new Date(dateStr), 'd MMMM, HH:mm', { locale });
}

export function formatDate(dateStr: string): string {
  return format(new Date(dateStr), 'd MMMM yyyy', { locale });
}

export function isOverdue(startsAt: string): boolean {
  return new Date(startsAt) < new Date(Date.now() - 24 * 60 * 60 * 1000);
}
