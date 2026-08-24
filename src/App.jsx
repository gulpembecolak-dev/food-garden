import { Routes, Route, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Home from './pages/Home';
import LogMeal from './pages/LogMeal';
import Insights from './pages/Insights';
import Profile from './pages/Profile';
import Calendar from './pages/Calendar';
import BottomNav from './components/BottomNav';
import SideNav from './components/SideNav';
import Onboarding from './components/Onboarding';
import { useUser } from './context/UserContext';

function App() {
  const { hasProfile, authenticated } = useUser();
  // 'first' → tour right after registration; 'again' → re-opened from Profile
  const [tour, setTour] = useState(null);

  // The welcome/sign-up/log-in flow is the whole screen until a profile
  // exists AND the session is open. A fresh registration enters the app with
  // the tour on top; logging back in skips the tour.
  if (!hasProfile || !authenticated) {
    return <Onboarding onComplete={(fresh) => setTour(fresh ? 'first' : null)} />;
  }

  const location = useLocation();
  const isLogMeal = location.pathname === '/log';

  return (
    <div className="app-shell">
      <SideNav />
      <div className="app-main">
        <div className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/log" element={<LogMeal />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/profile" element={<Profile onShowIntro={() => setTour('again')} />} />
          </Routes>
        </div>
        {!isLogMeal && <BottomNav />}
      </div>
      {tour && <Onboarding introOnly firstRun={tour === 'first'} onComplete={() => setTour(null)} />}
    </div>
  );
}

export default App;
