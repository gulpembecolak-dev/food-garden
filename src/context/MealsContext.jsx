import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

const MealsContext = createContext(null);
const MEALS_KEY = 'food-garden-meals';
const HYDRATION_KEY = 'food-garden-hydration';

export const GLASS_ML = 250;

// eslint-disable-next-line react-refresh/only-export-components
export function fmtDate(d) {
  const yr = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const da = String(d.getDate()).padStart(2, '0');
  return `${yr}-${mo}-${da}`;
}

// eslint-disable-next-line react-refresh/only-export-components
export function todayKey() {
  return fmtDate(new Date());
}

// Dominant macro decides which plant a meal grows into.
// Compared in kcal contribution (not grams) so carbs don't win by default,
// and snacks whose calories are mostly sugar become mushrooms.
// eslint-disable-next-line react-refresh/only-export-components
export function dominantMacro(meal) {
  const { protein = 0, carbs = 0, fats = 0, sugars = 0 } = meal.macros || {};
  const kcal = {
    protein: protein * 4,
    carbs: (carbs - sugars) * 4,
    sugars: sugars * 4,
    fats: fats * 9,
  };
  return Object.entries(kcal).reduce((a, b) => (b[1] > a[1] ? b : a))[0];
}

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function MealsProvider({ children }) {
  // Older builds could seed labeled example meals; drop any that linger in storage.
  const [meals, setMeals] = useState(() => load(MEALS_KEY, []).filter(m => !m.demo));
  // { 'YYYY-MM-DD': ml } — water intake per day
  const [hydration, setHydration] = useState(() => load(HYDRATION_KEY, {}));

  useEffect(() => {
    try { localStorage.setItem(MEALS_KEY, JSON.stringify(meals)); } catch { /* ignore */ }
  }, [meals]);
  useEffect(() => {
    try { localStorage.setItem(HYDRATION_KEY, JSON.stringify(hydration)); } catch { /* ignore */ }
  }, [hydration]);

  const addMeal = useCallback((meal) => {
    setMeals(prev => [
      ...prev,
      { id: `m-${prev.length}-${Date.now()}`, loggedAt: new Date().toISOString(), ...meal },
    ]);
  }, []);

  const removeMeal = useCallback((id) => {
    setMeals(prev => prev.filter(m => m.id !== id));
  }, []);

  const addWater = useCallback((ml = GLASS_ML) => {
    const key = todayKey();
    setHydration(prev => ({ ...prev, [key]: Math.max(0, (prev[key] || 0) + ml) }));
  }, []);

  const mealsByDate = useMemo(() => {
    const map = {};
    meals.forEach(m => {
      const key = fmtDate(new Date(m.loggedAt));
      (map[key] ||= []).push(m);
    });
    return map;
  }, [meals]);

  const todayMeals = mealsByDate[todayKey()] || [];
  const todayWaterMl = hydration[todayKey()] || 0;

  const value = {
    meals, mealsByDate, todayMeals,
    addMeal, removeMeal,
    hydration, todayWaterMl, addWater,
  };
  return <MealsContext.Provider value={value}>{children}</MealsContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useMeals() {
  const ctx = useContext(MealsContext);
  if (!ctx) throw new Error('useMeals must be used inside <MealsProvider>');
  return ctx;
}
