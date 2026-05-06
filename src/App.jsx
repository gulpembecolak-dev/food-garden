import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Home from './pages/Home';
import LogMeal from './pages/LogMeal';
import Insights from './pages/Insights';
import Profile from './pages/Profile';
import Calendar from './pages/Calendar';
import BottomNav from './components/BottomNav';
import SideNav from './components/SideNav';
import Onboarding from './components/Onboarding';
import { shouldShowOnboarding } from './components/onboardingState';

function App() {
  const [meals, setMeals] = useState([]);
  const [showOnboarding, setShowOnboarding] = useState(shouldShowOnboarding);

  return (
    <div className="app-shell">
      <SideNav />
      <div className="app-main">
        <div className="app-content">
          <Routes>
            <Route path="/" element={<Home meals={meals} />} />
            <Route path="/log" element={<LogMeal onAddMeal={(meal) => setMeals([...meals, meal])} />} />
            <Route path="/calendar" element={<Calendar meals={meals} />} />
            <Route path="/insights" element={<Insights meals={meals} />} />
            <Route path="/profile" element={<Profile onShowIntro={() => setShowOnboarding(true)} />} />
          </Routes>
        </div>
        <BottomNav />
      </div>
      {showOnboarding && <Onboarding onComplete={() => setShowOnboarding(false)} />}
    </div>
  );
}

export default App;
