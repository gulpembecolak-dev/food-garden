import { useState, useEffect } from 'react';
import { Sprout, Sparkles, Camera, BarChart3, BookOpen, ChevronLeft, ChevronRight, X } from 'lucide-react';
import Button from './ui/Button';
import { useUser } from '../context/UserContext';
import './Onboarding.css';

import { STORAGE_KEY } from './onboardingState';

const SLIDES = [
  {
    id: 'welcome',
    icon: <Sprout size={48} />,
    accent: 'var(--primary-color)',
    eyebrow: 'Welcome',
    title: 'Your meals grow a garden',
    body: 'Food Garden turns daily nutrition into a living visualization. Log a meal — a plant sprouts. Eat in balance — the garden thrives.',
  },
  {
    id: 'targets',
    icon: <Sparkles size={48} />,
    accent: '#F59E0B',
    eyebrow: 'Built around you',
    title: 'Calculated from your data',
    body: 'Your daily calories, protein, carbs, fats and hydration are calculated from your age, weight, height, activity level and goal. Adjust any value in your profile and the targets recompute live.',
  },
  {
    id: 'log',
    icon: <Camera size={48} />,
    accent: '#3B82F6',
    eyebrow: 'Logging',
    title: 'Log meals in four steps',
    body: 'Pick a meal type, set the portion, scan with AI or enter macros, then add the mood and place. Each meal becomes part of your garden.',
  },
  {
    id: 'insights',
    icon: <BarChart3 size={48} />,
    accent: '#10B981',
    eyebrow: 'Insights',
    title: 'Patterns surface over time',
    body: 'Hydration trends, balance scores and mood × energy correlations show up automatically. A private journal sits beside the charts for your own reflections.',
    extra: <span className="ob-extra"><BookOpen size={14} /> Journal entries are stored only on your device.</span>,
  },
];

export default function Onboarding({ onComplete }) {
  const { user, setActiveId, profileIds } = useUser();
  const [step, setStep] = useState(0);
  const [closing, setClosing] = useState(false);
  const isFinal = step === SLIDES.length;

  const next = () => setStep(s => Math.min(s + 1, SLIDES.length));
  const prev = () => setStep(s => Math.max(s - 1, 0));
  const finish = (profileId) => {
    if (profileId) setActiveId(profileId);
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch { /* ignore */ }
    setClosing(true);
    setTimeout(() => onComplete?.(), 250);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') finish();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const slide = SLIDES[step];

  const profileMeta = {
    walter: { name: 'Walter', initials: 'W', accent: '#F59E0B', tag: '58 · slower pace, weight-loss' },
    ann:    { name: 'Ann',    initials: 'A', accent: '#10B981', tag: '27 · active, muscle-building' },
  };

  return (
    <div className={`onboarding ${closing ? 'closing' : ''}`} role="dialog" aria-label="Welcome tour">
      <button className="ob-skip" onClick={() => finish()} aria-label="Skip onboarding">
        Skip <X size={16} />
      </button>

      <div className="ob-stage">
        {!isFinal ? (
          <article key={slide.id} className="ob-slide">
            <div className="ob-icon" style={{ '--ob-accent': slide.accent }}>
              {slide.icon}
            </div>
            <span className="ob-eyebrow">{slide.eyebrow}</span>
            <h1 className="ob-title">{slide.title}</h1>
            <p className="ob-body">{slide.body}</p>
            {slide.extra}
          </article>
        ) : (
          <article className="ob-slide ob-slide--final">
            <span className="ob-eyebrow">One last step</span>
            <h1 className="ob-title">Pick a starting profile</h1>
            <p className="ob-body">Choose a template that's closest to you. You can edit every value — age, weight, activity, goal — once you're inside.</p>
            <div className="ob-profiles">
              {profileIds.map(id => {
                const meta = profileMeta[id];
                if (!meta) return null;
                return (
                  <button
                    key={id}
                    className={`ob-profile ${user.id === id ? 'active' : ''}`}
                    style={{ '--profile-accent': meta.accent }}
                    onClick={() => finish(id)}
                  >
                    <span className="ob-profile-avatar" style={{ background: meta.accent }}>{meta.initials}</span>
                    <span className="ob-profile-name">{meta.name}</span>
                    <span className="ob-profile-tag">{meta.tag}</span>
                  </button>
                );
              })}
            </div>
          </article>
        )}
      </div>

      <footer className="ob-footer">
        <div className="ob-dots" role="tablist" aria-label="Progress">
          {SLIDES.map((s, i) => (
            <span
              key={s.id}
              className={`ob-dot ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}
              aria-current={i === step ? 'step' : undefined}
            />
          ))}
          <span className={`ob-dot ${isFinal ? 'active' : ''}`} aria-current={isFinal ? 'step' : undefined} />
        </div>

        <div className="ob-actions">
          <Button
            variant="ghost"
            size="md"
            onClick={prev}
            disabled={step === 0}
            iconLeft={<ChevronLeft size={16} />}
          >
            Back
          </Button>
          {!isFinal ? (
            <Button
              variant="primary"
              size="md"
              onClick={next}
              iconRight={<ChevronRight size={16} />}
            >
              {step === SLIDES.length - 1 ? 'Choose profile' : 'Next'}
            </Button>
          ) : (
            <Button variant="ghost" size="md" onClick={() => finish()}>
              Decide later
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}
