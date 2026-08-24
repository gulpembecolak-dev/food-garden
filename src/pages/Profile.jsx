import { useState } from 'react';
import { Award, Flame, Target, Droplet, Activity, HelpCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { AVATARS } from '../context/userData';
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

// Clamp numeric fields so targets never compute from nonsense values.
const NUM_LIMITS = {
  age: [12, 100],
  weight: [30, 250],
  height: [120, 230],
};

export default function Profile({ onShowIntro }) {
  const { user, updateProfile } = useUser();
  const t = user.targets;
  // Personal data lives on its own sub-page, reached by tapping the profile
  // block — it is never openly displayed on the main profile screen.
  const [editing, setEditing] = useState(false);

  const setNum = (key) => (e) => {
    const [min, max] = NUM_LIMITS[key];
    const v = Number(e.target.value);
    if (Number.isNaN(v)) return;
    updateProfile({ [key]: Math.min(max, Math.max(min, v)) });
  };

  /* ---------- Sub-page: personal data form ---------- */
  if (editing) {
    return (
      <div className="profile-container animate-fade-in">
        <header className="profile-page-head">
          <Button variant="ghost" size="sm" onClick={() => setEditing(false)} iconLeft={<ChevronLeft size={16} />}>
            Profile
          </Button>
        </header>

        <div className="data-page-head">
          <h1>Personal data</h1>
        </div>

        <div className="profile-card data-card">
          <div className="field-row">
            <label id="avatar-label">Profile picture</label>
            <div className="avatar-pick-row" role="radiogroup" aria-labelledby="avatar-label">
              {AVATARS.map(v => (
                <button
                  key={v}
                  type="button"
                  role="radio"
                  aria-checked={user.avatar === v}
                  aria-label={v}
                  className={`avatar-pick ${user.avatar === v ? 'active' : ''}`}
                  onClick={() => updateProfile({ avatar: v })}
                >
                  <img src={`/veggies/${v}.png`} alt="" />
                </button>
              ))}
            </div>
          </div>

          <div className="field-row field-row--input">
            <label htmlFor="name-input">Name</label>
            <input
              id="name-input"
              type="text"
              value={user.name}
              onChange={e => updateProfile({ name: e.target.value })}
            />
          </div>

          <div className="field-row field-row--input">
            <label htmlFor="age-input">Age</label>
            <input
              id="age-input"
              type="number" inputMode="numeric"
              min={NUM_LIMITS.age[0]} max={NUM_LIMITS.age[1]}
              value={user.age}
              onChange={setNum('age')}
            />
          </div>

          <div className="field-row field-row--input">
            <label htmlFor="weight-input">Weight (kg)</label>
            <input
              id="weight-input"
              type="number" inputMode="numeric"
              min={NUM_LIMITS.weight[0]} max={NUM_LIMITS.weight[1]}
              value={user.weight}
              onChange={setNum('weight')}
            />
          </div>

          <div className="field-row field-row--input">
            <label htmlFor="height-input">Height (cm)</label>
            <input
              id="height-input"
              type="number" inputMode="numeric"
              min={NUM_LIMITS.height[0]} max={NUM_LIMITS.height[1]}
              value={user.height}
              onChange={setNum('height')}
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

        <div className="data-page-foot">
          <Button variant="primary" size="lg" onClick={() => setEditing(false)}>Done</Button>
        </div>
      </div>
    );
  }

  /* ---------- Main profile screen ---------- */
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

      <button className="profile-hero profile-hero--link" onClick={() => setEditing(true)} aria-label="Open personal data">
        {user.avatar ? (
          <div className="avatar-large avatar-large--veggie">
            <img src={`/veggies/${user.avatar}.png`} alt="" />
          </div>
        ) : (
          <div className="avatar-large" style={{ background: user.accent, boxShadow: `0 8px 24px ${user.accent}55` }}>
            {user.initials}
          </div>
        )}
        <div className="hero-text">
          <h2 className="profile-name">{user.name}</h2>
          {user.email && <p className="profile-bio">{user.email}</p>}
          <div className="badge-row">
            <span className="level-badge" style={{ background: `${user.accent}22`, color: user.accent }}>
              {user.goal === 'muscle' ? 'building muscle' : user.goal === 'lose' ? 'losing weight' : user.goal === 'gain' ? 'gaining weight' : 'maintaining'}
            </span>
            <span className="level-badge" style={{ background: 'rgba(37,49,33,0.08)', color: 'var(--text-secondary)' }}>
              {user.activity}
            </span>
          </div>
        </div>
        <span className="hero-chevron" aria-hidden="true">
          <span className="hero-chevron-label">Personal data</span>
          <ChevronRight size={18} />
        </span>
      </button>

      <section className="profile-grid">
        <div className="profile-card targets-card">
          <h3 className="card-h">Daily targets</h3>
          <p className="card-sub">Calculated live from your personal data.</p>

          <div className="target-grid">
            <div className="target-tile">
              <Flame size={20} color="var(--color-energy)" />
              <span className="target-val">{t.calories}</span>
              <span className="target-label">kcal</span>
            </div>
            <div className="target-tile">
              <Activity size={20} color="var(--color-protein)" />
              <span className="target-val">{t.protein}g</span>
              <span className="target-label">protein</span>
            </div>
            <div className="target-tile">
              <Target size={20} color="var(--color-carbs)" />
              <span className="target-val">{t.carbs}g</span>
              <span className="target-label">carbs</span>
            </div>
            <div className="target-tile">
              <Award size={20} color="var(--color-fats)" />
              <span className="target-val">{t.fats}g</span>
              <span className="target-label">fats</span>
            </div>
            <div className="target-tile wide">
              <Droplet size={20} color="var(--color-water)" />
              <span className="target-val">{t.hydrationL} L</span>
              <span className="target-label">hydration goal</span>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}
