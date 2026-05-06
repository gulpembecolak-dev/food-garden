import { Sparkles } from 'lucide-react';
import Card, { CardHeader } from './ui/Card';
import Button from './ui/Button';

function buildTip({ user, consumedCalories, consumedProtein, hydrationPct }) {
  const t = user.targets;
  const calRemaining = t.calories - consumedCalories;
  const proteinRemaining = t.protein - consumedProtein;

  if (hydrationPct < 30) {
    return {
      title: 'Drink up first',
      body: `You're at ${hydrationPct}% of your ${t.hydrationL} L target. Hydration helps appetite regulation — finish a glass before your next meal.`,
      cta: 'Add 250 ml',
    };
  }

  if (user.goal === 'muscle' && proteinRemaining > 30) {
    return {
      title: `${proteinRemaining}g protein still to go`,
      body: `For muscle building, aim for ${t.protein}g/day spread across meals. A grilled chicken breast or 200g Greek yoghurt closes most of the gap.`,
      cta: 'Log a protein meal',
    };
  }

  if (user.goal === 'lose' && calRemaining < 400 && consumedCalories > 0) {
    return {
      title: 'Easy on the dinner',
      body: `You have ${calRemaining} kcal left toward your ${t.calories} kcal target. A vegetable-rich plate with lean protein keeps you on track.`,
      cta: 'Plan dinner',
    };
  }

  if (consumedCalories === 0) {
    return {
      title: `Plan your day, ${user.name}`,
      body: `Today's target is ${t.calories} kcal and ${t.protein}g protein. Logging breakfast keeps the pattern visible across the week.`,
      cta: 'Log breakfast',
    };
  }

  return {
    title: 'You\'re on pace',
    body: `${consumedCalories} of ${t.calories} kcal logged. Stay hydrated and aim for a balanced afternoon snack.`,
    cta: 'Log snack',
  };
}

export default function Recommendation({ user, consumedCalories, consumedProtein, hydrationPct, onAction }) {
  const tip = buildTip({ user, consumedCalories, consumedProtein, hydrationPct });

  return (
    <Card variant="accent" padding="md" aria-label="Personalized recommendation">
      <CardHeader
        title={tip.title}
        subtitle={`Tailored for ${user.name}'s ${user.goal === 'muscle' ? 'muscle building' : user.goal === 'lose' ? 'weight-loss' : user.goal} goal`}
        action={<span className="rec-spark"><Sparkles size={18} color={user.accent} /></span>}
      />
      <p className="rec-body">{tip.body}</p>
      <div className="rec-actions">
        <Button variant="primary" size="sm" onClick={onAction}>{tip.cta}</Button>
      </div>
    </Card>
  );
}
