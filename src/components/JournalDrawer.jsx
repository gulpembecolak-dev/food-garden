import { useEffect } from 'react';
import Journal from './Journal';
import './JournalDrawer.css';

export default function JournalDrawer({ open, onClose, user, entries, onAdd, onRemove }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <>
      <div
        className={`journal-backdrop ${open ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`journal-drawer ${open ? 'open' : ''}`}
        role="dialog"
        aria-label="Journal"
        aria-hidden={!open}
      >
        {open && (
          <Journal
            user={user}
            entries={entries}
            onAdd={onAdd}
            onRemove={onRemove}
            onClose={onClose}
          />
        )}
      </aside>
    </>
  );
}
