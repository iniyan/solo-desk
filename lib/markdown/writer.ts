import { kv } from '../kv';
import { DailyData } from '../types';

const DAILY_PREFIX = 'daily:';

export async function writeDailyFile(data: DailyData): Promise<void> {
  await kv.set(`${DAILY_PREFIX}${data.date}`, data);
}
