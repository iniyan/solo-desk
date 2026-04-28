'use client';

import useSWR from 'swr';
import { Organization } from '@/lib/types';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function useOrganizations() {
  const { data, error, mutate } = useSWR<Organization[]>(
    '/api/organizations',
    fetcher
  );

  const createOrg = async (org: { name: string; color: string; notes?: string }) => {
    await fetch('/api/organizations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(org),
    });
    mutate();
  };

  const updateOrg = async (slug: string, updates: Partial<Organization>) => {
    await fetch(`/api/organizations/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    mutate();
  };

  const deleteOrg = async (slug: string) => {
    await fetch(`/api/organizations/${slug}`, { method: 'DELETE' });
    mutate();
  };

  return {
    organizations: data || [],
    error,
    isLoading: !data && !error,
    createOrg,
    updateOrg,
    deleteOrg,
    mutate,
  };
}
