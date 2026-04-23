import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Bell, Sun, Droplet, Plus, Utensils, BicepsFlexed, Smile } from 'lucide-react';
import './Home.css';

import { TreePlant, MushroomPlant, WheatPlant, SucculentPlant } from '../components/Plants';

export default function Home({ meals = [] }) {
  const navigate = useNavigate();
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

  // Stats Calculations
  let topMacro = 'Protein';
  if (meals.length > 0) {
    const sums = meals.reduce((acc, m) => {
      if (m.macros) {
         acc.protein += m.macros.protein || 0;
         acc.carbs += m.macros.carbs || 0;
         acc.fats += m.macros.fats || 0;
      }
      return acc;
    }, { protein: 0, carbs: 0, fats: 0 });
    const max = Math.max(sums.protein, sums.carbs, sums.fats);
    if (max === sums.carbs) topMacro = 'Carbs';
    else if (max === sums.fats) topMacro = 'Fats';
    else if (max === 0 && meals.some(m => m.type === 'snack')) topMacro = 'Sugars';
  }

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
          <h1 className="main-greeting">Good Morning,<br/>Alex</h1>
          <p className="main-date">Friday, March 13</p>
        </div>
        <div className="header-actions">
          <button className="icon-btn" onClick={() => setModalType('settings')}><Settings size={28} /></button>
          <button className="icon-btn" onClick={() => setModalType('notifications')}><Bell size={28} /></button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="content-grid mt-8">
        
        {/* Left: Garden Plot */}
        <div className="garden-plot-card">
          <div className="plot-header">
            <div className="plot-titles">
              <h2>Garden Plot</h2>
              <span>Soil & hydration status</span>
            </div>
            <div className="weather-icon">
              <Sun size={32} color="#FBBF24" />
              <span>Sun</span>
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
                   <span style={{opacity: 0.3, fontSize: '12px', marginTop: '6px', color: '#94A3B8'}}>{idx + meals.length + 1}</span>
                </div>
                <span className="plant-label" style={{opacity: 0.5}}>Empty Soil</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Vertical Hydration */}
        <div className="hydration-vertical">
          <button className="hydro-icon-wrap" onClick={addHydration} style={{ cursor: 'pointer', border: 'none' }}>
            <Droplet size={24} fill="#94A3B8" color="#94A3B8"/>
          </button>
          
          <div className="hydro-bar-wrapper">
             <div className="hydro-track">
                <div className="hydro-fill" style={{ height: `${hydration}%` }}>
                   <span className="hydro-text-rotate">Hydration Level: {hydration}%</span>
                </div>
             </div>
          </div>

          <button className="hydro-icon-wrap" onClick={removeHydration} style={{ cursor: 'pointer', border: 'none' }}>
            <Droplet size={24} strokeWidth={2.5} color="#94A3B8"/>
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="stats-cards-row mt-8">
        <div className="s-card">
          <Utensils size={36} color="#94A3B8" />
          <div className="s-text mt-4">Meals:<br/><strong>{meals.length}</strong></div>
        </div>
        <div className="s-card">
          <BicepsFlexed size={36} color="#4ADE80" />
          <div className="s-text mt-4">
            Top Macro:<br/><strong style={{color: topMacro === 'Carbs' ? '#FBBF24' : topMacro === 'Fats' ? '#14B8A6' : topMacro === 'Sugars' ? '#A855F7' : '#4ADE80'}}>{topMacro}</strong>
          </div>
        </div>
        <div className="s-card">
          <Smile size={36} color="#FBBF24" />
          <div className="s-text mt-4">
            Mood:<br/><strong style={{color:"#FBBF24"}}>{topMood}</strong>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fab-container mt-10">
        <button className="fab-log" onClick={() => navigate('/log')}>
          <div className="fab-circle">
            <Plus size={36} color="#E2E8F0" />
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
