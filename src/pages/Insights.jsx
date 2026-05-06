import { useState, useMemo } from 'react';
import './Insights.css';
import { BookOpen } from 'lucide-react';
import { useUser } from '../context/UserContext';
import JournalDrawer from '../components/JournalDrawer';
import { useJournal } from '../hooks/useJournal';

const TAB_DATA = {
  'This Week': {
    days: ['M','T','W','Th','F','S','Su'],
    hydration: [40, 65, 55, 80, 70, 90, 75],
    macroPct: { protein: 0.72, carbs: 0.58, fats: 0.85 },
    locations: { Home: 60, Campus: 25, Restaurant: 15 },
    weeklyHealth: ['green-dark','green-light','yellow','yellow','red','red','green-dark'],
    moodOutcomes: [
      { id: 'happy',    emoji: '😄', label: 'Happy',    up: 3, steady: 1, down: 0 },
      { id: 'calm',     emoji: '😌', label: 'Calm',     up: 2, steady: 1, down: 0 },
      { id: 'tired',    emoji: '😴', label: 'Tired',    up: 1, steady: 2, down: 2 },
      { id: 'stressed', emoji: '😫', label: 'Stressed', up: 0, steady: 1, down: 3 },
    ],
  },
  'Last 7 Days': {
    days: ['1','2','3','4','5','6','7'],
    hydration: [55, 60, 70, 65, 75, 60, 80],
    macroPct: { protein: 0.84, carbs: 0.66, fats: 0.78 },
    locations: { Home: 50, Campus: 30, Restaurant: 20 },
    weeklyHealth: ['green-light','green-dark','green-light','yellow','green-light','green-dark','yellow'],
    moodOutcomes: [
      { id: 'happy',    emoji: '😄', label: 'Happy',    up: 4, steady: 1, down: 0 },
      { id: 'calm',     emoji: '😌', label: 'Calm',     up: 3, steady: 0, down: 0 },
      { id: 'tired',    emoji: '😴', label: 'Tired',    up: 2, steady: 1, down: 1 },
      { id: 'stressed', emoji: '😫', label: 'Stressed', up: 1, steady: 1, down: 1 },
    ],
  },
  'This Month': {
    days: ['W1','W2','W3','W4'],
    hydration: [60, 70, 65, 78],
    macroPct: { protein: 0.78, carbs: 0.62, fats: 0.71 },
    locations: { Home: 55, Campus: 28, Restaurant: 17 },
    weeklyHealth: ['green-light','yellow','green-dark','green-light','yellow','red','green-light'],
    moodOutcomes: [
      { id: 'happy',    emoji: '😄', label: 'Happy',    up: 12, steady: 4, down: 1 },
      { id: 'calm',     emoji: '😌', label: 'Calm',     up: 8,  steady: 3, down: 1 },
      { id: 'tired',    emoji: '😴', label: 'Tired',    up: 4,  steady: 5, down: 6 },
      { id: 'stressed', emoji: '😫', label: 'Stressed', up: 2,  steady: 4, down: 7 },
    ],
  },
};

const HYDRA_THRESHOLD = { good: 80, mid: 50 };
function hydraStatus(v) {
  if (v >= HYDRA_THRESHOLD.good) return 'good';
  if (v >= HYDRA_THRESHOLD.mid) return 'mid';
  return 'low';
}

function computeMoodInsight(outcomes) {
  const enriched = outcomes.map(o => {
    const total = o.up + o.steady + o.down;
    return { ...o, total, upPct: total ? o.up / total : 0, downPct: total ? o.down / total : 0 };
  }).filter(o => o.total > 0);
  if (enriched.length === 0) return null;
  const best = enriched.reduce((a, b) => a.upPct > b.upPct ? a : b);
  const worst = enriched.reduce((a, b) => a.downPct > b.downPct ? a : b);
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
  const tabs = Object.keys(TAB_DATA);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [journalOpen, setJournalOpen] = useState(false);
  const journal = useJournal(user.id);
  const data = TAB_DATA[activeTab];

  // Macros: actual consumption vs user targets, derived from this tab
  const macroRows = useMemo(() => {
    const t = user.targets;
    const items = [
      { key: 'protein', label: 'Protein', target: t.protein, color: '#3B82F6', unit: 'g' },
      { key: 'carbs',   label: 'Carbs',   target: t.carbs,   color: '#FBBF24', unit: 'g' },
      { key: 'fats',    label: 'Fats',    target: t.fats,    color: '#14B8A6', unit: 'g' },
    ];
    return items.map(it => {
      const pct = data.macroPct[it.key];
      const consumed = Math.round(it.target * pct);
      const pctRounded = Math.round(pct * 100);
      return { ...it, consumed, pct: pctRounded };
    });
  }, [data, user.targets]);

  const balanceScore = useMemo(() => {
    const avg = macroRows.reduce((sum, r) => sum + Math.min(r.pct, 100), 0) / macroRows.length;
    return Math.round(avg);
  }, [macroRows]);
  const scoreColor = balanceScore >= 80 ? '#4ADE80' : balanceScore >= 65 ? '#FBBF24' : '#F87171';

  // Hydration: per-day status, average, best/worst
  const hydra = useMemo(() => {
    const goalL = user.targets.hydrationL;
    const dailyL = data.hydration.map(p => Math.round((p / 100) * goalL * 10) / 10);
    const avgPct = Math.round(data.hydration.reduce((a, b) => a + b, 0) / data.hydration.length);
    const avgL = Math.round((avgPct / 100) * goalL * 10) / 10;
    const bestIdx = data.hydration.indexOf(Math.max(...data.hydration));
    const worstIdx = data.hydration.indexOf(Math.min(...data.hydration));
    return { goalL, dailyL, avgPct, avgL, bestIdx, worstIdx };
  }, [data, user.targets.hydrationL]);

  return (
    <div className="insights-container animate-fade-in">
      <header className="insights-head">
        <div>
          <h1 className="journal-title">Garden Journal</h1>
          <p className="journal-sub">Patterns for {user.name} · goal: {user.targets.calories} kcal / {user.targets.hydrationL} L</p>
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

      <div className="insights-grid mt-6">
        <div className="journal-card">
          <div className="nut-head">
            <div>
              <h3 className="card-heading">Nutrition balance</h3>
              <span className="card-sub">vs. your daily targets</span>
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
              : 'Below baseline. Plan one meal around your gap macro.'}
          </p>
        </div>

        <div className="journal-card">
          <div className="nut-head">
            <div>
              <h3 className="card-heading">Hydration trend</h3>
              <span className="card-sub">{hydra.avgL} L avg · {hydra.goalL} L goal</span>
            </div>
            <span className={`hydra-pct ${hydraStatus(hydra.avgPct)}`}>{hydra.avgPct}%</span>
          </div>

          <div className="hydra-chart">
            <span className="hydra-goal-tick" aria-hidden="true">100%</span>
            <div className="hydra-goal-line" aria-hidden="true" />
            <div className="hydra-bars">
              {data.days.map((day, i) => {
                const v = data.hydration[i];
                const status = hydraStatus(v);
                return (
                  <div
                    key={day}
                    className={`hydra-day ${i === hydra.bestIdx ? 'best' : ''} ${i === hydra.worstIdx ? 'worst' : ''}`}
                    title={`${day}: ${hydra.dailyL[i]} L (${v}% of goal)`}
                  >
                    <div className="hydra-bar-track">
                      <div
                        className={`hydra-bar-fill ${status}`}
                        style={{ height: `${Math.min(v, 100)}%` }}
                        role="img"
                        aria-label={`${day}: ${v}% of goal`}
                      />
                    </div>
                    <span className="hydra-day-label">{day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="hydra-meta">
            <span><span className="hydra-dot good" /> Best · {data.days[hydra.bestIdx]} {data.hydration[hydra.bestIdx]}%</span>
            <span><span className="hydra-dot low" /> Worst · {data.days[hydra.worstIdx]} {data.hydration[hydra.worstIdx]}%</span>
          </div>
        </div>

        <div className="journal-card mood-card-wide">
          <h3 className="card-heading">Mood × energy</h3>
          <ul className="mood-rows">
            {data.moodOutcomes.map(m => {
              const total = m.up + m.steady + m.down;
              const upPct = total ? (m.up / total) * 100 : 0;
              const steadyPct = total ? (m.steady / total) * 100 : 0;
              const downPct = total ? (m.down / total) * 100 : 0;
              return (
                <li key={m.id} className="mood-row">
                  <div className="mood-row-head">
                    <span className="mood-row-emoji" aria-hidden="true">{m.emoji}</span>
                    <span className="mood-row-label">{m.label}</span>
                    <span className="mood-row-count">{total}</span>
                  </div>
                  {total > 0 ? (
                    <div className="mood-stack" role="img" aria-label={`${m.up} energy up, ${m.steady} steady, ${m.down} down`}>
                      {upPct > 0 && <span className="mood-seg up" style={{ width: `${upPct}%` }} />}
                      {steadyPct > 0 && <span className="mood-seg steady" style={{ width: `${steadyPct}%` }} />}
                      {downPct > 0 && <span className="mood-seg down" style={{ width: `${downPct}%` }} />}
                    </div>
                  ) : (
                    <div className="mood-empty">No meals logged</div>
                  )}
                </li>
              );
            })}
          </ul>
          {(() => {
            const insight = computeMoodInsight(data.moodOutcomes);
            if (!insight) return null;
            return (
              <p className="mood-insight">
                Energy peaks on <strong>{insight.bestEmoji} {insight.bestLabel.toLowerCase()}</strong> meals ({insight.bestPct}% ↑) · slumps on <strong>{insight.worstEmoji} {insight.worstLabel.toLowerCase()}</strong> ({insight.worstPct}% ↓).
              </p>
            );
          })()}
        </div>
      </div>

      <h2 className="section-heading mt-8">Pattern discovery</h2>
      <div className="pattern-grid">
        <div className="glass-panel p-card">
          <h3 className="card-heading mb-4">Most frequent meals</h3>
          <ul className="meal-list">
            <li><span className="emoji-icon">🥗</span> Quinoa Salad (4×)</li>
            <li><span className="emoji-icon">☕</span> Coffee (6×)</li>
            <li><span className="emoji-icon">🍞</span> Avocado Toast (3×)</li>
          </ul>
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
        <h3 className="card-heading mb-3">Weekly garden health</h3>
        <div className="garden-health-row">
           <div className="gh-days">
             {data.weeklyHealth.map((status, i) => (
               <div className="gh-col" key={i}>
                 <span className="gh-lbl">{['M','T','W','Th','F','S','Su'][i]}</span>
                 <div className={`gh-box ${status}`}></div>
               </div>
             ))}
           </div>
           <div className="gh-legend text-xs">
              <div><span className="dot-sm green-dark"></span> healthy <span className="dot-sm yellow"></span> moderate <span className="dot-sm red"></span> poor</div>
              <div className="text-secondary">(low hydration, poor food choices)</div>
           </div>
        </div>
      </div>

    </div>
  );
}
