const ACTIVITY_MULTIPLIER = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  athlete: 1.9,
};

const GOAL_KCAL_DELTA = {
  lose: -400,
  maintain: 0,
  gain: 300,
  muscle: 250,
};

export function calcTargets(p) {
  const bmr = p.gender === 'male'
    ? 10 * p.weight + 6.25 * p.height - 5 * p.age + 5
    : 10 * p.weight + 6.25 * p.height - 5 * p.age - 161;
  const tdee = bmr * (ACTIVITY_MULTIPLIER[p.activity] ?? 1.4);
  const calories = Math.round(tdee + (GOAL_KCAL_DELTA[p.goal] ?? 0));
  const proteinPerKg = p.goal === 'muscle' ? 2.0 : p.goal === 'lose' ? 1.8 : 1.4;
  const protein = Math.round(p.weight * proteinPerKg);
  const fats = Math.round((calories * 0.28) / 9);
  const carbs = Math.round((calories - protein * 4 - fats * 9) / 4);
  const hydrationL = Math.round((p.weight * 35) / 100) / 10;
  return { calories, protein, carbs, fats, hydrationL };
}

export const seedProfiles = {
  walter: {
    id: 'walter',
    name: 'Walter',
    initials: 'W',
    bio: 'Trying to slow down and eat better after years of late dinners.',
    age: 58,
    gender: 'male',
    weight: 95,
    height: 178,
    activity: 'sedentary',
    goal: 'lose',
    accent: '#F59E0B',
  },
  ann: {
    id: 'ann',
    name: 'Ann',
    initials: 'A',
    bio: 'Strength training 5×/week, building lean muscle.',
    age: 27,
    gender: 'female',
    weight: 62,
    height: 168,
    activity: 'active',
    goal: 'muscle',
    accent: '#10B981',
  },
};
