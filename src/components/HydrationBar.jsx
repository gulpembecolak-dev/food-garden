import './HydrationBar.css';
import { Droplet } from 'lucide-react';

export default function HydrationBar({ percentage = 65 }) {
  return (
    <div className="hydration-container glass-panel">
      <div className="hydration-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Droplet size={18} color="var(--primary-color)" />
          <span className="hydration-title">Hydration Level</span>
        </div>
        <span className="hydration-value">{percentage}%</span>
      </div>
      <div className="hydration-track">
        <div 
          className="hydration-fill" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
