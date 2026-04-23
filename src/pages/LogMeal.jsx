import { useState } from 'react';
import { ChevronRight, Image as ImageIcon, Edit2, Users, Sun, CloudRain, Utensils, Moon, Apple, Leaf, ArrowRight, Sprout, Smile, MapPin } from 'lucide-react';
import PortionSelector from '../components/PortionSelector';
import './LogMeal.css';
import { useNavigate } from 'react-router-dom';
import { TreePlant, MushroomPlant, WheatPlant, SucculentPlant } from '../components/Plants';

export default function LogMeal({ onAddMeal }) {
  const [step, setStep] = useState(1);
  const [portion, setPortion] = useState('M');
  const [portionVal, setPortionVal] = useState(2); // 1:S, 2:M, 3:L, 4:XL
  const [mealType, setMealType] = useState(null);
  const [macros, setMacros] = useState({ calories: 50, protein: 60, carbs: 40, fats: 30 });
  const [isScanned, setIsScanned] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [mood, setMood] = useState(null);
  const [social, setSocial] = useState(null);
  const [location, setLocation] = useState(null);
  
  const navigate = useNavigate();

  const handleNext = () => setStep(step + 1);

  const handleFinish = () => {
    if (onAddMeal) {
      onAddMeal({
        type: mealType,
        macros: macros,
        mood: mood,
        location: location,
        isNew: true
      });
    }
    navigate('/');
  };

  const moodMap = {
    happy: '😄',
    stressed: '😫',
    tired: '😴',
    excited: '🤩',
    calm: '😌',
    angry: '😤'
  };

  return (
    <div className="log-container animate-fade-in">
      <div className="log-top-bar">
        <div className="progress-bg">
          <div className="progress-fill" style={{width: `${step * 25}%`}}></div>
        </div>
        <span className="progress-text">{step * 25}%</span>
      </div>

      {step === 1 && (
        <div className="step-content no-padding-top animate-fade-in">
          <h1 className="step-main-title mt-4">Step 1 of 4: Choose Your Seed</h1>
          
          <div className="meal-section mt-8">
            <h3 className="meal-section-title">Meal Type Selector</h3>
            <div className="meal-types-row">
              <button className={`meal-btn ${mealType === 'breakfast' ? 'active' : ''}`} onClick={() => setMealType('breakfast')}>
                <Sun size={28} />
                <span>Breakfast</span>
              </button>
              <button className={`meal-btn ${mealType === 'lunch' ? 'active' : ''}`} onClick={() => setMealType('lunch')}>
                <Utensils size={28} />
                <span>Lunch</span>
              </button>
              <button className={`meal-btn ${mealType === 'dinner' ? 'active' : ''}`} onClick={() => setMealType('dinner')}>
                <Moon size={28} />
                <span>Dinner</span>
              </button>
              <button className={`meal-btn ${mealType === 'snack' ? 'active' : ''}`} onClick={() => setMealType('snack')}>
                <Apple size={28} />
                <span>Snack</span>
              </button>
            </div>
          </div>

          <div className="meal-section mt-12">
            <h3 className="meal-section-title">Portion Slider</h3>
            <div className="portion-slider-card">
               <div className="ps-header">
                  <div className="ps-icon"><Leaf size={16}/><span>Seed</span></div>
                  <ArrowRight size={14} className="ps-arrow"/>
                  <div className="ps-icon"><Sprout size={24}/><span>Sapling</span></div>
               </div>
               
               <input 
                 type="range" min="1" max="4" value={portionVal} 
                 onChange={e => {
                   const val = Number(e.target.value);
                   setPortionVal(val);
                   setPortion(['S','M','L','XL'][val - 1]);
                 }} 
                 style={{
                   '--thumb-size': `${16 + (portionVal - 1) * 6}px`,
                   '--fill-pct': `${((portionVal - 1) / 3) * 100}%`
                 }}
                 className="ps-range mt-4" 
               />
               
               <div className="ps-marks">
                 <span>S</span><span style={{paddingRight:'8px'}}>M</span><span>L</span><span>XL</span>
               </div>
               <div className="ps-label text-center mt-2">Portion Size</div>
            </div>
          </div>

          <button 
            className="primary-btn mt-12" 
            onClick={handleNext}
            disabled={!mealType}
          >
            <span>Next</span>
            <ChevronRight size={20} className="arrow-icon" />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="step-content no-padding-top animate-fade-in">
          <h1 className="step-main-title mt-4">Step 2 of 4: Nutrient Profile</h1>
          
          {!isScanned ? (
            <div className="scan-prompt-area mt-8 animate-fade-in">
               <div className="scan-icon-circle">
                  <ImageIcon size={48} color="#94A3B8" />
               </div>
               <h3 className="mt-6 text-white text-xl font-semibold">Scan with AI</h3>
               <p className="text-gray-400 mt-4 text-center text-sm leading-relaxed">
                 Take a photo of your plate. Let our AI analyze the ingredients and calculate the macros for your garden.
               </p>
               
               <button 
                 className="primary-btn mt-8" 
                 onClick={() => {
                    setIsScanning(true);
                    setTimeout(() => {
                      setIsScanning(false);
                      setIsScanned(true);
                    }, 1500);
                 }}
                 disabled={isScanning}
               >
                 {isScanning ? (
                   <span>Scanning...</span>
                 ) : (
                   <>
                      <ImageIcon size={20} className="arrow-icon"/>
                      <span>Snap Photo</span>
                   </>
                 )}
               </button>
            </div>
          ) : (
            <div className="ai-card mt-6 animate-fade-in">
               <div className="ai-header-flex">
                  <div className="ai-food-img">
                     <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=150" alt="food" />
                  </div>
                  <div className="ai-info-flex">
                     <div className="ai-row-top">
                       <span className="ai-label">AI Analysis:</span>
                       <span className="ai-badge">High Confidence</span>
                     </div>
                     <div className="ai-dish-name">Healthy Salmon Bowl</div>
                  </div>
               </div>
               
               <div className="ai-divider"></div>
               
               <div className="macro-breakdown">
                  <span className="mb-title">Macro Breakdown</span>
                  <div className="v-sliders-wrap mt-6">
                     {[ 
                       { label: 'Calories', valKey: 'calories' },
                       { label: 'Protein', valKey: 'protein' },
                       { label: 'Carbs', valKey: 'carbs' },
                       { label: 'Fats', valKey: 'fats' }
                     ].map((item, i) => (
                       <div key={i} className="v-slider-col">
                          <div className="v-label-group">
                             <span className="v-slider-label">{item.label}</span>
                             <span className="v-slider-val">
                               {item.valKey === 'calories' ? `${macros.calories * 10} kcal` : `${macros[item.valKey]}g`}
                             </span>
                          </div>
                          <div className="v-track-box">
                             <div className="v-fill" style={{height: `${macros[item.valKey]}%`}}></div>
                          </div>
                          {isEditing ? (
                            <div className="v-controls animate-fade-in">
                              <button className="v-btn" onClick={() => setMacros({...macros, [item.valKey]: Math.min(100, macros[item.valKey] + 10)})}>+</button>
                              <button className="v-btn" onClick={() => setMacros({...macros, [item.valKey]: Math.max(0, macros[item.valKey] - 10)})}>-</button>
                            </div>
                          ) : (
                            <div className="v-controls-placeholder" style={{height: '26px'}}></div>
                          )}
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          )}

          {isScanned && (
            <div className="animate-fade-in">
              <button className="primary-btn mt-12" onClick={handleNext}>
                <span>Looks Good</span>
                <ChevronRight size={20} className="arrow-icon" />
              </button>
              
              {!isEditing && (
                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                  <button 
                    onClick={() => setIsEditing(true)} 
                    style={{ background:'none', border:'none', color: '#94A3B8', fontSize: '14px', textDecoration: 'underline', cursor: 'pointer' }}>
                    Edit Manually
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="step-content no-padding-top animate-fade-in">
          <h1 className="step-main-title mt-4">Step 3 of 4: Garden Atmosphere</h1>
          
          <div className="meal-section mt-8">
             <h3 className="meal-section-title">Mood Grid</h3>
             <div className="mood-grid">
                {[
                  { id: 'happy', emoji: '😄', sub: '☀️' },
                  { id: 'stressed', emoji: '😫', sub: '☁️' },
                  { id: 'tired', emoji: '😴', sub: '💤' },
                  { id: 'excited', emoji: '🤩', sub: '✨' },
                  { id: 'calm', emoji: '😌', sub: '🌱' },
                  { id: 'angry', emoji: '😤', sub: '⚡' }
                ].map(m => (
                  <div key={m.id} className={`mood-card ${mood === m.id ? 'active' : ''}`} onClick={() => setMood(m.id)}>
                     <span className="mood-sub-icon">{m.sub}</span>
                     <span className="mood-emoji">{m.emoji}</span>
                  </div>
                ))}
             </div>
          </div>
          
          <div className="meal-section mt-10">
             <h3 className="meal-section-title">Location Chips</h3>
             <div className="chips-row">
                {['Home', 'Work', 'Restaurant', 'On-the-go'].map(loc => (
                  <button 
                    key={loc} 
                    className={`location-chip ${location === loc ? 'active' : ''}`}
                    onClick={() => setLocation(loc)}
                  >{loc}</button>
                ))}
             </div>
          </div>
          
          <div className="meal-section mt-10">
             <h3 className="meal-section-title">Social Context</h3>
             <div className="segment-ctrl">
                <button className={`segment-btn ${social === 'alone' ? 'active' : ''}`} onClick={() => setSocial('alone')}>Eating Alone</button>
                <button className={`segment-btn ${social === 'others' ? 'active' : ''}`} onClick={() => setSocial('others')}>With Others</button>
             </div>
          </div>

          <button 
             className="primary-btn mt-12" 
             onClick={handleNext}
             disabled={!mood || !location || !social}
          >
            <span>Next</span>
            <ChevronRight size={20} className="arrow-icon" />
          </button>
        </div>
      )}

      {step === 4 && (
        <div className="step-content no-padding-top animate-fade-in">
          <h1 className="step-main-title mt-4">Step 4 of 4: Ready to Plant?</h1>
          
          <div className="summary-card mt-8">
             <div className="sum-content">
                <h3 className="sum-title">Summary Card</h3>
                <ul className="sum-list">
                  <li><Utensils size={16} className="sum-icon"/> <span className="capitalize">{mealType || 'Meal'}</span> | {macros.calories * 10} kcal</li>
                  <li>
                    <span style={{ fontSize: '16px', lineHeight: 1, marginRight: '4px' }}>{moodMap[mood] || '😐'}</span> 
                    <span className="capitalize">{mood || 'Neutral'}</span> Mood
                  </li>
                  <li><MapPin size={16} className="sum-icon"/> <span className="capitalize">{location || 'Unknown'}</span></li>
                </ul>
             </div>
             <div className="sum-img">
                <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=150" alt="meal summary" />
             </div>
          </div>
          
          <div className="preview-card mt-6">
             <h3 className="sum-title">Visual Preview</h3>
             <span className="sum-subtitle">Based on your macros, this plant will grow</span>
             <div className="plant-preview-area mt-4" style={{ transform: 'scale(1.4)' }}>
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

          <button className="primary-btn mt-12" onClick={handleFinish}>
            <span>Plant in My Garden</span>
          </button>
        </div>
      )}
    </div>
  );
}
