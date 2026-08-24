import { useState, useMemo } from 'react';
import './Insights.css';
import { BookOpen, Sprout } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useMeals, fmtDate } from '../context/MealsContext';
import JournalDrawer from '../components/JournalDrawer';
import { useJournal } from '../hooks/useJournal';

const MOOD_META = {
  happy: { emoji: '😄', label: 'Happy' },
  calm: { emoji: '😌', label: 'Calm' },
  excited: { emoji: '🤩', label: 'Excited' },
  tired: { emoji: '😴', label: 'Tired' },
  stressed: { emoji: '😫', label: 'Stressed' },
  angry: { emoji: '😤', label: 'Frustrated' },
};

const HYDRA_THRESHOLD = { good: 80, mid: 50 };
function hydraStatus(v) {
  if (v >= HYDRA_THRESHOLD.good) return 'good';
  if (v >= HYDRA_THRESHOLD.mid) return 'mid';
  return 'low';
}

function dayKeysBack(n) {
  const keys = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    keys.push(fmtDate(d));
  }
  return keys;
}

function weekKeys() {
  // Monday of the current week through Sunday
  const d = new Date();
  const dow = (d.getDay() + 6) % 7; // Mon=0
  d.setDate(d.getDate() - dow);
  const keys = [];
  for (let i = 0; i < 7; i++) {
    keys.push(fmtDate(d));
    d.setDate(d.getDate() + 1);
  }
  return keys;
}

function computeMoodInsight(outcomes) {
  const enriched = outcomes.map(o => {
    const total = o.up + o.steady + o.down;
    return { ...o, total, upPct: total ? o.up / total : 0, downPct: total ? o.down / total : 0 };
  }).filter(o => o.total > 0);
  if (enriched.length === 0) return null;
  const best = enriched.reduce((a, b) => a.upPct > b.upPct ? a : b);
  const worst = enriched.reduce((a, b) => a.downPct > b.downPct ? a : b);
  if (best.id === worst.id) return null;
  return {
    bestLabel: best.label,
    bestEmoji: best.emoji,
    bestPct: Math.round(best.upPct * 100),
    worstLabel: worst.label,
    worstEmoji: worst.emoji,
    worstPct: Math.round(worst.downPct * 100),
  };
}

export default function Insights() {
  const { user } = useUser();
  const { mealsByDate, hydration } = useMeals();
  const tabs = ['This week', 'This month'];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [journalOpen, setJournalOpen] = useState(false);
  const journal = useJournal();

  const targets = user.targets;
  const hydrationTargetMl = targets.hydrationL * 1000;
  const todayStr = fmtDate(new Date());

  // ---- Everything below is computed from logged meals + water ----
  const data = useMemo(() => {
    const hydraPctOf = (key) => Math.round(((hydration[key] || 0) / hydrationTargetMl) * 100);

    const dayTotals = (key) => {
      const meals = mealsByDate[key] || [];
      return meals.reduce((acc, m) => {
        acc.calories += m.macros?.calories ?? 0;
        acc.protein += m.macros?.protein ?? 0;
        acc.carbs += m.macros?.carbs ?? 0;
        acc.fats += m.macros?.fats ?? 0;
        acc.count += 1;
        return acc;
      }, { calories: 0, protein: 0, carbs: 0, fats: 0, count: 0 });
    };

    const dayBalance = (totals) => {
      if (!totals.count) return null;
      const pcts = [
        Math.min(100, (totals.protein / targets.protein) * 100),
        Math.min(100, (totals.carbs / targets.carbs) * 100),
        Math.min(100, (totals.fats / targets.fats) * 100),
      ];
      return Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length);
    };

    const healthOf = (key) => {
      const totals = dayTotals(key);
      if (key > todayStr) return 'future';
      if (!totals.count) return 'empty';
      const balance = dayBalance(totals);
      const hydra = hydraPctOf(key);
      const score = balance * 0.7 + Math.min(100, hydra) * 0.3;
      if (score >= 75) return 'green-dark';
      if (score >= 60) return 'green-light';
      if (score >= 40) return 'yellow';
      return 'red';
    };

    let days, keysInRange;
    if (activeTab === 'This week') {
      keysInRange = weekKeys();
      days = keysInRange.map((key, i) => ({
        key,
        label: ['M', 'T', 'W', 'Th', 'F', 'S', 'Su'][i],
        hydration: key > todayStr ? null : hydraPctOf(key),
        health: healthOf(key),
      }));
    } else {
      // last 28 days, grouped per week
      const all = dayKeysBack(28);
      days = [0, 1, 2, 3].map(w => {
        const chunk = all.slice(w * 7, w * 7 + 7);
        const pcts = chunk.map(hydraPctOf);
        const healths = chunk.map(healthOf).filter(h => h !== 'empty' && h !== 'future');
        const rank = { 'green-dark': 4, 'green-light': 3, 'yellow': 2, 'red': 1 };
        const avgRank = healths.length
          ? healths.reduce((a, h) => a + rank[h], 0) / healths.length
          : null;
        const health = avgRank == null ? 'empty'
          : avgRank >= 3.5 ? 'green-dark'
          : avgRank >= 2.5 ? 'green-light'
          : avgRank >= 1.5 ? 'yellow'
          : 'red';
        return {
          key: chunk[0],
          label: `W${w + 1}`,
          hydration: Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length),
          health,
        };
      });
      keysInRange = all;
    }

    const mealsInRange = keysInRange.flatMap(key => mealsByDate[key] || []);
    const loggedDays = keysInRange.filter(key => (mealsByDate[key] || []).length > 0);

    // Average intake per logged day vs daily targets
    const totals = loggedDays.reduce((acc, key) => {
      const t = dayTotals(key);
      acc.protein += t.protein; acc.carbs += t.carbs; acc.fats += t.fats;
      return acc;
    }, { protein: 0, carbs: 0, fats: 0 });
    const nDays = Math.max(1, loggedDays.length);
    const macroPct = {
      protein: totals.protein / nDays / targets.protein,
      carbs: totals.carbs / nDays / targets.carbs,
      fats: totals.fats / nDays / targets.fats,
    };

    // Locations
    const locCounts = {};
    mealsInRange.forEach(m => {
      if (m.location) locCounts[m.location] = (locCounts[m.location] || 0) + 1;
    });
    const locTotal = Object.values(locCounts).reduce((a, b) => a + b, 0);
    const locations = Object.fromEntries(
      Object.entries(locCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([place, count]) => [place, Math.round((count / locTotal) * 100)])
    );

    // Mood × energy from logged meals
    const moodOutcomes = Object.entries(MOOD_META).map(([id, meta]) => {
      const rows = mealsInRange.filter(m => m.mood === id);
      return {
        id, ...meta,
        up: rows.filter(m => m.energy === 'up').length,
        steady: rows.filter(m => m.energy === 'steady').length,
        down: rows.filter(m => m.energy === 'down').length,
      };
    }).filter(o => o.up + o.steady + o.down > 0);

    // Most frequent meals — by name when present (example data), else by type
    const nameCounts = {};
    mealsInRange.forEach(m => {
      const n = m.name?.trim() || (m.type ? m.type.charAt(0).toUpperCase() + m.type.slice(1) : null);
      if (n) nameCounts[n] = (nameCounts[n] || 0) + 1;
    });
    const frequentMeals = Object.entries(nameCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    return { days, mealsInRange, loggedDays, macroPct, locations, moodOutcomes, frequentMeals };
  }, [activeTab, mealsByDate, hydration, hydrationTargetMl, targets, todayStr]);

  const macroRows = useMemo(() => {
    const items = [
      { key: 'protein', label: 'Protein', target: targets.protein, color: 'var(--color-protein)', unit: 'g' },
      { key: 'carbs',   label: 'Carbs',   target: targets.carbs,   color: 'var(--color-carbs)', unit: 'g' },
      { key: 'fats',    label: 'Fats',    target: targets.fats,    color: 'var(--color-fats)', unit: 'g' },
    ];
    return items.map(it => {
      const pct = data.macroPct[it.key];
      const consumed = Math.round(it.target * pct);
      return { ...it, consumed, pct: Math.round(pct * 100) };
    });
  }, [data, targets]);

  const balanceScore = useMemo(() => {
    const avg = macroRows.reduce((sum, r) => sum + Math.min(r.pct, 100), 0) / macroRows.length;
    return Math.round(avg);
  }, [macroRows]);
  const scoreColor = balanceScore >= 80 ? 'var(--color-success)' : balanceScore >= 65 ? 'var(--color-warning)' : 'var(--color-danger)';

  const hydra = useMemo(() => {
    const measured = data.days.filter(d => d.hydration != null);
    if (measured.length === 0) return null;
    const avgPct = Math.round(measured.reduce((a, d) => a + d.hydration, 0) / measured.length);
    const avgL = Math.round((avgPct / 100) * targets.hydrationL * 10) / 10;
    const best = measured.reduce((a, d) => d.hydration > a.hydration ? d : a);
    const worst = measured.reduce((a, d) => d.hydration < a.hydration ? d : a);
    return { avgPct, avgL, best, worst };
  }, [data, targets.hydrationL]);

  const hasData = data.mealsInRange.length > 0;
  const moodInsight = computeMoodInsight(data.moodOutcomes);

  return (
    <div className="insights-container animate-fade-in">
      <header className="insights-head">
        <div>
          <h1 className="journal-title">Garden Journal</h1>
          <p className="journal-sub">Patterns for {user.name} · goal: {targets.calories} kcal / {targets.hydrationL} L</p>
        </div>
      </header>

      <div className="insights-toolbar">
        <div className="tabs-scroll-container" role="tablist" aria-label="Time range">
          <div className="tabs-wrapper">
            {tabs.map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={activeTab === t}
                className={`journal-tab ${activeTab === t ? 'active' : ''}`}
                onClick={() => setActiveTab(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <button
          className="journal-trigger"
          onClick={() => setJournalOpen(true)}
          aria-label={`Open ${user.name}'s journal`}
        >
          <BookOpen size={15} />
          <span>{user.name}'s journal</span>
          <span className={`journal-trigger__count ${journal.entries.length === 0 ? 'empty' : ''}`}>
            {journal.entries.length}
          </span>
        </button>
      </div>

      <JournalDrawer
        open={journalOpen}
        onClose={() => setJournalOpen(false)}
        user={user}
        entries={journal.entries}
        onAdd={journal.add}
        onRemove={journal.remove}
      />

      {!hasData ? (
        <div className="insights-empty glass-panel mt-6">
          <Sprout size={36} />
          <h3>No meals in this range yet</h3>
          <p>
            Log a few meals and the charts on this page grow out of them —
            nutrition balance, hydration, mood × energy and your eating places.
          </p>
        </div>
      ) : (
      <>
      <div className="insights-grid mt-6">
        <div className="journal-card">
          <div className="nut-head">
            <div>
              <h3 className="card-heading">Nutrition balance</h3>
              <span className="card-sub">avg per logged day · {data.loggedDays.length} day{data.loggedDays.length === 1 ? '' : 's'}</span>
            </div>
            <div className="nut-score" style={{ '--score-color': scoreColor }}>
              <div className="nut-score-ring">
                <span className="nut-score-val">{balanceScore}</span>
              </div>
              <span className="nut-score-label">Balance</span>
            </div>
          </div>

          <ul className="macro-rows">
            {macroRows.map(row => (
              <li key={row.key} className="macro-row" style={{ '--macro-color': row.color }}>
                <div className="macro-row-top">
                  <span className="macro-row-label">{row.label}</span>
                  <span className="macro-row-vals">
                    <strong>{row.consumed}</strong><span className="macro-row-target">/ {row.target} {row.unit}</span>
                  </span>
                </div>
                <div className="macro-row-bar">
                  <div className="macro-row-fill" style={{ width: `${Math.min(row.pct, 100)}%` }} />
                </div>
              </li>
            ))}
          </ul>

          <p className="nut-footer">
            {balanceScore >= 80
              ? 'Strong macro split — keep this pattern.'
              : balanceScore >= 65
              ? 'Decent split. Lift the lowest macro to round it out.'
              : 'Below your targets. Plan one meal around your gap macro.'}
          </p>
        </div>

        <div className="journal-card">
          <div className="nut-head">
            <div>
              <h3 className="card-heading">Hydration trend</h3>
              <span className="card-sub">{hydra ? `${hydra.avgL} L avg · ${targets.hydrationL} L goal` : `goal ${targets.hydrationL} L`}</span>
            </div>
            {hydra && <span className={`hydra-pct ${hydraStatus(hydra.avgPct)}`}>{hydra.avgPct}%</span>}
          </div>

          <div className="hydra-chart">
            <span className="hydra-goal-tick" aria-hidden="true">100%</span>
            <div className="hydra-goal-line" aria-hidden="true" />
            <div className="hydra-bars">
              {data.days.map((day) => {
                const v = day.hydration;
                const status = v == null ? null : hydraStatus(v);
                return (
                  <div
                    key={day.key}
                    className={`hydra-day ${hydra?.best.key === day.key ? 'best' : ''} ${hydra?.worst.key === day.key ? 'worst' : ''}`}
                    title={v == null ? `${day.label}: upcoming` : `${day.label}: ${v}% of goal`}
                  >
                    <div className="hydra-bar-track">
                      {v != null && (
                        <div
                          className={`hydra-bar-fill ${status}`}
                          style={{ height: `${Math.min(v, 100)}%` }}
                          role="img"
                          aria-label={`${day.label}: ${v}% of goal`}
                        />
                      )}
                    </div>
                    <span className="hydra-day-label">{day.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {hydra && (
            <div className="hydra-meta">
              <span><span className="hydra-dot good" /> Best · {hydra.best.label} {hydra.best.hydration}%</span>
              <span><span className="hydra-dot low" /> Worst · {hydra.worst.label} {hydra.worst.hydration}%</span>
            </div>
          )}
        </div>

        <div className="journal-card mood-card-wide">
          <h3 className="card-heading">Mood × energy</h3>
          {data.moodOutcomes.length === 0 ? (
            <div className="mood-empty">No mood data logged in this range yet.</div>
          ) : (
          <ul className="mood-rows">
            {data.moodOutcomes.map(m => {
              const total = m.up + m.steady + m.down;
              const upPct = (m.up / total) * 100;
              const steadyPct = (m.steady / total) * 100;
              const downPct = (m.down / total) * 100;
              return (
                <li key={m.id} className="mood-row">
                  <div className="mood-row-head">
                    <span className="mood-row-emoji" aria-hidden="true">{m.emoji}</span>
                    <span className="mood-row-label">{m.label}</span>
                    <span className="mood-row-count">{total}</span>
                  </div>
                  <div className="mood-stack" role="img" aria-label={`${m.up} energized, ${m.steady} steady, ${m.down} sluggish`}>
                    {upPct > 0 && <span className="mood-seg up" style={{ width: `${upPct}%` }} />}
                    {steadyPct > 0 && <span className="mood-seg steady" style={{ width: `${steadyPct}%` }} />}
                    {downPct > 0 && <span className="mood-seg down" style={{ width: `${downPct}%` }} />}
                  </div>
                </li>
              );
            })}
          </ul>
          )}
          {moodInsight && (
            <p className="mood-insight">
              Energy peaks on <strong>{moodInsight.bestEmoji} {moodInsight.bestLabel.toLowerCase()}</strong> meals ({moodInsight.bestPct}% ↑) · slumps on <strong>{moodInsight.worstEmoji} {moodInsight.worstLabel.toLowerCase()}</strong> ({moodInsight.worstPct}% ↓).
            </p>
          )}
        </div>
      </div>

      <h2 className="section-heading mt-8">Pattern discovery</h2>
      <div className="pattern-grid">
        <div className="glass-panel p-card">
          <h3 className="card-heading mb-4">Most frequent meals</h3>
          {data.frequentMeals.length === 0 ? (
            <div className="mood-empty">Your repeated meals show up here.</div>
          ) : (
            <ul className="meal-list">
              {data.frequentMeals.map(([mealName, count]) => (
                <li key={mealName}><span className="emoji-icon">🍽</span> {mealName} ({count}×)</li>
              ))}
            </ul>
          )}
        </div>

        <div className="glass-panel p-card">
          <h3 className="card-heading mb-4">Where do you eat?</h3>
          <div className="bar-chart-rows">
            {Object.entries(data.locations).map(([place, pct]) => (
              <div className="bar-row" key={place}>
                <span className="bar-label">{place}</span>
                <div className="bar-track"><div className="bar-fill" style={{ width: `${pct}%`, backgroundColor: user.accent }}/></div>
                <span className="bar-pct">{pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-panel p-card mt-4">
        <h3 className="card-heading mb-3">{activeTab === 'This week' ? 'Daily garden health' : 'Weekly garden health'}</h3>
        <div className="garden-health-row">
           <div className="gh-days">
             {data.days.map((day) => (
               <div className="gh-col" key={day.key}>
                 <span className="gh-lbl">{day.label}</span>
                 <div className={`gh-box ${day.health}`} title={day.health === 'empty' ? 'No meals logged' : day.health === 'future' ? 'Upcoming' : undefined}></div>
               </div>
             ))}
           </div>
           <div className="gh-legend text-xs">
              <div><span className="dot-sm green-dark"></span> on target <span className="dot-sm yellow"></span> partial <span className="dot-sm red"></span> off target</div>
              <div className="text-secondary">macro balance (70%) + hydration (30%) vs. your own targets</div>
           </div>
        </div>
      </div>

      </>
      )}

    </div>
  );
}
