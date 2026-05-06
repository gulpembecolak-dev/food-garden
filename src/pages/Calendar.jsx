import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Sprout } from 'lucide-react';
import { TreePlant, MushroomPlant, WheatPlant, SucculentPlant } from '../components/Plants';
import './Calendar.css';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_LABELS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

const SAMPLE_MEALS = {
  '2026-05-01': [
    { id: 's1', name: 'Greek Yoghurt Bowl', desc: 'Protein-packed start with berries and seeds.', macroType: 'protein', img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=200' },
    { id: 's2', name: 'Grilled Salmon Plate', desc: 'Salmon with quinoa and roasted asparagus.', macroType: 'protein', img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=200' },
  ],
  '2026-05-02': [
    { id: 's3', name: 'Avocado Toast', desc: 'Sourdough with avocado, lime and chili flakes.', macroType: 'carbs', img: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&q=80&w=200' },
    { id: 's4', name: 'Pasta Primavera', desc: 'Whole-wheat pasta with seasonal vegetables.', macroType: 'carbs', img: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&q=80&w=200' },
    { id: 's5', name: 'Dark Chocolate Square', desc: 'A small treat after dinner.', macroType: 'sugars', img: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&q=80&w=200' },
  ],
  '2026-05-03': [
    { id: 's6', name: 'Egg White Omelette', desc: 'Spinach, mushrooms, and a touch of feta.', macroType: 'protein', img: 'https://images.unsplash.com/photo-1565895405225-31a1f3ed4cdb?auto=format&fit=crop&q=80&w=200' },
  ],
  '2026-05-04': [
    { id: 's7', name: 'Quinoa Salad with Roasted Veg', desc: 'Quinoa, roasted vegetables, and a lemon dressing.', macroType: 'carbs', img: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&q=80&w=200' },
    { id: 's8', name: 'Seafood Bowl', desc: 'Mixed seafood, brown rice and roasted veggies.', macroType: 'protein', img: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&q=80&w=200' },
    { id: 's9', name: 'Kale & Edamame Salad', desc: 'Edamame, kale, sesame seeds, ginger dressing.', macroType: 'fats', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=200' },
  ],
  '2026-05-05': [
    { id: 's10', name: 'Almond Butter Smoothie', desc: 'Banana, almond butter, oat milk, cinnamon.', macroType: 'fats', img: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&q=80&w=200' },
  ],
  '2026-05-07': [
    { id: 's11', name: 'Chickpea Curry', desc: 'Coconut chickpea curry with brown rice.', macroType: 'carbs', img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=200' },
  ],
};

function fmtDate(d) {
  const yr = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const da = String(d.getDate()).padStart(2, '0');
  return `${yr}-${mo}-${da}`;
}

function buildWeek(anchor) {
  const start = new Date(anchor);
  const dow = (start.getDay() + 6) % 7; // Mon=0
  start.setDate(start.getDate() - dow);
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
}

const WEEKLY_HYDRATION_PATTERN = [82, 60, 38, 72, 88, 52, 34, 68, 78, 45];
function weeklyHydration(weekStart) {
  const epochDays = Math.floor(weekStart.getTime() / (1000 * 60 * 60 * 24));
  const idx = Math.floor(epochDays / 7);
  return WEEKLY_HYDRATION_PATTERN[((idx % WEEKLY_HYDRATION_PATTERN.length) + WEEKLY_HYDRATION_PATTERN.length) % WEEKLY_HYDRATION_PATTERN.length];
}

function plantForType(type, key) {
  if (type === 'protein') return <TreePlant key={key} isNew={false} />;
  if (type === 'carbs') return <WheatPlant key={key} isNew={false} />;
  if (type === 'fats') return <SucculentPlant key={key} isNew={false} />;
  if (type === 'sugars') return <MushroomPlant key={key} isNew={false} />;
  return null;
}

export default function Calendar({ meals = [] }) {
  const [anchor, setAnchor] = useState(new Date(2026, 4, 4)); // May 4, 2026

  const monthLabel = `${MONTHS[anchor.getMonth()]} ${anchor.getFullYear()}`;
  const week = useMemo(() => buildWeek(anchor), [anchor]);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const isFutureWeek = week[0] > today;

  const hydraPct = isFutureWeek ? null : weeklyHydration(week[0]);
  const hydraState = isFutureWeek ? null : (hydraPct < 50 ? 'dry' : hydraPct >= 80 ? 'lush' : 'ok');
  const hydraLabel = hydraState ? {
    dry: { emoji: '🌵', text: 'Dry week — your garden is thirsty' },
    ok: { emoji: '🌤', text: 'Steady hydration — garden is holding up' },
    lush: { emoji: '🌧', text: 'Lush week — garden is thriving' },
  }[hydraState] : null;

  // Map logged meals (with loggedAt timestamp) into the same shape as sample meals
  const userMealsByDate = useMemo(() => {
    const map = {};
    meals.forEach((m, i) => {
      if (!m.loggedAt) return;
      const key = fmtDate(new Date(m.loggedAt));
      let macroType = 'protein';
      if (m.macros) {
        const { protein = 0, carbs = 0, fats = 0 } = m.macros;
        if (carbs > protein && carbs > fats) macroType = 'carbs';
        else if (fats > protein && fats > carbs) macroType = 'fats';
        else if (m.type === 'snack') macroType = 'sugars';
      }
      const meal = {
        id: `u${i}`,
        name: m.type ? `${m.type.charAt(0).toUpperCase() + m.type.slice(1)} meal` : 'Logged meal',
        desc: `${m.macros?.calories ?? 0} kcal · ${m.location || 'Unknown'} · ${m.mood || 'neutral'}`,
        macroType,
        img: null,
      };
      if (!map[key]) map[key] = [];
      map[key].push(meal);
    });
    return map;
  }, [meals]);

  const mealsForSelected = useMemo(() => {
    const key = fmtDate(anchor);
    return [...(userMealsByDate[key] || []), ...(SAMPLE_MEALS[key] || [])];
  }, [anchor, userMealsByDate]);

  const mealsForWeek = useMemo(() => {
    return week.flatMap(d => {
      const key = fmtDate(d);
      return [...(userMealsByDate[key] || []), ...(SAMPLE_MEALS[key] || [])];
    });
  }, [week, userMealsByDate]);

  const goPrev = () => {
    const d = new Date(anchor);
    d.setDate(d.getDate() - 7);
    setAnchor(d);
  };
  const goNext = () => {
    const d = new Date(anchor);
    d.setDate(d.getDate() + 7);
    setAnchor(d);
  };

  const sprouts = (m) => {
    // Render 3 sprout marks; the dominant macro one is colored, others muted
    const colors = {
      protein: 'var(--color-success)',
      carbs: 'var(--color-warning)',
      fats: 'var(--color-fats)',
      sugars: 'var(--color-sugars)',
    };
    const main = colors[m.macroType] || 'var(--color-success)';
    return (
      <span className="meal-sprouts" aria-hidden="true">
        <Sprout size={16} color="var(--text-secondary)" strokeWidth={1.6} />
        <Sprout size={16} color={main} strokeWidth={1.8} />
        <Sprout size={16} color="var(--text-secondary)" strokeWidth={1.6} />
      </span>
    );
  };

  return (
    <div className="calendar-container animate-fade-in">
      <header className="cal-month-head">
        <button className="cal-arrow" onClick={goPrev} aria-label="Previous week">
          <ChevronLeft size={20} />
        </button>
        <h1 className="cal-month">{monthLabel}</h1>
        <button className="cal-arrow" onClick={goNext} aria-label="Next week">
          <ChevronRight size={20} />
        </button>
      </header>

      <div className="cal-week" role="tablist" aria-label="Days of the week">
        {week.map((d, i) => {
          const key = fmtDate(d);
          const hasMeals = (userMealsByDate[key]?.length || 0) + (SAMPLE_MEALS[key]?.length || 0) > 0;
          const isActive = fmtDate(d) === fmtDate(anchor);
          return (
            <button
              key={key}
              role="tab"
              aria-selected={isActive}
              className={`cal-day ${isActive ? 'active' : ''}`}
              onClick={() => setAnchor(d)}
            >
              <span className="cal-dow">{DAY_LABELS[i]}</span>
              <span className="cal-date">{d.getDate()}</span>
              <Sprout
                size={18}
                strokeWidth={hasMeals ? 2 : 1.4}
                color={hasMeals ? (isActive ? 'var(--primary-color)' : 'var(--text-primary)') : 'var(--text-secondary)'}
                style={{ opacity: hasMeals ? 1 : 0.45 }}
              />
            </button>
          );
        })}
      </div>

      <section className="cal-overview">
        <div className="cal-overview-head">
          <div>
            <h2 className="cal-overview-title">Weekly Garden Overview</h2>
            <p className="cal-overview-sub">Your planting progress for the current week</p>
          </div>
          {hydraState && (
            <span className={`cal-hydra-badge ${hydraState}`} title={`Avg hydration ${hydraPct}%`}>
              <span className="cal-hydra-emoji" aria-hidden="true">{hydraLabel.emoji}</span>
              <span className="cal-hydra-pct">{hydraPct}%</span>
            </span>
          )}
        </div>

        <div
          className={`cal-garden-stage ${hydraState ? `state-${hydraState}` : 'state-future'}`}
          aria-label={hydraLabel ? `This week's plants — ${hydraLabel.text}` : "Future week — no meals logged yet"}
        >
          <div className="cal-garden-sky" aria-hidden="true" />
          <div className="cal-garden-grid">
            {Array.from({ length: 15 }).map((_, idx) => {
              const meal = mealsForWeek[idx];
              return (
                <div key={idx} className={`cal-cell ${meal ? 'planted' : 'empty'}`}>
                  {meal
                    ? <div className="cal-cell-plant">{plantForType(meal.macroType, idx)}</div>
                    : <span className="cal-empty-soil" />}
                </div>
              );
            })}
          </div>
          {hydraLabel && <p className="cal-garden-caption">{hydraLabel.text}</p>}
          {isFutureWeek && <p className="cal-garden-caption">No meals logged yet — your garden hasn't grown here.</p>}
        </div>
      </section>

      <section className="cal-meals">
        {mealsForSelected.length === 0 ? (
          <div className="cal-empty-state">
            <p>No meals logged on this day.</p>
            <span>Tap "Log meal" on Home to plant something here.</span>
          </div>
        ) : (
          <ul className="cal-meal-list">
            {mealsForSelected.map(m => (
              <li key={m.id} className="cal-meal">
                <div className="cal-meal-img">
                  {m.img ? (
                    <img src={m.img} alt="" />
                  ) : (
                    <div className="cal-meal-placeholder" aria-hidden="true">
                      {plantForType(m.macroType, m.id)}
                    </div>
                  )}
                </div>
                <div className="cal-meal-text">
                  <h3 className="cal-meal-name">{m.name}</h3>
                  <p className="cal-meal-desc">{m.desc}</p>
                </div>
                {sprouts(m)}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
