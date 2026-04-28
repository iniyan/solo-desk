import { kv } from '../kv';
import { DailyData } from '../types';

const DAILY_PREFIX = 'daily:';

export async function parseDailyFile(dateStr: string): Promise<DailyData | null> {
  const data = await kv.get<DailyData>(`${DAILY_PREFIX}${dateStr}`);
  return data || null;
}
