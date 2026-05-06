import { useState } from 'react';
import { ChevronRight, ChevronLeft, X, Image as ImageIcon, Sun, Utensils, Moon, Apple, Leaf, ArrowRight, Sprout, MapPin, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Button from '../components/ui/Button';
import Chip from '../components/ui/Chip';
import { TreePlant, MushroomPlant, WheatPlant, SucculentPlant } from '../components/Plants';
import './LogMeal.css';

const STEPS = [
  { n: 1, title: 'Choose your seed', desc: 'Pick a meal type and portion size.' },
  { n: 2, title: 'Nutrient profile', desc: 'Scan your plate or set macros manually.' },
  { n: 3, title: 'Garden atmosphere', desc: 'Add mood, location and social context.' },
  { n: 4, title: 'Ready to plant', desc: 'Review and plant in your garden.' },
];

const MEAL_TYPES = [
  { id: 'breakfast', label: 'Breakfast', Icon: Sun },
  { id: 'lunch', label: 'Lunch', Icon: Utensils },
  { id: 'dinner', label: 'Dinner', Icon: Moon },
  { id: 'snack', label: 'Snack', Icon: Apple },
];

const MOODS = [
  { id: 'happy', emoji: '😄', label: 'Happy' },
  { id: 'stressed', emoji: '😫', label: 'Stressed' },
  { id: 'tired', emoji: '😴', label: 'Tired' },
  { id: 'excited', emoji: '🤩', label: 'Excited' },
  { id: 'calm', emoji: '😌', label: 'Calm' },
  { id: 'angry', emoji: '😤', label: 'Frustrated' },
];

const LOCATIONS = ['Home', 'Work', 'Restaurant', 'On-the-go'];

const MACRO_FIELDS = [
  { key: 'calories', label: 'Calories', unit: 'kcal', max: 1200, step: 10, color: '#FBBF24' },
  { key: 'protein', label: 'Protein', unit: 'g', max: 80, step: 1, color: '#3B82F6' },
  { key: 'carbs', label: 'Carbs', unit: 'g', max: 120, step: 1, color: '#F59E0B' },
  { key: 'fats', label: 'Fats', unit: 'g', max: 50, step: 1, color: '#14B8A6' },
];

export default function LogMeal({ onAddMeal }) {
  const navigate = useNavigate();
  const { user } = useUser();

  const [step, setStep] = useState(1);
  const [portionVal, setPortionVal] = useState(2);
  const [mealType, setMealType] = useState(null);
  const [macros, setMacros] = useState({ calories: 480, protein: 32, carbs: 58, fats: 18 });
  const [isScanned, setIsScanned] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [mood, setMood] = useState(null);
  const [social, setSocial] = useState(null);
  const [location, setLocation] = useState(null);

  const current = STEPS[step - 1];

  const handleBack = () => {
    if (step === 1) navigate('/');
    else setStep(step - 1);
  };

  const handleFinish = () => {
    if (onAddMeal) {
      onAddMeal({
        type: mealType,
        macros: {
          calories: macros.calories / 10,
          protein: macros.protein,
          carbs: macros.carbs,
          fats: macros.fats,
        },
        mood,
        location,
        isNew: true,
      });
    }
    navigate('/');
  };

  const step1Valid = !!mealType;
  const step2Valid = isScanned;
  const step3Valid = !!mood && !!location && !!social;

  const stepValid = step === 1 ? step1Valid : step === 2 ? step2Valid : step === 3 ? step3Valid : true;
  const stepHint =
    step === 1 ? (mealType ? null : 'Choose a meal type to continue') :
    step === 2 ? (isScanned ? null : 'Scan your meal first') :
    step === 3 ? (
      !mood ? 'Pick how you feel' :
      !location ? 'Where did you eat?' :
      !social ? 'Were you alone or with others?' :
      null
    ) : null;

  const portionLabels = ['S', 'M', 'L', 'XL'];

  return (
    <div className="log-container animate-fade-in">
      <header className="log-head">
        <button className="log-icon-btn" onClick={handleBack} aria-label={step === 1 ? 'Back to home' : 'Previous step'}>
          <ChevronLeft size={20} />
        </button>
        <div className="log-stepper" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={STEPS.length}>
          {STEPS.map((s) => (
            <span
              key={s.n}
              className={`log-stepper__dot ${s.n < step ? 'done' : ''} ${s.n === step ? 'active' : ''}`}
              style={s.n <= step ? { background: user.accent } : undefined}
            />
          ))}
        </div>
        <button className="log-icon-btn" onClick={() => navigate('/')} aria-label="Close">
          <X size={20} />
        </button>
      </header>

      <div className="log-step-head">
        <span className="log-step-tag">Step {step} of {STEPS.length}</span>
        <h1 className="log-step-title">{current.title}</h1>
        <p className="log-step-desc">{current.desc}</p>
      </div>

      {step === 1 && (
        <div className="step-content animate-fade-in">
          <section className="meal-section">
            <h3 className="meal-section-title">Meal type</h3>
            <div className="meal-types-row">
              {MEAL_TYPES.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  className={`meal-btn ${mealType === id ? 'active' : ''}`}
                  onClick={() => setMealType(id)}
                  aria-pressed={mealType === id}
                  style={mealType === id ? { borderColor: user.accent, color: user.accent } : undefined}
                >
                  <Icon size={26} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="meal-section">
            <h3 className="meal-section-title">Portion size</h3>
            <div className="portion-slider-card">
               <div className="ps-header">
                  <div className="ps-icon"><Leaf size={16}/><span>Seed</span></div>
                  <ArrowRight size={14} className="ps-arrow"/>
                  <div className="ps-icon"><Sprout size={24}/><span>Sapling</span></div>
               </div>

               <input
                 type="range" min="1" max="4" value={portionVal}
                 onChange={e => setPortionVal(Number(e.target.value))}
                 aria-label="Portion size"
                 style={{
                   '--thumb-size': `${16 + (portionVal - 1) * 4}px`,
                   '--fill-pct': `${((portionVal - 1) / 3) * 100}%`,
                 }}
                 className="ps-range"
               />

               <div className="ps-marks">
                 {portionLabels.map((l, i) => (
                   <span key={l} className={portionVal === i + 1 ? 'active' : ''}>{l}</span>
                 ))}
               </div>
            </div>
          </section>
        </div>
      )}

      {step === 2 && (
        <div className="step-content animate-fade-in">
          {!isScanned ? (
            <div className="scan-prompt-area animate-fade-in">
               <div className="scan-icon-circle">
                  <ImageIcon size={44} color="var(--text-secondary)" />
               </div>
               <h3 className="scan-title">Scan with AI</h3>
               <p className="scan-desc">
                 Take a photo of your plate. The app analyzes ingredients and estimates macros automatically.
               </p>

               <Button
                 variant="primary"
                 size="lg"
                 iconLeft={<Sparkles size={18} />}
                 onClick={() => {
                    setIsScanning(true);
                    setTimeout(() => {
                      setIsScanning(false);
                      setIsScanned(true);
                    }, 1500);
                 }}
                 disabled={isScanning}
               >
                 {isScanning ? 'Scanning…' : 'Snap photo'}
               </Button>

               <button className="link-btn" onClick={() => { setIsScanned(true); setIsEditing(true); }}>
                 Skip and enter manually
               </button>
            </div>
          ) : (
            <div className="ai-card animate-fade-in">
               <div className="ai-header-flex">
                  <div className="ai-food-img">
                     <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=150" alt="meal" />
                  </div>
                  <div className="ai-info-flex">
                     <div className="ai-row-top">
                       <span className="ai-label">AI analysis</span>
                       <span className="ai-badge">High confidence</span>
                     </div>
                     <div className="ai-dish-name">Healthy salmon bowl</div>
                  </div>
               </div>

               <div className="ai-divider"></div>

               <div className="macro-breakdown">
                  <div className="macro-head">
                    <span className="mb-title">Macro breakdown</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(v => !v)}
                    >
                      {isEditing ? 'Done' : 'Edit'}
                    </Button>
                  </div>

                  <div className="macro-list">
                    {MACRO_FIELDS.map(field => {
                      const val = macros[field.key];
                      const pct = Math.round((val / field.max) * 100);
                      return (
                        <div key={field.key} className="macro-row">
                          <div className="macro-row-head">
                            <span className="macro-label">{field.label}</span>
                            <span className="macro-val">{val} {field.unit}</span>
                          </div>
                          {isEditing ? (
                            <input
                              type="range"
                              min="0"
                              max={field.max}
                              step={field.step}
                              value={val}
                              onChange={e => setMacros({ ...macros, [field.key]: Number(e.target.value) })}
                              aria-label={field.label}
                              className="macro-range"
                              style={{
                                '--macro-color': field.color,
                                '--macro-fill': `${pct}%`,
                              }}
                            />
                          ) : (
                            <div className="macro-bar">
                              <div className="macro-bar-fill" style={{ width: `${pct}%`, background: field.color }} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
               </div>
            </div>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="step-content animate-fade-in">
          <section className="meal-section">
             <h3 className="meal-section-title">How do you feel?</h3>
             <div className="mood-grid">
                {MOODS.map(m => (
                  <button
                    key={m.id}
                    className={`mood-card ${mood === m.id ? 'active' : ''}`}
                    onClick={() => setMood(m.id)}
                    aria-pressed={mood === m.id}
                    style={mood === m.id ? { borderColor: user.accent, boxShadow: `0 4px 20px ${user.accent}30` } : undefined}
                  >
                     <span className="mood-emoji">{m.emoji}</span>
                     <span className="mood-label">{m.label}</span>
                  </button>
                ))}
             </div>
          </section>

          <section className="meal-section">
             <h3 className="meal-section-title">Where are you?</h3>
             <div className="chips-row">
                {LOCATIONS.map(loc => (
                  <Chip
                    key={loc}
                    active={location === loc}
                    onClick={() => setLocation(loc)}
                    accent={user.accent}
                  >{loc}</Chip>
                ))}
             </div>
          </section>

          <section className="meal-section">
             <h3 className="meal-section-title">Eating with…</h3>
             <div className="segment-ctrl">
                <button
                  className={`segment-btn ${social === 'alone' ? 'active' : ''}`}
                  onClick={() => setSocial('alone')}
                  aria-pressed={social === 'alone'}
                  style={social === 'alone' ? { color: user.accent } : undefined}
                >Alone</button>
                <button
                  className={`segment-btn ${social === 'others' ? 'active' : ''}`}
                  onClick={() => setSocial('others')}
                  aria-pressed={social === 'others'}
                  style={social === 'others' ? { color: user.accent } : undefined}
                >With others</button>
             </div>
          </section>
        </div>
      )}

      {step === 4 && (
        <div className="step-content animate-fade-in">
          <div className="summary-card">
             <div className="sum-content">
                <h3 className="sum-title">Summary</h3>
                <ul className="sum-list">
                  <li><Utensils size={16} className="sum-icon"/> <span className="capitalize">{mealType || 'Meal'}</span> · {macros.calories} kcal</li>
                  <li>
                    <span style={{ fontSize: '16px', lineHeight: 1 }}>{MOODS.find(m => m.id === mood)?.emoji || '😐'}</span>
                    <span className="capitalize">{mood || 'Neutral'}</span> · {social === 'alone' ? 'alone' : 'with others'}
                  </li>
                  <li><MapPin size={16} className="sum-icon"/> <span className="capitalize">{location || 'Unknown'}</span></li>
                </ul>
             </div>
             <div className="sum-img">
                <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=150" alt="meal summary" />
             </div>
          </div>

          <div className="preview-card">
             <h3 className="sum-title">Visual preview</h3>
             <span className="sum-subtitle">Your macros will grow into this plant.</span>
             <div className="plant-preview-area" style={{ transform: 'scale(1.4)' }}>
                {(() => {
                  let pType = 'protein';
                  if (macros.carbs > macros.protein && macros.carbs > macros.fats) pType = 'carbs';
                  else if (macros.fats > macros.protein && macros.fats > macros.carbs) pType = 'fats';
                  else if (mealType === 'snack') pType = 'sugars';

                  if (pType === 'protein') return <TreePlant isNew={false} />;
                  if (pType === 'carbs') return <WheatPlant isNew={false} />;
                  if (pType === 'sugars') return <MushroomPlant isNew={false} />;
                  if (pType === 'fats') return <SucculentPlant isNew={false} />;
                })()}
             </div>
          </div>
        </div>
      )}

      <footer className="log-footer">
        {stepHint && <p className="log-hint">{stepHint}</p>}
        <div className="log-footer-actions">
          {step > 1 && (
            <Button variant="secondary" size="lg" onClick={handleBack} iconLeft={<ChevronLeft size={18} />}>
              Back
            </Button>
          )}
          {step < 4 ? (
            <Button
              variant="primary"
              size="lg"
              onClick={() => setStep(step + 1)}
              disabled={!stepValid}
              iconRight={<ChevronRight size={18} />}
              className="log-next-btn"
            >
              Next
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              onClick={handleFinish}
              iconLeft={<Sprout size={18} />}
              className="log-next-btn"
            >
              Plant in my garden
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}
