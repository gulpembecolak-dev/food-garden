import { useState } from 'react';
import './Insights.css';
import { Frown, Meh, Smile, BatteryCharging, BatteryLow, BatteryMedium } from 'lucide-react';

export default function Insights() {
  const tabs = ['This Week', 'Last 7 Days', 'This Month', 'Custom Range'];
  const [activeTab, setActiveTab] = useState('This Week');

  return (
    <div className="insights-container animate-fade-in">
      <h1 className="journal-title">Garden Journal</h1>
      
      <div className="tabs-scroll-container">
        <div className="tabs-wrapper">
          {tabs.map((t) => (
            <button 
              key={t} 
              className={`journal-tab ${activeTab === t ? 'active' : ''}`}
              onClick={() => setActiveTab(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Cards Row */}
      <div className="cards-horizontal-scroll mt-6">
        {/* Card 1: Nutrition Balance */}
        <div className="journal-card">
          <h3 className="card-heading">Nutrition Balance</h3>
          <div className="donut-chart-container">
            <div className="donut-wrapper">
              <div className="donut-hole">
                <span className="donut-score-label">Score:</span>
                <span className="donut-score-value">78%</span>
              </div>
              <div className="donut-labels">
                <span className="dl-top-left">Protein</span>
                <span className="dl-top-right">Carbs</span>
                <span className="dl-bottom-left">Fats</span>
                <span className="dl-bottom-right">Sugars</span>
              </div>
            </div>
          </div>
          <div className="card-footer-text">
            <strong>Balanced Diet Score: 78%</strong>
            <span>High in carbs, low in fiber.</span>
          </div>
        </div>

        {/* Card 2: Hydration Trend */}
        <div className="journal-card">
          <h3 className="card-heading">Hydration Trend</h3>
          <div className="trend-chart-area">
             <svg viewBox="0 0 100 50" className="hydration-svg">
                <defs>
                  <linearGradient id="hydraGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.5"/>
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <path d="M0,40 Q10,30 20,40 T40,20 T50,5 T60,25 T80,30 T100,20 L100,50 L0,50 Z" fill="url(#hydraGrad)"/>
                <path d="M0,40 Q10,30 20,40 T40,20 T50,5 T60,25 T80,30 T100,20" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round"/>
                <line x1="0" y1="30" x2="100" y2="30" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 2"/>
             </svg>
             <div className="days-row">
               <span>M</span><span>T</span><span>W</span><span>Th</span><span>F</span><span>S</span><span>Su</span>
             </div>
          </div>
          <div className="card-footer-text center-text">
            <strong>Avg. 1.8L/day</strong>
            <span>Goal: 2.5L/day</span>
          </div>
        </div>

        {/* Card 3: Mood Correlation */}
        <div className="journal-card">
          <h3 className="card-heading">Mood Correlation</h3>
          <div className="mood-table">
            <div className="mt-headers">
              <span>Mood</span><span>Meal</span><span>Energy</span>
            </div>
            <div className="mt-row">
              <Smile size={18} color="#94A3B8"/> <Smile size={18} color="#4ADE80"/> <div className="energy-circle up">↑</div>
            </div>
            <div className="mt-row">
              <Meh size={18} color="#94A3B8"/> <Smile size={18} color="#4ADE80"/> <div className="energy-circle down">↓</div>
            </div>
            <div className="mt-row">
              <Meh size={18} color="#94A3B8"/> <Meh size={18} color="#94A3B8"/> <Meh size={18} color="#FBBF24"/>
            </div>
            <div className="mt-row">
              <Frown size={18} color="#94A3B8"/> <Frown size={18} color="#94A3B8"/> <Frown size={18} color="#F87171"/>
            </div>
          </div>
          <div className="card-footer-text">
            <strong>Energy ↑ after lunch</strong>
            <span>Tiredness linked to late dinners</span>
          </div>
        </div>
      </div>

      {/* Pattern Discovery Section */}
      <h2 className="section-heading mt-8">Pattern Discovery</h2>
      <div className="pattern-grid">
        {/* Most Frequent Meals */}
        <div className="glass-panel p-card">
          <h3 className="card-heading mb-4">Most Frequent Meals</h3>
          <ul className="meal-list">
            <li><span className="emoji-icon">🥗</span> Quinoa Salad (4x)</li>
            <li><span className="emoji-icon">☕</span> Coffee (6x)</li>
            <li><span className="emoji-icon">🍞</span> Avocado Toast (3x)</li>
          </ul>
        </div>
        
        {/* Where Do You Eat? */}
        <div className="glass-panel p-card">
          <h3 className="card-heading mb-4">Where Do You Eat?</h3>
          <div className="bar-chart-rows">
            <div className="bar-row">
              <span className="bar-label">Home</span>
              <div className="bar-track"><div className="bar-fill" style={{ width: '60%', backgroundColor: '#86EFAC' }}></div></div>
              <span className="bar-pct">60%</span>
            </div>
            <div className="bar-row">
              <span className="bar-label">Campus</span>
              <div className="bar-track"><div className="bar-fill" style={{ width: '25%', backgroundColor: '#86EFAC' }}></div></div>
              <span className="bar-pct">25%</span>
            </div>
            <div className="bar-row">
              <span className="bar-label">Restaurant</span>
              <div className="bar-track"><div className="bar-fill" style={{ width: '15%', backgroundColor: '#86EFAC' }}></div></div>
              <span className="bar-pct">15%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mood & Meal Timing */}
      <div className="glass-panel p-card mt-4">
        <h3 className="card-heading mb-2">Mood & Meal Timing</h3>
        <div className="scatter-plot-area border-b">
          <div className="scatter-y-axis">
            <span>+</span><span>0</span><span>-</span>
            <div className="axis-label-y">Mood intensity</div>
          </div>
          <div className="scatter-graph">
             {/* Middle dotted line */}
             <div className="scatter-midline"></div>
             {/* Dots (simulating absolute positions) */}
             <div className="s-dot error" style={{ left: '10%', top: '70%' }}></div>
             <div className="s-dot error" style={{ left: '10%', top: '85%' }}></div>

             <div className="s-dot success" style={{ left: '30%', top: '30%' }}></div>
             <div className="s-dot success" style={{ left: '30%', top: '45%' }}></div>
             <div className="s-dot warning" style={{ left: '30%', top: '65%' }}></div>

             <div className="s-dot success" style={{ left: '50%', top: '40%' }}></div>
             <div className="s-dot warning" style={{ left: '50%', top: '60%' }}></div>
             <div className="s-dot warning" style={{ left: '50%', top: '80%' }}></div>

             <div className="s-dot error" style={{ left: '80%', top: '20%' }}></div>
             <div className="s-dot error" style={{ left: '80%', top: '35%' }}></div>
             <div className="s-dot neutral" style={{ left: '80%', top: '50%' }}></div>
             <div className="s-dot neutral" style={{ left: '80%', top: '70%' }}></div>
          </div>
          {/* Legend superimposed */}
          <div className="scatter-legend">
            <div className="sl-item"><div className="s-dot error relative"></div> Snacks when stressed</div>
            <div className="sl-item"><div className="s-dot success relative"></div> Snacks when stressed</div>
            <div className="sl-item"><div className="s-dot warning relative"></div> Snacks when stressed</div>
            <div className="sl-item"><div className="s-dot neutral relative"></div> Other type</div>
          </div>
        </div>
        <div className="time-label text-center mt-2">Time of day</div>
      </div>

      {/* Weekly Garden Health */}
      <div className="glass-panel p-card mt-4">
        <h3 className="card-heading mb-3">Weekly Garden Health</h3>
        <div className="garden-health-row">
           <div className="gh-days">
             <div className="gh-col"><span className="gh-lbl">Mon-</span><div className="gh-box green-dark"></div></div>
             <div className="gh-col"><span className="gh-lbl">Thu</span><div className="gh-box green-light"></div></div>
             <div className="gh-col"><span className="gh-lbl">Fri</span><div className="gh-box yellow"></div></div>
             <div className="gh-col"><span className="gh-lbl">Thu</span><div className="gh-box yellow"></div></div>
             <div className="gh-col"><span className="gh-lbl">Sat</span><div className="gh-box red"></div></div>
             <div className="gh-col"><span className="gh-lbl">Sun</span><div className="gh-box red"></div></div>
           </div>
           <div className="gh-legend text-xs">
              <div><span className="dot-sm green-dark"></span> healthy <span className="dot-sm yellow"></span> moderate <span className="dot-sm red"></span> poor</div>
              <div className="text-secondary">(low hydration, poor food choices)</div>
           </div>
        </div>
      </div>

      {/* Reflection Prompt Box */}
      <h2 className="section-heading mt-8">Reflection Prompt Box</h2>
      <div className="glass-panel p-card reflection-box mt-2">
        <h3 className="reflection-title">What did you learn this week?</h3>
        <p className="reflection-desc">Journal your thoughts or patterns you noticed.</p>
        <textarea 
          className="reflection-input" 
          placeholder="Type your reflection..."
        ></textarea>
        <button className="primary-btn outline-btn mt-4">Save to Journal</button>
      </div>

    </div>
  );
}
