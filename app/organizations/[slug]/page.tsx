'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useOrganizations } from '@/hooks/useOrganizations';
import { useDate } from '@/hooks/useDate';
import { useDaily } from '@/hooks/useDaily';
import { Organization } from '@/lib/types';
import TaskList from '@/components/tasks/TaskList';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ProgressBar from '@/components/ui/ProgressBar';
import { DEFAULT_ORG_COLORS } from '@/lib/constants';
import { ArrowLeft, Loader2, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function OrgDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { organizations, updateOrg, deleteOrg, isLoading: orgsLoading } = useOrganizations();
  const { date } = useDate();
  const { daily, toggleTask } = useDaily(date);

  const org = organizations.find(o => o.slug === slug);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (org) {
      setName(org.name);
      setColor(org.color);
      setNotes(org.notes);
    }
  }, [org]);

  if (orgsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-text-secondary" size={24} />
      </div>
    );
  }

  if (!org) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <p className="text-text-secondary">Organization not found.</p>
        <Link href="/organizations" className="text-accent text-[13px] hover:underline mt-2 inline-block">
          Back to organizations
        </Link>
      </div>
    );
  }

  const orgTasks = daily ? [...daily.tasks, ...daily.recurringTasks].filter(t => t.org === org.name) : [];
  const completed = orgTasks.filter(t => t.completed).length;

  const handleSave = async () => {
    await updateOrg(slug, { name, color, notes });
    setEditing(false);
  };

  const handleDelete = async () => {
    if (confirm('Delete this organization?')) {
      await deleteOrg(slug);
      router.push('/organizations');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Link
        href="/organizations"
        className="flex items-center gap-1.5 text-[13px] text-text-secondary hover:text-text-primary transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        Back to organizations
      </Link>

      <div className="bg-background border border-border-subtle rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full" style={{ backgroundColor: editing ? color : org.color }} />
            {editing ? (
              <Input value={name} onChange={e => setName(e.target.value)} />
            ) : (
              <h1 className="text-xl font-semibold text-text-primary">{org.name}</h1>
            )}
          </div>
          <div className="flex gap-2">
            {editing ? (
              <>
                <Button variant="secondary" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
                <Button size="sm" onClick={handleSave}>Save</Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>Edit</Button>
                <Button variant="ghost" size="sm" onClick={handleDelete}>
                  <Trash2 size={14} />
                </Button>
              </>
            )}
          </div>
        </div>

        {editing && (
          <div className="mb-4">
            <label className="block text-[13px] font-medium text-text-primary mb-2">Color</label>
            <div className="flex gap-2 flex-wrap">
              {DEFAULT_ORG_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full transition-all ${color === c ? 'ring-2 ring-offset-2 ring-accent' : 'hover:scale-110'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mb-4">
          <span className="text-[11px] text-text-secondary block mb-1">Progress (today)</span>
          <ProgressBar value={completed} max={orgTasks.length || 1} showLabel />
          <span className="text-[12px] text-text-secondary mt-1">
            {completed}/{orgTasks.length} tasks completed
          </span>
        </div>

        {editing ? (
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Notes..."
            rows={4}
            className="w-full px-3 py-2 text-[13px] bg-surface border border-border-subtle rounded-lg text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent resize-none"
          />
        ) : org.notes ? (
          <div>
            <span className="text-[11px] text-text-secondary block mb-1">Notes</span>
            <p className="text-[13px] text-text-primary whitespace-pre-wrap">{org.notes}</p>
          </div>
        ) : null}
      </div>

      {orgTasks.length > 0 && (
        <div className="bg-background border border-border-subtle rounded-xl p-5">
          <h3 className="text-[14px] font-semibold text-text-primary mb-3">
            Tasks ({orgTasks.length})
          </h3>
          <TaskList tasks={orgTasks} onToggle={toggleTask} />
        </div>
      )}
    </div>
  );
}
