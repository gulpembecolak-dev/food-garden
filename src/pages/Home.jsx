import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Settings, Bell, Droplet, Plus, Utensils, Flame, Smile, User, LogOut } from 'lucide-react';
import './Home.css';
import { useUser } from '../context/UserContext';
import { useMeals, dominantMacro, GLASS_ML } from '../context/MealsContext';
import { SunGlyph, RainGlyph, CactusGlyph } from '../components/WeatherGlyphs';

import { TreePlant, MushroomPlant, WheatPlant, SucculentPlant } from '../components/Plants';

const NEW_MEAL_WINDOW_MS = 5000;

function greeting(hour) {
  if (hour < 6) return 'Good night';
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function plantFor(macroType, isNew) {
  if (macroType === 'carbs') return <WheatPlant isNew={isNew} />;
  if (macroType === 'sugars') return <MushroomPlant isNew={isNew} />;
  if (macroType === 'fats') return <SucculentPlant isNew={isNew} />;
  return <TreePlant isNew={isNew} />;
}

export default function Home() {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const { todayMeals, todayWaterMl, addWater } = useMeals();
  const [modalType, setModalType] = useState(null); // 'settings' | 'notifications' | null
  const [now, setNow] = useState(() => new Date());

  // A meal logged in the last few seconds sprouts with an animation;
  // re-render once the window has passed so the class drops off.
  useEffect(() => {
    const newest = todayMeals.reduce((max, m) => Math.max(max, new Date(m.loggedAt).getTime()), 0);
    const remaining = newest + NEW_MEAL_WINDOW_MS - Date.now();
    if (remaining > 0) {
      const timer = setTimeout(() => setNow(new Date()), remaining + 50);
      return () => clearTimeout(timer);
    }
  }, [todayMeals]);

  const hydrationTargetMl = user.targets.hydrationL * 1000;
  const hydrationPct = Math.min(100, Math.round((todayWaterMl / hydrationTargetMl) * 100));
  const hydrationLiters = (todayWaterMl / 1000).toFixed(1);

  const consumedCalories = todayMeals.reduce((sum, m) => sum + (m.macros?.calories ?? 0), 0);
  const consumedProtein = todayMeals.reduce((sum, m) => sum + (m.macros?.protein ?? 0), 0);
  const calPct = Math.min(100, Math.round((consumedCalories / user.targets.calories) * 100));
  const protPct = Math.min(100, Math.round((consumedProtein / user.targets.protein) * 100));

  let topMood = 'None yet';
  if (todayMeals.length > 0) {
    const moodCounts = todayMeals.reduce((acc, m) => {
      if (m.mood) acc[m.mood] = (acc[m.mood] || 0) + 1;
      return acc;
    }, {});
    if (Object.keys(moodCounts).length > 0) {
      const maxMood = Object.entries(moodCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0];
      topMood = maxMood.charAt(0).toUpperCase() + maxMood.slice(1);
    }
  }

  // Garden weather follows today's hydration — watering keeps it green.
  const weather = hydrationPct >= 80
    ? { Glyph: RainGlyph, label: 'Lush' }
    : hydrationPct >= 40
    ? { Glyph: SunGlyph, label: 'Fair' }
    : { Glyph: CactusGlyph, label: 'Dry' };

  const totalPlots = Math.max(4, todayMeals.length);
  const dateLabel = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  // Notifications derived from today's actual state — nothing pre-scripted.
  const notifications = [];
  if (todayMeals.length === 0) notifications.push({ icon: '🌱', text: 'Nothing planted yet today — log your first meal.' });
  if (hydrationPct < 50) notifications.push({ icon: '💧', text: `Hydration at ${hydrationPct}% — your garden could use water.` });
  if (protPct >= 100) notifications.push({ icon: '💪', text: `Protein target reached (${consumedProtein}g / ${user.targets.protein}g).` });
  if (calPct >= 100) notifications.push({ icon: '🔥', text: `Calorie target reached for today.` });
  if (notifications.length === 0) notifications.push({ icon: '✅', text: 'All quiet — your garden is on track.' });

  return (
    <div className="home-container animate-fade-in">
      {/* Header */}
      <header className="main-header">
        <div className="header-text">
          <h1 className="main-greeting">{greeting(now.getHours())},<br/>{user.name}</h1>
          <p className="main-date">{dateLabel} · {user.targets.calories} kcal target</p>
        </div>
        <div className="header-actions">
          <button className="icon-btn" aria-label="Settings" onClick={() => setModalType('settings')}><Settings size={24} /></button>
          <button className="icon-btn" aria-label="Notifications" onClick={() => setModalType('notifications')}><Bell size={24} /></button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="content-grid mt-8">

        {/* Left: Garden Plot */}
        <div className="garden-plot-card">
          <div className="plot-header">
            <div className="plot-titles">
              <h2>Today's garden</h2>
              <span>{todayMeals.length} of {totalPlots} plots planted</span>
            </div>
            <div className="weather-icon" title={`Hydration ${hydrationPct}%`}>
              <weather.Glyph size={15} />
              <span>{weather.label}</span>
            </div>
          </div>

          <div className="plants-grid mt-6">
            {todayMeals.map((meal) => {
              const isNew = now.getTime() - new Date(meal.loggedAt).getTime() < NEW_MEAL_WINDOW_MS;
              return (
                <div key={meal.id} className="plant-cell animate-fade-in">
                  {plantFor(dominantMacro(meal), isNew)}
                  <span className="plant-label">{meal.name || meal.type || 'Meal'}</span>
                </div>
              );
            })}

            {Array.from({ length: Math.max(0, totalPlots - todayMeals.length) }).map((_, idx) => (
              <div key={`empty-${idx}`} className="plant-cell empty-cell">
                <div className="soil-plot">
                   <span className="empty-cell-num">{idx + todayMeals.length + 1}</span>
                </div>
                <span className="plant-label">Empty soil</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Vertical Hydration */}
        <div className="hydration-vertical">
          <button className="hydro-icon-wrap" onClick={() => addWater(GLASS_ML)} aria-label="Add 250 ml">
            <Droplet size={18} fill="var(--color-water)" color="var(--color-water)"/>
          </button>

          <div className="hydro-bar-wrapper">
             <div className="hydro-track" role="progressbar" aria-valuenow={hydrationPct} aria-valuemin="0" aria-valuemax="100" aria-label="Hydration">
                <div className="hydro-fill" style={{ height: `${hydrationPct}%` }}>
                   <span className="hydro-text-rotate">{hydrationLiters} / {user.targets.hydrationL} L</span>
                </div>
             </div>
          </div>

          <button className="hydro-icon-wrap" onClick={() => addWater(-GLASS_ML)} aria-label="Remove 250 ml">
            <Droplet size={18} strokeWidth={2.5} color="var(--text-secondary)"/>
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="stats-cards-row mt-8">
        <div className="s-card">
          <div className="s-card-head"><Flame size={20} color="var(--color-energy)" /><span>Calories</span></div>
          <div className="s-card-val"><strong>{consumedCalories}</strong><span className="s-target">/ {user.targets.calories}</span></div>
          <div className="s-progress"><div className="s-progress-fill" style={{ width: `${calPct}%`, background: 'var(--color-energy)' }} /></div>
        </div>
        <div className="s-card">
          <div className="s-card-head"><Utensils size={20} color="var(--color-protein)" /><span>Protein</span></div>
          <div className="s-card-val"><strong>{consumedProtein}g</strong><span className="s-target">/ {user.targets.protein}g</span></div>
          <div className="s-progress"><div className="s-progress-fill" style={{ width: `${protPct}%`, background: 'var(--color-protein)' }} /></div>
        </div>
        <div className="s-card">
          <div className="s-card-head"><Smile size={20} color="var(--color-mood)" /><span>Mood</span></div>
          <div className="s-card-val"><strong style={{ fontSize: '18px' }}>{topMood}</strong></div>
          <div className="s-card-sub">{todayMeals.length} meal{todayMeals.length === 1 ? '' : 's'} logged today</div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fab-container mt-10">
        <button className="fab-log" onClick={() => navigate('/log')}>
          <div className="fab-circle">
            <Plus size={28} strokeWidth={2.5} />
          </div>
          <span className="fab-label">Log Meal</span>
        </button>
      </div>

      {/* Modals for Settings and Notifications */}
      {modalType && (
        <div className="modal-overlay" onClick={() => setModalType(null)}>
          <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modalType === 'settings' ? 'Settings' : 'Notifications'}</h3>
              <button className="close-btn" onClick={() => setModalType(null)}>✕</button>
            </div>
            <div className="modal-body">
              {modalType === 'settings' ? (
                <div className="settings-menu">
                  <div className="setting-row">
                    <span>Hydration goal</span>
                    <span className="setting-val">{user.targets.hydrationL} L · from your weight</span>
                  </div>
                  <div className="setting-row">
                    <span>Calorie target</span>
                    <span className="setting-val">{user.targets.calories} kcal · from your profile</span>
                  </div>
                  <Link to="/profile" className="setting-row setting-link" onClick={() => setModalType(null)}>
                    <span><User size={14} style={{ verticalAlign: '-2px', marginRight: 6 }} />Edit personal data & goals</span>
                    <span className="setting-val">Profile →</span>
                  </Link>
                  <button className="setting-row setting-link setting-logout" onClick={logout}>
                    <span><LogOut size={14} style={{ verticalAlign: '-2px', marginRight: 6 }} />Log out</span>
                  </button>
                </div>
              ) : (
                <div className="notif-menu">
                  {notifications.map((n, i) => (
                    <div key={i} className={`notif-item ${i === 0 ? 'unread' : ''}`}>
                      <span className="notif-time">Today</span>
                      <p>{n.icon} {n.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
