'use client';

import useSWR from 'swr';
import { TimeBlock } from '@/lib/types';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function usePlanner(date: string) {
  const { data, error, mutate } = useSWR<TimeBlock[]>(
    `/api/planner?date=${date}`,
    fetcher
  );

  const addBlock = async (block: Omit<TimeBlock, 'id'>) => {
    await fetch('/api/planner', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, block }),
    });
    mutate();
  };

  const removeBlock = async (id: string) => {
    await fetch(`/api/planner?id=${id}&date=${date}`, { method: 'DELETE' });
    mutate();
  };

  return {
    blocks: data || [],
    error,
    isLoading: !data && !error,
    addBlock,
    removeBlock,
    mutate,
  };
}
