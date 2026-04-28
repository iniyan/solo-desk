'use client';

import useSWR from 'swr';
import { InboxItem } from '@/lib/types';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function useInbox(date: string) {
  const { data, error, mutate } = useSWR<InboxItem[]>(
    `/api/inbox?date=${date}`,
    fetcher
  );

  const addItem = async (text: string) => {
    await fetch('/api/inbox', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, date }),
    });
    mutate();
  };

  const removeItem = async (id: string) => {
    await fetch(`/api/inbox?id=${id}&date=${date}`, { method: 'DELETE' });
    mutate();
  };

  return {
    items: data || [],
    error,
    isLoading: !data && !error,
    addItem,
    removeItem,
    mutate,
  };
}
