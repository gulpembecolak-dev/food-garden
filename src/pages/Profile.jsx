import { Award, Flame, Target, Droplet, Activity, HelpCircle } from 'lucide-react';
import { useUser } from '../context/UserContext';
import Button from '../components/ui/Button';
import './Profile.css';

const ACTIVITY_OPTIONS = [
  { value: 'sedentary', label: 'Sedentary' },
  { value: 'light', label: 'Light (1–2×/wk)' },
  { value: 'moderate', label: 'Moderate (3–4×/wk)' },
  { value: 'active', label: 'Active (5×/wk)' },
  { value: 'athlete', label: 'Athlete' },
];

const GOAL_OPTIONS = [
  { value: 'lose', label: 'Lose weight' },
  { value: 'maintain', label: 'Maintain' },
  { value: 'gain', label: 'Gain weight' },
  { value: 'muscle', label: 'Build muscle' },
];

export default function Profile({ onShowIntro }) {
  const { user, activeId, setActiveId, updateProfile, profileIds } = useUser();
  const t = user.targets;

  return (
    <div className="profile-container animate-fade-in">
      <header className="profile-page-head">
        <h1>Profile</h1>
        {onShowIntro && (
          <Button variant="ghost" size="sm" onClick={onShowIntro} iconLeft={<HelpCircle size={14} />}>
            Show intro
          </Button>
        )}
      </header>

      <div className="profile-switcher" role="tablist" aria-label="Active profile">
        {profileIds.map(id => (
          <button
            key={id}
            role="tab"
            aria-selected={activeId === id}
            className={`profile-switch-tab ${activeId === id ? 'active' : ''}`}
            onClick={() => setActiveId(id)}
          >
            {id.charAt(0).toUpperCase() + id.slice(1)}
          </button>
        ))}
      </div>

      <section className="profile-hero">
        <div className="avatar-large" style={{ background: user.accent, boxShadow: `0 8px 24px ${user.accent}55` }}>
          {user.initials}
        </div>
        <div className="hero-text">
          <h2 className="profile-name">{user.name}</h2>
          <p className="profile-bio">{user.bio}</p>
          <div className="badge-row">
            <span className="level-badge" style={{ background: `${user.accent}22`, color: user.accent }}>
              {user.age} y · {user.gender}
            </span>
            <span className="level-badge" style={{ background: 'rgba(148,163,184,0.15)', color: 'var(--text-secondary)' }}>
              {user.activity}
            </span>
          </div>
        </div>
      </section>

      <section className="profile-grid">
        <div className="profile-card">
          <h3 className="card-h">Personal data</h3>
          <p className="card-sub">These values drive your daily targets.</p>

          <div className="field-row">
            <label htmlFor="age-slider">Age <span className="field-val">{user.age}</span></label>
            <input
              id="age-slider"
              type="range" min="18" max="80"
              value={user.age}
              onChange={e => updateProfile({ age: Number(e.target.value) })}
            />
          </div>

          <div className="field-row">
            <label htmlFor="weight-slider">Weight (kg) <span className="field-val">{user.weight}</span></label>
            <input
              id="weight-slider"
              type="range" min="40" max="140"
              value={user.weight}
              onChange={e => updateProfile({ weight: Number(e.target.value) })}
            />
          </div>

          <div className="field-row">
            <label htmlFor="height-slider">Height (cm) <span className="field-val">{user.height}</span></label>
            <input
              id="height-slider"
              type="range" min="140" max="210"
              value={user.height}
              onChange={e => updateProfile({ height: Number(e.target.value) })}
            />
          </div>

          <div className="field-row">
            <label htmlFor="gender-select">Gender</label>
            <select
              id="gender-select"
              value={user.gender}
              onChange={e => updateProfile({ gender: e.target.value })}
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </div>

          <div className="field-row">
            <label htmlFor="activity-select">Activity level</label>
            <select
              id="activity-select"
              value={user.activity}
              onChange={e => updateProfile({ activity: e.target.value })}
            >
              {ACTIVITY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          <div className="field-row">
            <label htmlFor="goal-select">Health goal</label>
            <select
              id="goal-select"
              value={user.goal}
              onChange={e => updateProfile({ goal: e.target.value })}
            >
              {GOAL_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        <div className="profile-card targets-card">
          <h3 className="card-h">Daily targets</h3>
          <p className="card-sub">Calculated from your personal data.</p>

          <div className="target-grid">
            <div className="target-tile">
              <Flame size={20} color="#FBBF24" />
              <span className="target-val">{t.calories}</span>
              <span className="target-label">kcal</span>
            </div>
            <div className="target-tile">
              <Activity size={20} color="#3B82F6" />
              <span className="target-val">{t.protein}g</span>
              <span className="target-label">protein</span>
            </div>
            <div className="target-tile">
              <Target size={20} color="#FBBF24" />
              <span className="target-val">{t.carbs}g</span>
              <span className="target-label">carbs</span>
            </div>
            <div className="target-tile">
              <Award size={20} color="#14B8A6" />
              <span className="target-val">{t.fats}g</span>
              <span className="target-label">fats</span>
            </div>
            <div className="target-tile wide">
              <Droplet size={20} color="#60A5FA" />
              <span className="target-val">{t.hydrationL} L</span>
              <span className="target-label">hydration goal</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
