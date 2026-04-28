'use client';

import useSWR from 'swr';
import { DailyData, Task } from '@/lib/types';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function useDaily(date: string) {
  const { data, error, mutate } = useSWR<DailyData>(
    `/api/daily/${date}`,
    fetcher
  );

  const toggleTask = async (taskId: string, completed: boolean) => {
    if (!data) return;
    const updateList = (list: Task[]) =>
      list.map(t => t.id === taskId ? { ...t, completed, status: completed ? 'completed' as const : 'not-started' as const } : t);

    mutate(
      { ...data, tasks: updateList(data.tasks), recurringTasks: updateList(data.recurringTasks) },
      false
    );

    await fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, completed }),
    });
    mutate();
  };

  const updateFocus3 = async (items: string[]) => {
    if (!data) return;
    mutate({ ...data, focus3: items }, false);
    await fetch('/api/focus', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, items }),
    });
    mutate();
  };

  const updateNotes = async (notes: string) => {
    if (!data) return;
    mutate({ ...data, notes }, false);
    await fetch(`/api/daily/${date}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes }),
    });
    mutate();
  };

  return {
    daily: data,
    error,
    isLoading: !data && !error,
    toggleTask,
    updateFocus3,
    updateNotes,
    mutate,
  };
}
