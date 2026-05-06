import { useState, useEffect, useRef } from 'react';
import { Send, X } from 'lucide-react';
import Button from './ui/Button';
import './Journal.css';

function formatRelative(iso) {
  const now = new Date();
  const then = new Date(iso);
  const diffMs = now - then;
  const diffMin = Math.round(diffMs / 60000);
  const diffH = Math.round(diffMs / 3600000);
  const sameDay = now.toDateString() === then.toDateString();

  const yest = new Date(now);
  yest.setDate(yest.getDate() - 1);
  const isYesterday = yest.toDateString() === then.toDateString();

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  if (sameDay) return `Today at ${then.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  if (isYesterday) return `Yesterday at ${then.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  if (diffH < 24 * 7) return `${Math.round(diffH / 24)} days ago`;
  return then.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function Journal({ user, entries, onAdd, onRemove, onClose }) {
  const [draft, setDraft] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (onClose) inputRef.current?.focus();
  }, [onClose]);

  const save = () => {
    const text = draft.trim();
    if (!text) return;
    onAdd({
      content: text,
      author: user.name,
      authorId: user.id,
      authorAccent: user.accent,
    });
    setDraft('');
  };

  const onKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      save();
    }
  };

  return (
    <section className="journal" aria-label="Garden journal">
      <header className="journal__head">
        <div className="journal__title-group">
          <span className="journal__author-dot" style={{ background: user.accent }} />
          <div>
            <h3 className="journal__title">{user.name}'s journal</h3>
            <p className="journal__sub">
              {entries.length === 0
                ? 'Start your first reflection'
                : `${entries.length} ${entries.length === 1 ? 'entry' : 'entries'}`}
            </p>
          </div>
        </div>
        {onClose && (
          <button className="journal__close" onClick={onClose} aria-label="Close journal">
            <X size={18} />
          </button>
        )}
      </header>

      <div className="journal__composer" style={{ '--accent': user.accent }}>
        <textarea
          ref={inputRef}
          className="journal__input"
          placeholder={`What did ${user.name} learn this week?`}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          rows={3}
        />
        <div className="journal__composer-foot">
          <span className="journal__hint">⌘+Enter to save</span>
          <Button
            variant="primary"
            size="sm"
            onClick={save}
            disabled={!draft.trim()}
            iconRight={<Send size={14} />}
          >
            Save
          </Button>
        </div>
      </div>

      {entries.length > 0 ? (
        <ul className="journal__list">
          {entries.map(entry => (
            <li
              key={entry.id}
              className="journal__entry"
              style={{ '--entry-accent': entry.authorAccent }}
            >
              <div className="journal__entry-meta">
                <span className="journal__author">
                  <span className="journal__author-dot sm" style={{ background: entry.authorAccent }} />
                  {entry.author}
                </span>
                <span className="journal__time">{formatRelative(entry.timestamp)}</span>
              </div>
              <p className="journal__content">{entry.content}</p>
              <button
                className="journal__delete"
                onClick={() => onRemove(entry.id)}
                aria-label="Delete entry"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="journal__empty">
          <p>Nothing here yet. Capture a small observation about your day — patterns surface over time.</p>
        </div>
      )}
    </section>
  );
}
