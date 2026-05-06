import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Bell, Sun, Droplet, Plus, Utensils, Flame, Smile } from 'lucide-react';
import './Home.css';
import { useUser } from '../context/UserContext';
import Recommendation from '../components/Recommendation';

import { TreePlant, MushroomPlant, WheatPlant, SucculentPlant } from '../components/Plants';

export default function Home({ meals = [] }) {
  const navigate = useNavigate();
  const { user } = useUser();
  const [hydration, setHydration] = useState(60);
  const [modalType, setModalType] = useState(null); // 'settings' | 'notifications' | null
  const [, setForceRender] = useState(0);

  // Strip isNew flag after 4 seconds
  useEffect(() => {
     let hasNew = false;
     meals.forEach(m => {
        if (m.isNew) hasNew = true;
     });
     if (hasNew) {
        const timer = setTimeout(() => {
           meals.forEach(m => m.isNew = false);
           setForceRender(prev => prev + 1); // trigger re-render to strip classes
        }, 4000);
        return () => clearTimeout(timer);
     }
  }, [meals]);

  // 10% = 250ml. 100% = 2.5 Liters
  const addHydration = () => {
    setHydration(prev => Math.min(prev + 10, 100));
  };

  const removeHydration = () => {
    setHydration(prev => Math.max(prev - 10, 0));
  };

  const consumedCalories = meals.reduce((sum, m) => sum + (m.macros?.calories ?? 0) * 10, 0);
  const consumedProtein = meals.reduce((sum, m) => sum + (m.macros?.protein ?? 0), 0);
  const calPct = Math.min(100, Math.round((consumedCalories / user.targets.calories) * 100));
  const protPct = Math.min(100, Math.round((consumedProtein / user.targets.protein) * 100));

  const hydrationLiters = ((hydration / 100) * user.targets.hydrationL).toFixed(1);

  let topMood = 'None Yet';
  if (meals.length > 0) {
    const moodCounts = meals.reduce((acc, m) => {
      if (m.mood) {
         acc[m.mood] = (acc[m.mood] || 0) + 1;
      }
      return acc;
    }, {});
    if (Object.keys(moodCounts).length > 0) {
       const maxMood = Object.entries(moodCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0];
       topMood = maxMood.charAt(0).toUpperCase() + maxMood.slice(1);
    }
  }

  return (
    <div className="home-container animate-fade-in">
      {/* Header */}
      <header className="main-header">
        <div className="header-text">
          <h1 className="main-greeting">Good morning,<br/>{user.name}</h1>
          <p className="main-date">Friday, March 13 · {user.targets.calories} kcal target</p>
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
              <h2>Garden plot</h2>
              <span>{meals.length} of 4 plots planted</span>
            </div>
            <div className="weather-icon">
              <Sun size={14} color="#FBBF24" />
              <span>Sunny</span>
            </div>
          </div>

          <div className="plants-grid mt-6">
            {meals.map((meal, idx) => {
              let pType = 'protein';
              if (meal.macros && meal.macros.carbs > meal.macros.protein && meal.macros.carbs > meal.macros.fats) pType = 'carbs';
              else if (meal.macros && meal.macros.fats > meal.macros.protein && meal.macros.fats > meal.macros.carbs) pType = 'fats';
              else if (meal.type === 'snack') pType = 'sugars';
              
              return (
                <div key={`meal-${idx}`} className="plant-cell animate-fade-in">
                  {pType === 'protein' && <TreePlant isNew={meal.isNew} />}
                  {pType === 'carbs' && <WheatPlant isNew={meal.isNew} />}
                  {pType === 'sugars' && <MushroomPlant isNew={meal.isNew} />}
                  {pType === 'fats' && <SucculentPlant isNew={meal.isNew} />}
                  <span className="plant-label" style={{textTransform: 'capitalize'}}>{meal.type || 'Meal'}</span>
                </div>
              );
            })}
            
            {Array.from({length: Math.max(0, 4 - meals.length)}).map((_, idx) => (
              <div key={`empty-${idx}`} className="plant-cell empty-cell">
                <div className="soil-plot">
                   <span className="empty-cell-num">{idx + meals.length + 1}</span>
                </div>
                <span className="plant-label">Empty soil</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Vertical Hydration */}
        <div className="hydration-vertical">
          <button className="hydro-icon-wrap" onClick={addHydration} aria-label="Add 250 ml">
            <Droplet size={18} fill="#60A5FA" color="#60A5FA"/>
          </button>

          <div className="hydro-bar-wrapper">
             <div className="hydro-track" role="progressbar" aria-valuenow={hydration} aria-valuemin="0" aria-valuemax="100" aria-label="Hydration">
                <div className="hydro-fill" style={{ height: `${hydration}%` }}>
                   <span className="hydro-text-rotate">{hydrationLiters} / {user.targets.hydrationL} L</span>
                </div>
             </div>
          </div>

          <button className="hydro-icon-wrap" onClick={removeHydration} aria-label="Remove 250 ml">
            <Droplet size={18} strokeWidth={2.5} color="var(--text-secondary)"/>
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="stats-cards-row mt-8">
        <div className="s-card">
          <div className="s-card-head"><Flame size={20} color="#FBBF24" /><span>Calories</span></div>
          <div className="s-card-val"><strong>{consumedCalories}</strong><span className="s-target">/ {user.targets.calories}</span></div>
          <div className="s-progress"><div className="s-progress-fill" style={{ width: `${calPct}%`, background: '#FBBF24' }} /></div>
        </div>
        <div className="s-card">
          <div className="s-card-head"><Utensils size={20} color="#3B82F6" /><span>Protein</span></div>
          <div className="s-card-val"><strong>{consumedProtein}g</strong><span className="s-target">/ {user.targets.protein}g</span></div>
          <div className="s-progress"><div className="s-progress-fill" style={{ width: `${protPct}%`, background: '#3B82F6' }} /></div>
        </div>
        <div className="s-card">
          <div className="s-card-head"><Smile size={20} color="#A855F7" /><span>Mood</span></div>
          <div className="s-card-val"><strong style={{ fontSize: '18px' }}>{topMood}</strong></div>
          <div className="s-card-sub">{meals.length} meal{meals.length === 1 ? '' : 's'} logged</div>
        </div>
      </div>

      {/* Personalized recommendation */}
      <div className="recommendation-slot mt-8">
        <Recommendation
          user={user}
          consumedCalories={consumedCalories}
          consumedProtein={consumedProtein}
          hydrationPct={hydration}
          onAction={() => navigate('/log')}
        />
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
                    <span>Dark Theme</span>
                    <input type="checkbox" defaultChecked />
                  </div>
                  <div className="setting-row">
                    <span>Hydration Goal</span>
                    <span className="setting-val">2.5 L</span>
                  </div>
                  <div className="setting-row">
                    <span>Reminders</span>
                    <input type="checkbox" defaultChecked />
                  </div>
                </div>
              ) : (
                <div className="notif-menu">
                  <div className="notif-item unread">
                    <span className="notif-time">10m ago</span>
                    <p>💧 Don't forget to water your garden!</p>
                  </div>
                  <div className="notif-item">
                    <span className="notif-time">2h ago</span>
                    <p>💪 You hit your protein target for lunch.</p>
                  </div>
                  <div className="notif-item">
                    <span className="notif-time">Yesterday</span>
                    <p>🌱 A new companion plant grew in your garden.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
