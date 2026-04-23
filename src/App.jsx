import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Home from './pages/Home';
import LogMeal from './pages/LogMeal';
import Insights from './pages/Insights';
import Profile from './pages/Profile';
import BottomNav from './components/BottomNav';

function App() {
  const [meals, setMeals] = useState([]);

  return (
    <div className="app-container" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh', 
      maxWidth: '480px', 
      margin: '0 auto', 
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div className="content" style={{ flex: 1, overflowY: 'auto', paddingBottom: '80px' }}>
        <Routes>
          <Route path="/" element={<Home meals={meals} />} />
          <Route path="/log" element={<LogMeal onAddMeal={(meal) => setMeals([...meals, meal])} />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
      <BottomNav />
    </div>
  );
}

export default App;
