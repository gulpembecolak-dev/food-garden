import './ui.css';

export default function Chip({ active = false, onClick, children, accent = 'var(--primary-color)' }) {
  return (
    <button
      type="button"
      className={`ui-chip ${active ? 'ui-chip--active' : ''}`}
      onClick={onClick}
      style={active ? { borderColor: accent, color: accent, background: `${accent}1a` } : undefined}
    >
      {children}
    </button>
  );
}
