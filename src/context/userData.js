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

// Veggie avatars — cut-outs in /public/veggies, used as profile pictures.
export const AVATARS = ['tomato', 'radish', 'carrot', 'peas', 'cucumber', 'leek', 'pepper', 'leaf'];

// Starting values for the onboarding form — sensible defaults the user
// adjusts with steppers instead of typing into empty fields.
export const emptyProfile = {
  name: '',
  avatar: 'tomato',
  age: 25,
  gender: 'female',
  weight: 62,
  height: 168,
  activity: 'moderate',
  goal: 'maintain',
};

export function profileComplete(p) {
  return (
    p &&
    p.name?.trim() &&
    Number(p.age) >= 12 && Number(p.age) <= 100 &&
    Number(p.weight) >= 30 && Number(p.weight) <= 250 &&
    Number(p.height) >= 120 && Number(p.height) <= 230
  );
}
