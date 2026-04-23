import './PortionSelector.css';

export default function PortionSelector({ selected, onChange }) {
  const options = [
    { id: 'S', label: 'Small', desc: 'A snack or tiny bite' },
    { id: 'M', label: 'Medium', desc: 'A regular portion' },
    { id: 'L', label: 'Large', desc: 'A full, hearty meal' },
    { id: 'XL', label: 'Extra Large', desc: 'A feast' }
  ];

  return (
    <div className="portion-selector">
      {options.map((opt) => (
        <button
          key={opt.id}
          className={`portion-card ${selected === opt.id ? 'selected' : ''}`}
          onClick={() => onChange(opt.id)}
        >
          <div className="portion-circle">{opt.id}</div>
          <div className="portion-info">
            <span className="portion-label">{opt.label}</span>
            <span className="portion-desc">{opt.desc}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
