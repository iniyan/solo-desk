'use client';

import { useState } from 'react';
import { Comment } from '@/lib/types';
import { format } from 'date-fns';
import { Send } from 'lucide-react';

interface TaskCommentsProps {
  comments: Comment[];
  onAdd: (text: string) => void;
}

export default function TaskComments({ comments, onAdd }: TaskCommentsProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text.trim());
    setText('');
  };

  return (
    <div className="space-y-3">
      <h4 className="text-[13px] font-semibold text-text-primary">
        Comments ({comments.length})
      </h4>

      {comments.length > 0 && (
        <div className="space-y-2">
          {comments.map(comment => (
            <div key={comment.id} className="px-3 py-2 bg-surface rounded-lg">
              <p className="text-[13px] text-text-primary">{comment.text}</p>
              <p className="text-[11px] text-text-secondary mt-1">
                {format(new Date(comment.timestamp), 'MMM d, h:mm a')}
              </p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 px-3 py-2 text-[13px] bg-background border border-border-subtle rounded-lg text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <button
          type="submit"
          className="p-2 text-accent hover:bg-accent-light rounded-lg transition-colors"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
