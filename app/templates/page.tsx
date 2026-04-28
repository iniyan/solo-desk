'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { TaskTemplate, Priority, RevenueTag } from '@/lib/types';
import { useDate } from '@/hooks/useDate';
import { useDaily } from '@/hooks/useDaily';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Dialog from '@/components/ui/Dialog';
import EmptyState from '@/components/ui/EmptyState';
import { FileText, Plus, Trash2, Play, Loader2, X } from 'lucide-react';
import { v4 as uuid } from 'uuid';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function TemplatesPage() {
  const { data: templates, mutate } = useSWR<TaskTemplate[]>('/api/templates', fetcher);
  const { date } = useDate();
  const { mutate: mutateDaily } = useDaily(date);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [tasks, setTasks] = useState<Array<{ title: string; description: string; org: string; priority: Priority; revenueTag: RevenueTag }>>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || tasks.length === 0) return;
    await fetch('/api/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), tasks }),
    });
    setName('');
    setTasks([]);
    setShowForm(false);
    mutate();
  };

  const addTaskToTemplate = () => {
    if (!newTaskTitle.trim()) return;
    setTasks([...tasks, { title: newTaskTitle.trim(), description: '', org: '', priority: 'medium', revenueTag: 'billable' }]);
    setNewTaskTitle('');
  };

  const removeTaskFromTemplate = (idx: number) => {
    setTasks(tasks.filter((_, i) => i !== idx));
  };

  const handleApply = async (template: TaskTemplate) => {
    for (const task of template.tasks) {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...task, date }),
      });
    }
    mutateDaily();
    alert(`Applied "${template.name}" — ${template.tasks.length} tasks created.`);
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Delete this template?')) return;
    await fetch(`/api/templates/${slug}`, { method: 'DELETE' });
    mutate();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-semibold text-text-primary">Task Templates</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus size={14} />
          New Template
        </Button>
      </div>

      {!templates ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-text-secondary" size={24} />
        </div>
      ) : templates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {templates.map(tpl => (
            <div key={tpl.slug} className="bg-background border border-border-subtle rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-[14px] font-semibold text-text-primary">{tpl.name}</h3>
                  <span className="text-[12px] text-text-secondary">{tpl.tasks.length} tasks</span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleApply(tpl)}
                    className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-accent bg-accent-light rounded hover:opacity-80 transition-opacity"
                  >
                    <Play size={10} /> Apply
                  </button>
                  <button
                    onClick={() => handleDelete(tpl.slug)}
                    className="p-1 text-text-secondary hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                {tpl.tasks.map((task, i) => (
                  <div key={i} className="text-[12px] text-text-secondary flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-text-secondary" />
                    {task.title}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="No templates"
          description="Create reusable task templates for common workflows like SEO audits, project launches, etc."
          action={
            <Button onClick={() => setShowForm(true)} size="sm">
              <Plus size={12} /> Create Template
            </Button>
          }
        />
      )}

      <Dialog open={showForm} onClose={() => setShowForm(false)} title="New Template">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            id="tpl-name"
            label="Template Name"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g., SEO Monthly Report"
            required
            autoFocus
          />

          <div>
            <label className="block text-[13px] font-medium text-text-primary mb-2">Tasks</label>
            {tasks.length > 0 && (
              <div className="space-y-1.5 mb-3">
                {tasks.map((task, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-surface rounded-lg">
                    <span className="text-[13px] text-text-primary flex-1">{task.title}</span>
                    <button type="button" onClick={() => removeTaskFromTemplate(idx)} className="text-text-secondary hover:text-red-500">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={newTaskTitle}
                onChange={e => setNewTaskTitle(e.target.value)}
                placeholder="Add a task..."
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTaskToTemplate(); } }}
                className="flex-1 px-3 py-2 text-[13px] bg-background border border-border-subtle rounded-lg text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <Button type="button" variant="secondary" size="sm" onClick={addTaskToTemplate}>Add</Button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit" disabled={tasks.length === 0}>Create Template</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
