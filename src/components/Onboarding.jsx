import { useState, useEffect } from 'react';
import { Sprout, BookOpen, ChevronLeft, ChevronRight, X, Flame, Activity, Droplet, Target, HeartPulse, Plus, Minus } from 'lucide-react';
import Button from './ui/Button';
import { useUser } from '../context/UserContext';
import { calcTargets, emptyProfile, AVATARS } from '../context/userData';
import './Onboarding.css';

/*
 * Entry flow:
 *   0. welcome — poster-style landing: wordmark logo, sparse cut-paper
 *      veggies, "Log in" / "Sign up"
 *   1. signup  — create an account (name, email, password)
 *   2. about   — personal data: age, gender, weight, height
 *   3. goal    — activity level + health goal → live target preview
 * Finishing step 3 creates the profile and enters the app. The tour is NOT
 * part of registration: it opens as the first screen inside the app
 * (rendered by <App> with introOnly), and can be re-opened from Profile.
 * "Log in" is honest about the prototype: accounts live on this device, so
 * with no stored profile it points the user to sign-up.
 */

const SLIDES = [
  {
    id: 'welcome',
    art: '/veggies/radish.png',
    eyebrow: 'Welcome',
    title: 'Your meals grow a garden',
    body: 'Food Garden turns daily nutrition into a living visualization. Log a meal — a plant sprouts. Eat in balance — the garden thrives.',
  },
  {
    id: 'targets',
    art: '/veggies/cucumber.png',
    eyebrow: 'Built around you',
    title: 'Targets from your own data',
    body: 'Your daily calories, protein, carbs, fats and hydration are calculated from the age, weight, height, activity level and goal in your profile — and recompute whenever you update it.',
  },
  {
    id: 'log',
    art: '/veggies/peas.png',
    eyebrow: 'Logging',
    title: 'Log meals in four steps',
    body: 'Pick a meal type, set the portion, scan with AI or enter macros, then add mood, energy and place. Each meal becomes a plant in your garden.',
  },
  {
    id: 'insights',
    art: '/veggies/leaf.png',
    eyebrow: 'Insights',
    title: 'Patterns surface over time',
    body: 'Hydration trends, balance scores and mood × energy correlations are computed from what you log. A private journal sits beside the charts for your own reflections.',
    extra: <span className="ob-extra"><BookOpen size={14} /> Everything is stored only on your device.</span>,
  },
];

const PHASE_STEPS = [
  { id: 'signup', label: 'Account' },
  { id: 'about', label: 'About you' },
  { id: 'goal', label: 'Your goal' },
];

const NUM_LIMITS = { age: [12, 100], weight: [30, 250], height: [120, 230] };
const inRange = (v, [min, max]) => Number(v) >= min && Number(v) <= max;
const emailValid = (v) => /^\S+@\S+\.\S+$/.test(v.trim());

export default function Onboarding({ onComplete, introOnly = false, firstRun = false }) {
  const { createProfile, login } = useUser();
  const [phase, setPhase] = useState(introOnly ? 'intro' : 'welcome');
  const [slide, setSlide] = useState(0);
  const [closing, setClosing] = useState(false);
  const [touched, setTouched] = useState(false);
  const [loginNotice, setLoginNotice] = useState(false);
  const [form, setForm] = useState({ ...emptyProfile, name: '', email: '', password: '' });

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const bump = (key, delta) => {
    const [min, max] = NUM_LIMITS[key];
    setForm(f => {
      const next = Math.min(max, Math.max(min, (Number(f[key]) || min) + delta));
      return { ...f, [key]: next };
    });
  };

  // `fresh` tells <App> whether this was a brand-new registration (→ tour)
  // or a returning log-in / closed tour (→ no tour).
  const close = (fresh = false) => {
    setClosing(true);
    setTimeout(() => onComplete?.(fresh), 250);
  };

  // End of step 3: create the profile → the app renders behind, the tour
  // opens on top of it (handled by <App>).
  const finishSetup = () => {
    // The password is deliberately NOT persisted — this prototype has no
    // server, so it is only used to make the sign-up interaction real.
    const profile = { ...form };
    delete profile.password;
    if (createProfile(profile)) close(true);
  };

  const signupValid = !!form.name.trim() && emailValid(form.email) && form.password.length >= 6;
  const aboutValid = inRange(form.age, NUM_LIMITS.age) && inRange(form.weight, NUM_LIMITS.weight) && inRange(form.height, NUM_LIMITS.height);
  const preview = aboutValid
    ? calcTargets({ ...form, age: Number(form.age), weight: Number(form.weight), height: Number(form.height) })
    : null;

  const goNext = () => {
    setTouched(false);
    if (phase === 'login') {
      const res = login(form.email);
      if (res === 'ok') close(false);
      else setLoginNotice(res);
    }
    else if (phase === 'signup') setPhase('about');
    else if (phase === 'about') setPhase('goal');
    else if (phase === 'goal') finishSetup();
    else if (slide < SLIDES.length - 1) setSlide(s => s + 1);
    else close();
  };

  const goBack = () => {
    setTouched(false);
    setLoginNotice(false);
    if (phase === 'intro') { if (slide > 0) setSlide(s => s - 1); }
    else if (phase === 'goal') setPhase('about');
    else if (phase === 'about') setPhase('signup');
    else if (phase === 'signup' || phase === 'login') setPhase('welcome');
  };

  const loginValid = emailValid(form.email) && form.password.length >= 6;
  const phaseValid =
    phase === 'signup' ? signupValid :
    phase === 'about' ? aboutValid :
    phase === 'login' ? loginValid :
    true;

  const tryNext = () => {
    if (phaseValid) goNext();
    else setTouched(true);
  };

  const phaseHint = !touched ? null :
    phase === 'signup' ? (
      !form.name.trim() ? 'Enter your name' :
      !emailValid(form.email) ? 'Enter a valid email address' :
      form.password.length < 6 ? 'Password needs at least 6 characters' : null
    ) :
    phase === 'about' ? 'Fill in your age, weight and height to continue' :
    phase === 'login' ? (
      !emailValid(form.email) ? 'Enter a valid email address' :
      form.password.length < 6 ? 'Password needs at least 6 characters' : null
    ) :
    null;

  useEffect(() => {
    const onKey = (e) => {
      if (phase !== 'intro') return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') goNext();
      else if (e.key === 'ArrowLeft') goBack();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, slide]);

  const currentSlide = SLIDES[slide];
  const phaseIdx = PHASE_STEPS.findIndex(p => p.id === phase);
  const canGoBack = introOnly ? slide > 0 : phase !== 'welcome';
  const isLastSlide = phase === 'intro' && slide === SLIDES.length - 1;

  const nextLabel =
    phase === 'login' ? 'Log in' :
    phase === 'signup' ? 'Create account' :
    phase === 'about' ? 'Continue' :
    phase === 'goal' ? 'Start my garden' :
    isLastSlide ? (firstRun ? "Let's grow" : 'Done') : 'Next';

  return (
    <div className={`onboarding ${closing ? 'closing' : ''}`} role="dialog" aria-label={introOnly ? 'App tour' : 'Account setup'}>
      {phase === 'login' && <div className="ob-bg-poster" aria-hidden="true" />}
      {/* Registration stepper — only during the three sign-up steps */}
      {!introOnly && phaseIdx >= 0 && (
        <ol className="ob-phases" aria-label="Setup progress">
          {PHASE_STEPS.map((p, i) => (
            <li
              key={p.id}
              className={`ob-phase ${i === phaseIdx ? 'active' : ''} ${i < phaseIdx ? 'done' : ''}`}
              aria-current={i === phaseIdx ? 'step' : undefined}
            >
              <span className="ob-phase-dot">{i < phaseIdx ? '✓' : i + 1}</span>
              <span className="ob-phase-label">{p.label}</span>
            </li>
          ))}
        </ol>
      )}

      {phase === 'intro' && (
        <button className="ob-skip" onClick={close} aria-label={firstRun ? 'Skip tour' : 'Close tour'}>
          {firstRun ? 'Skip tour' : 'Close'} <X size={16} />
        </button>
      )}

      <div className="ob-stage">
        {phase === 'welcome' && (
          <article className="ob-slide ob-welcome" key="welcome">
            {/* sparse cut-paper veggies around the edges */}
            <img className="ob-veg" src="/veggies/carrot.png" alt="" style={{ width: 54, top: '4%', left: '6%', transform: 'rotate(-12deg)' }} />
            <img className="ob-veg" src="/veggies/tomato.png" alt="" style={{ width: 62, top: '7%', right: '7%', transform: 'rotate(9deg)' }} />
            <img className="ob-veg" src="/veggies/leaf.png" alt="" style={{ width: 66, top: '43%', right: '3%', transform: 'rotate(-10deg)' }} />
            <img className="ob-veg" src="/veggies/peas.png" alt="" style={{ width: 58, bottom: '15%', left: '5%', transform: 'rotate(7deg)' }} />
            <img className="ob-veg" src="/veggies/cucumber.png" alt="" style={{ width: 56, bottom: '8%', right: '9%', transform: 'rotate(-6deg)' }} />

            <img className="ob-wordmark" src="/brand-wordmark.png" alt="Food Garden" />
            <p className="ob-body">Log your meals, grow your garden.</p>

            <div className="ob-welcome-actions">
              <Button variant="primary" size="lg" onClick={() => setPhase('signup')}>
                Sign up
              </Button>
              <Button variant="outline" size="lg" onClick={() => setPhase('login')}>
                Log in
              </Button>
            </div>
          </article>
        )}

        {phase === 'login' && (
          <article className="ob-slide ob-slide--form" key="login">
            <span className="ob-eyebrow">Welcome back</span>
            <h1 className="ob-title">Log in</h1>
            <p className="ob-body">Your account lives on this device.</p>

            <div className="ob-form ob-form--column">
              <label className="ob-field">
                <span>Email</span>
                <input type="email" inputMode="email" value={form.email} onChange={set('email')} placeholder="you@example.com" autoFocus autoComplete="email" />
              </label>
              <label className="ob-field">
                <span>Password</span>
                <input type="password" value={form.password} onChange={set('password')} placeholder="Your password" autoComplete="current-password" />
              </label>
            </div>

            {loginNotice === 'none' && (
              <div className="ob-login-notice" role="status">
                <p>No account on this device yet — plant your first garden by signing up.</p>
                <Button variant="secondary" size="sm" onClick={() => { setLoginNotice(false); setPhase('signup'); }}>
                  Create an account instead
                </Button>
              </div>
            )}
            {loginNotice === 'mismatch' && (
              <div className="ob-login-notice" role="status">
                <p>That email doesn't match the account on this device.</p>
              </div>
            )}
          </article>
        )}

        {phase === 'signup' && (
          <article className="ob-slide ob-slide--form" key="signup">
            <img className="ob-signup-art" src="/signup-art.png" alt="" aria-hidden="true" />
            <h1 className="ob-title">Create your account</h1>
            <p className="ob-body">One account per device. Sign up first — your personal details are asked afterwards, in private.</p>

            <div className="ob-form ob-form--column">
              <label className="ob-field">
                <span>Name</span>
                <input type="text" value={form.name} onChange={set('name')} placeholder="Your name" autoFocus autoComplete="name" />
              </label>
              <label className="ob-field">
                <span>Email</span>
                <input type="email" inputMode="email" value={form.email} onChange={set('email')} placeholder="you@example.com" autoComplete="email" />
              </label>
              <label className="ob-field">
                <span>Password</span>
                <input type="password" value={form.password} onChange={set('password')} placeholder="At least 6 characters" autoComplete="new-password" />
              </label>
            </div>

          </article>
        )}

        {phase === 'about' && (
          <article className="ob-slide ob-slide--form" key="about">
            <div className="ob-icon ob-icon--avatar" style={{ '--ob-accent': 'var(--primary-color)' }}>
              <img src={`/veggies/${form.avatar}.png`} alt="" />
            </div>
            <h1 className="ob-title">About you</h1>
            <p className="ob-body">Your daily targets are calculated from these values — adjust them to match you.</p>

            <div className="ob-stepper-list">
              <div className="ob-field">
                <span id="ob-avatar-label">Profile picture</span>
                <div className="ob-avatar-row" role="radiogroup" aria-labelledby="ob-avatar-label">
                  {AVATARS.map(v => (
                    <button
                      key={v}
                      type="button"
                      role="radio"
                      aria-checked={form.avatar === v}
                      aria-label={v}
                      className={`ob-avatar ${form.avatar === v ? 'active' : ''}`}
                      onClick={() => setForm(f => ({ ...f, avatar: v }))}
                    >
                      <img src={`/veggies/${v}.png`} alt="" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="ob-field">
                <span id="ob-gender-label">Gender</span>
                <div className="ob-segment" role="radiogroup" aria-labelledby="ob-gender-label">
                  <button
                    type="button"
                    role="radio"
                    aria-checked={form.gender === 'female'}
                    className={form.gender === 'female' ? 'active' : ''}
                    onClick={() => setForm(f => ({ ...f, gender: 'female' }))}
                  >Female</button>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={form.gender === 'male'}
                    className={form.gender === 'male' ? 'active' : ''}
                    onClick={() => setForm(f => ({ ...f, gender: 'male' }))}
                  >Male</button>
                </div>
              </div>

              {[
                { key: 'age', label: 'Age', unit: 'yrs' },
                { key: 'weight', label: 'Weight', unit: 'kg' },
                { key: 'height', label: 'Height', unit: 'cm' },
              ].map(({ key, label, unit }) => (
                <div className="ob-stepper" key={key}>
                  <span className="ob-stepper-label">{label}</span>
                  <div className="ob-stepper-ctrl">
                    <button type="button" aria-label={`Decrease ${label.toLowerCase()}`} onClick={() => bump(key, -1)}>
                      <Minus size={18} />
                    </button>
                    <div className="ob-stepper-val">
                      <input
                        type="number"
                        inputMode="numeric"
                        min={NUM_LIMITS[key][0]}
                        max={NUM_LIMITS[key][1]}
                        value={form[key]}
                        onChange={set(key)}
                        aria-label={label}
                      />
                      <em>{unit}</em>
                    </div>
                    <button type="button" aria-label={`Increase ${label.toLowerCase()}`} onClick={() => bump(key, 1)}>
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* fixed-height slot so the centered layout never jumps */}
            <div className="ob-preview-slot" aria-live="polite">
              {aboutValid && (
                <div className="ob-preview">
                  <span className="ob-preview-item">
                    <HeartPulse size={14} /> BMI {(Number(form.weight) / ((Number(form.height) / 100) ** 2)).toFixed(1)}
                  </span>
                  <span className="ob-preview-item ob-preview-item--muted">typical range 18.5 – 25</span>
                </div>
              )}
            </div>
          </article>
        )}

        {phase === 'goal' && (
          <article className="ob-slide ob-slide--form" key="goal">
            <div className="ob-icon" style={{ '--ob-accent': 'var(--color-energy)' }}>
              <Target size={48} />
            </div>
            <h1 className="ob-title">Lifestyle & goal</h1>
            <p className="ob-body">How active you are and what you're working toward decide how the garden coaches you.</p>

            <div className="ob-form ob-form--column">
              <label className="ob-field">
                <span>Activity level</span>
                <select value={form.activity} onChange={set('activity')} autoFocus>
                  <option value="sedentary">Sedentary</option>
                  <option value="light">Light (1–2×/wk)</option>
                  <option value="moderate">Moderate (3–4×/wk)</option>
                  <option value="active">Active (5×/wk)</option>
                  <option value="athlete">Athlete</option>
                </select>
              </label>
              <label className="ob-field">
                <span>Health goal</span>
                <select value={form.goal} onChange={set('goal')}>
                  <option value="lose">Lose weight</option>
                  <option value="maintain">Maintain</option>
                  <option value="gain">Gain weight</option>
                  <option value="muscle">Build muscle</option>
                </select>
              </label>
            </div>

            <div className="ob-preview-slot" aria-live="polite">
              {preview && (
                <div className="ob-preview">
                  <span className="ob-preview-item"><Flame size={14} /> {preview.calories} kcal</span>
                  <span className="ob-preview-item"><Activity size={14} /> {preview.protein}g protein</span>
                  <span className="ob-preview-item"><Droplet size={14} /> {preview.hydrationL} L water</span>
                </div>
              )}
            </div>
          </article>
        )}

        {phase === 'intro' && (
          <article key={currentSlide.id} className="ob-slide">
            <img className="ob-slide-art" src={currentSlide.art} alt="" aria-hidden="true" />
            <span className="ob-eyebrow">{currentSlide.eyebrow}</span>
            <h1 className="ob-title">{currentSlide.title}</h1>
            <p className="ob-body">{currentSlide.body}</p>
            {currentSlide.extra}
          </article>
        )}
      </div>

      {phase !== 'welcome' && (
      <footer className="ob-footer">
        {phase === 'intro' && (
          <div className="ob-dots" role="tablist" aria-label="Tour progress">
            {SLIDES.map((s, i) => (
              <span
                key={s.id}
                className={`ob-dot ${i === slide ? 'active' : ''} ${i < slide ? 'done' : ''}`}
                aria-current={i === slide ? 'step' : undefined}
              />
            ))}
          </div>
        )}

        {phaseHint && <p className="ob-form-hint">{phaseHint}</p>}

        <div className="ob-actions">
          <Button
            variant="ghost"
            size="md"
            onClick={goBack}
            disabled={!canGoBack}
            iconLeft={<ChevronLeft size={16} />}
          >
            Back
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={tryNext}
            disabled={touched && !phaseValid}
            iconRight={phase === 'goal' || isLastSlide ? <Sprout size={16} /> : <ChevronRight size={16} />}
          >
            {nextLabel}
          </Button>
        </div>
      </footer>
      )}
    </div>
  );
}
