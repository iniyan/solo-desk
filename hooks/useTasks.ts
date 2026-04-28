'use client';

import useSWR from 'swr';
import { Task } from '@/lib/types';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function useTasks(date: string, filters?: Record<string, string>) {
  const params = new URLSearchParams({ date, ...filters });
  const { data, error, mutate } = useSWR<Task[]>(
    `/api/tasks?${params.toString()}`,
    fetcher
  );

  const createTask = async (task: Partial<Task>) => {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...task, date }),
    });
    const created = await res.json();
    mutate();
    return created;
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...updates, date }),
    });
    mutate();
  };

  const deleteTask = async (id: string) => {
    await fetch(`/api/tasks/${id}?date=${date}`, { method: 'DELETE' });
    mutate();
  };

  const addComment = async (taskId: string, text: string) => {
    await fetch(`/api/tasks/${taskId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, date }),
    });
    mutate();
  };

  return {
    tasks: data || [],
    error,
    isLoading: !data && !error,
    createTask,
    updateTask,
    deleteTask,
    addComment,
    mutate,
  };
}
