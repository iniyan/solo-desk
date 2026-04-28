'use client';

import { useState } from 'react';
import { useOrganizations } from '@/hooks/useOrganizations';
import Dialog from '@/components/ui/Dialog';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import EmptyState from '@/components/ui/EmptyState';
import { DEFAULT_ORG_COLORS } from '@/lib/constants';
import { Building2, Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function OrganizationsPage() {
  const { organizations, isLoading, createOrg } = useOrganizations();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState(DEFAULT_ORG_COLORS[0]);
  const [notes, setNotes] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await createOrg({ name: name.trim(), color, notes });
    setName('');
    setColor(DEFAULT_ORG_COLORS[0]);
    setNotes('');
    setShowForm(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-text-secondary" size={24} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-semibold text-text-primary">Organizations</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus size={14} />
          New Organization
        </Button>
      </div>

      {organizations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {organizations.map(org => (
            <Link
              key={org.slug}
              href={`/organizations/${org.slug}`}
              className="bg-background border border-border-subtle rounded-xl p-5 hover:border-accent/30 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: org.color }}
                />
                <h3 className="text-[14px] font-semibold text-text-primary group-hover:text-accent transition-colors">
                  {org.name}
                </h3>
              </div>
              {org.notes && (
                <p className="text-[12px] text-text-secondary line-clamp-2">
                  {org.notes}
                </p>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Building2}
          title="No organizations yet"
          description="Create organizations to categorize your tasks by client or project."
          action={
            <Button onClick={() => setShowForm(true)} size="sm">
              <Plus size={12} /> Add Organization
            </Button>
          }
        />
      )}

      <Dialog open={showForm} onClose={() => setShowForm(false)} title="New Organization">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            id="name"
            label="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g., ABC Pvt Ltd"
            required
            autoFocus
          />

          <div>
            <label className="block text-[13px] font-medium text-text-primary mb-2">Color</label>
            <div className="flex gap-2 flex-wrap">
              {DEFAULT_ORG_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition-all ${color === c ? 'ring-2 ring-offset-2 ring-accent' : 'hover:scale-110'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-text-primary mb-1.5">Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Optional notes about this client/project..."
              rows={3}
              className="w-full px-3 py-2 text-[13px] bg-background border border-border-subtle rounded-lg text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
