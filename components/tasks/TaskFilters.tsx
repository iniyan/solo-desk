'use client';

import { Priority, RevenueTag, TaskStatus } from '@/lib/types';
import { PRIORITIES, REVENUE_TAGS, STATUSES } from '@/lib/constants';
import { PRIORITY_CONFIG, REVENUE_CONFIG, STATUS_CONFIG } from '@/lib/constants';
import { useOrganizations } from '@/hooks/useOrganizations';

interface Filters {
  org: string;
  priority: string;
  status: string;
  revenue: string;
}

interface TaskFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export default function TaskFilters({ filters, onChange }: TaskFiltersProps) {
  const { organizations } = useOrganizations();

  const update = (key: keyof Filters, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const selectClass = "px-2.5 py-1.5 text-[12px] bg-background border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent appearance-none cursor-pointer";

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <select
        value={filters.org}
        onChange={e => update('org', e.target.value)}
        className={selectClass}
      >
        <option value="">All Orgs</option>
        {organizations.map(o => (
          <option key={o.slug} value={o.name}>{o.name}</option>
        ))}
      </select>

      <select
        value={filters.priority}
        onChange={e => update('priority', e.target.value)}
        className={selectClass}
      >
        <option value="">All Priorities</option>
        {PRIORITIES.map(p => (
          <option key={p} value={p}>{PRIORITY_CONFIG[p].label}</option>
        ))}
      </select>

      <select
        value={filters.status}
        onChange={e => update('status', e.target.value)}
        className={selectClass}
      >
        <option value="">All Statuses</option>
        {STATUSES.map(s => (
          <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
        ))}
      </select>

      <select
        value={filters.revenue}
        onChange={e => update('revenue', e.target.value)}
        className={selectClass}
      >
        <option value="">All Tags</option>
        {REVENUE_TAGS.map(r => (
          <option key={r} value={r}>{REVENUE_CONFIG[r].label}</option>
        ))}
      </select>

      {(filters.org || filters.priority || filters.status || filters.revenue) && (
        <button
          onClick={() => onChange({ org: '', priority: '', status: '', revenue: '' })}
          className="px-2 py-1 text-[11px] text-text-secondary hover:text-text-primary transition-colors"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
