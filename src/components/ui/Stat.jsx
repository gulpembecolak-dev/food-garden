import './ui.css';

export default function Stat({ icon, label, value, target, accent = 'var(--primary-color)' }) {
  const pct = target ? Math.min(100, Math.round((parseFloat(value) / parseFloat(target)) * 100)) : null;
  return (
    <div className="ui-stat">
      <div className="ui-stat__head">
        <span className="ui-stat__icon" style={{ color: accent }}>{icon}</span>
        <span className="ui-stat__label">{label}</span>
      </div>
      <div className="ui-stat__row">
        <strong className="ui-stat__val">{value}</strong>
        {target && <span className="ui-stat__target">/ {target}</span>}
      </div>
      {pct !== null && (
        <div className="ui-stat__progress">
          <div className="ui-stat__progress-fill" style={{ width: `${pct}%`, background: accent }} />
        </div>
      )}
    </div>
  );
}
