import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isToday } from 'date-fns';

export function todayStr(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function formatDate(dateStr: string): string {
  return format(new Date(dateStr + 'T00:00:00'), 'EEEE, MMMM d, yyyy');
}

export function formatDateShort(dateStr: string): string {
  return format(new Date(dateStr + 'T00:00:00'), 'MMM d');
}

export function formatDayName(dateStr: string): string {
  return format(new Date(dateStr + 'T00:00:00'), 'EEE');
}

export function getNextDay(dateStr: string): string {
  return format(addDays(new Date(dateStr + 'T00:00:00'), 1), 'yyyy-MM-dd');
}

export function getPrevDay(dateStr: string): string {
  return format(subDays(new Date(dateStr + 'T00:00:00'), 1), 'yyyy-MM-dd');
}

export function getWeekDays(dateStr: string): string[] {
  const date = new Date(dateStr + 'T00:00:00');
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end }).map(d => format(d, 'yyyy-MM-dd'));
}

export function isDayToday(dateStr: string): boolean {
  return isToday(new Date(dateStr + 'T00:00:00'));
}

export function getYearMonth(dateStr: string): { year: string; month: string } {
  const [year, month] = dateStr.split('-');
  return { year, month };
}
