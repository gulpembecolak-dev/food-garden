import { useState, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight, Sprout, Trash2, Droplets, Flame, Utensils } from 'lucide-react';
import { TreePlant, MushroomPlant, WheatPlant, SucculentPlant } from '../components/Plants';
import { SunGlyph, RainGlyph, CactusGlyph } from '../components/WeatherGlyphs';
import { useUser } from '../context/UserContext';
import { useMeals, dominantMacro, fmtDate } from '../context/MealsContext';
import './Calendar.css';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_LABELS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

// dominant macro → veggie cutout (same mapping as the garden plants)
const VEGGIE_BY_TYPE = { protein: 'peas', carbs: 'carrot', fats: 'cucumber', sugars: 'radish' };

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

function plantForType(type, key) {
  if (type === 'carbs') return <WheatPlant key={key} isNew={false} />;
  if (type === 'fats') return <SucculentPlant key={key} isNew={false} />;
  if (type === 'sugars') return <MushroomPlant key={key} isNew={false} />;
  return <TreePlant key={key} isNew={false} />;
}

const MOOD_EMOJI = { happy: '😄', calm: '😌', excited: '🤩', tired: '😴', stressed: '😫', angry: '😤', frustrated: '😣' };

export default function Calendar() {
  const { user } = useUser();
  const { mealsByDate, hydration, removeMeal } = useMeals();
  const [anchor, setAnchor] = useState(() => new Date());
  const mealsSectionRef = useRef(null);

  const hydrationTargetMl = user.targets.hydrationL * 1000;
  const monthLabel = `${MONTHS[anchor.getMonth()]} ${anchor.getFullYear()}`;
  const week = useMemo(() => buildWeek(anchor), [anchor]);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const isFutureWeek = week[0] > today;

  // Average hydration over the week's elapsed days, measured against the goal
  const hydraPct = useMemo(() => {
    if (isFutureWeek) return null;
    const elapsed = week.filter(d => d <= today);
    if (elapsed.length === 0) return null;
    const sum = elapsed.reduce((acc, d) => acc + (hydration[fmtDate(d)] || 0), 0);
    return Math.round((sum / elapsed.length / hydrationTargetMl) * 100);
  }, [week, today, hydration, hydrationTargetMl, isFutureWeek]);

  const hydraState = hydraPct == null ? null : (hydraPct < 50 ? 'dry' : hydraPct >= 80 ? 'lush' : 'ok');
  const hydraLabel = hydraState ? {
    dry: { Glyph: CactusGlyph, text: 'Dry week — your garden is thirsty' },
    ok: { Glyph: SunGlyph, text: 'Steady hydration — garden is holding up' },
    lush: { Glyph: RainGlyph, text: 'Lush week — garden is thriving' },
  }[hydraState] : null;

  const selectedKey = fmtDate(anchor);
  const mealsForSelected = mealsByDate[selectedKey] || [];
  const selectedWaterMl = hydration[selectedKey] || 0;
  const selectedWaterL = (selectedWaterMl / 1000).toFixed(1);
  const selectedWaterPct = Math.min(100, Math.round((selectedWaterMl / hydrationTargetMl) * 100));

  const selectedTotals = useMemo(() => {
    return mealsForSelected.reduce(
      (acc, m) => {
        acc.calories += m.macros?.calories ?? 0;
        acc.protein += m.macros?.protein ?? 0;
        acc.carbs += m.macros?.carbs ?? 0;
        acc.fats += m.macros?.fats ?? 0;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );
  }, [mealsForSelected]);

  const selectedDateLabel = useMemo(() => {
    return anchor.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  }, [anchor]);

  const handleSelectDay = (d, shouldScroll = false) => {
    setAnchor(d);
    if (shouldScroll && mealsSectionRef.current) {
      mealsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

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
      protein: 'var(--color-protein)',
      carbs: 'var(--color-carbs)',
      fats: 'var(--color-fats)',
      sugars: 'var(--color-sugars)',
    };
    const main = colors[dominantMacro(m)] || 'var(--color-protein)';
    return (
      <span className="meal-sprouts" aria-hidden="true">
        <Sprout size={16} color="var(--text-secondary)" strokeWidth={1.6} />
        <Sprout size={16} color={main} strokeWidth={1.8} />
        <Sprout size={16} color="var(--text-secondary)" strokeWidth={1.6} />
      </span>
    );
  };

  const describeMeal = (m) => {
    const parts = [`${m.macros?.calories ?? 0} kcal`];
    if (m.location) parts.push(m.location);
    if (m.mood) parts.push(`${MOOD_EMOJI[m.mood] || ''} ${m.mood}`);
    if (m.social) parts.push(m.social === 'alone' ? 'alone' : 'with others');
    return parts.join(' · ');
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
          const hasMeals = (mealsByDate[key]?.length || 0) > 0;
          const isActive = key === fmtDate(anchor);
          return (
            <button
              key={key}
              role="tab"
              aria-selected={isActive}
              className={`cal-day ${isActive ? 'active' : ''}`}
              onClick={() => handleSelectDay(d)}
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
            <p className="cal-overview-sub">Tap any day in your garden bed to view its summary</p>
          </div>
          {hydraState && (
            <span className={`cal-hydra-badge ${hydraState}`} title={`Avg hydration ${hydraPct}%`}>
              <hydraLabel.Glyph size={14} />
              <span className="cal-hydra-pct">{hydraPct}%</span>
            </span>
          )}
        </div>

        <div
          className={`cal-bed ${hydraState ? `bed-${hydraState}` : 'bed-future'}`}
          aria-label={hydraLabel ? `This week's plants — ${hydraLabel.text}` : 'Future week — no meals logged yet'}
        >
          <div className="cal-bed-grid">
            {week.map((d, i) => {
              const key = fmtDate(d);
              const dayMeals = mealsByDate[key] || [];
              const isActive = key === fmtDate(anchor);
              return (
                <button
                  key={key}
                  type="button"
                  className={`cal-bed-col ${isActive ? 'active' : ''}`}
                  onClick={() => handleSelectDay(d, true)}
                  aria-label={`${DAY_LABELS[i]} ${d.getDate()}: ${dayMeals.length} meals logged. Tap to view summary.`}
                >
                  <div className="cal-bed-plants">
                    {dayMeals.slice(0, 2).map(m => (
                      <img
                        key={m.id}
                        src={`/veggies/${VEGGIE_BY_TYPE[dominantMacro(m)] || 'peas'}.png`}
                        alt=""
                        title={m.name || m.type}
                      />
                    ))}
                    {dayMeals.length > 2 && <span className="cal-bed-more">+{dayMeals.length - 2}</span>}
                  </div>
                  <span className={`cal-bed-mound ${dayMeals.length === 0 ? 'empty' : ''} ${isActive ? 'active' : ''}`} aria-hidden="true" />
                  <span className={`cal-bed-day ${isActive ? 'active' : ''}`}>{DAY_LABELS[i]}</span>
                </button>
              );
            })}
          </div>
          {hydraLabel && <p className="cal-bed-caption">{hydraLabel.text}</p>}
          {isFutureWeek && <p className="cal-bed-caption">No meals logged yet — your garden hasn't grown here.</p>}
        </div>
      </section>

      {/* Selected Day Summary & Meals */}
      <section className="cal-meals" ref={mealsSectionRef} id="cal-selected-day-section">
        <div className="cal-day-summary-card">
          <div className="cal-day-summary-head">
            <div>
              <span className="cal-day-summary-tag">Daily Summary</span>
              <h3 className="cal-day-summary-date">{selectedDateLabel}</h3>
            </div>
            <div className="cal-day-summary-count">
              <Utensils size={14} />
              <span>{mealsForSelected.length} {mealsForSelected.length === 1 ? 'meal' : 'meals'}</span>
            </div>
          </div>

          {mealsForSelected.length > 0 && (
            <div className="cal-day-stats-grid">
              <div className="cal-stat-pill">
                <Flame size={15} className="cal-stat-icon kcal" />
                <div className="cal-stat-text">
                  <strong>{selectedTotals.calories}</strong>
                  <span>/ {user.targets.calories} kcal</span>
                </div>
              </div>
              <div className="cal-stat-pill">
                <Droplets size={15} className="cal-stat-icon water" />
                <div className="cal-stat-text">
                  <strong>{selectedWaterL} L</strong>
                  <span>water ({selectedWaterPct}%)</span>
                </div>
              </div>
              <div className="cal-macro-chips">
                <span className="macro-chip protein">P: {selectedTotals.protein}g</span>
                <span className="macro-chip carbs">C: {selectedTotals.carbs}g</span>
                <span className="macro-chip fats">F: {selectedTotals.fats}g</span>
              </div>
            </div>
          )}
        </div>

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
                  <div className="cal-meal-placeholder" aria-hidden="true">
                    {plantForType(dominantMacro(m), m.id)}
                  </div>
                </div>
                <div className="cal-meal-text">
                  <h3 className="cal-meal-name">
                    {m.name || (m.type ? m.type.charAt(0).toUpperCase() + m.type.slice(1) : 'Meal')}
                  </h3>
                  <p className="cal-meal-desc">{describeMeal(m)}</p>
                </div>
                {sprouts(m)}
                <button
                  className="cal-meal-delete"
                  onClick={() => removeMeal(m.id)}
                  aria-label={`Delete ${m.name || m.type}`}
                  title="Remove this meal"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
