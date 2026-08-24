import { NavLink } from 'react-router-dom';
import { Home, Calendar as CalendarIcon, LayoutDashboard, User, Sprout } from 'lucide-react';
import { useUser } from '../context/UserContext';
import './SideNav.css';

export default function SideNav() {
  const { user } = useUser();

  return (
    <aside className="side-nav" aria-label="Primary">
      <div className="side-brand">
        <div className="side-brand-mark"><Sprout size={22} /></div>
        <div className="side-brand-text">
          <strong>Food Garden</strong>
          <span>Health dashboard</span>
        </div>
      </div>

      <nav className="side-links">
        <NavLink to="/" end className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}>
          <Home size={20} /><span>Home</span>
        </NavLink>
        <NavLink to="/calendar" className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}>
          <CalendarIcon size={20} /><span>Calendar</span>
        </NavLink>
        <NavLink to="/insights" className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} /><span>Insights</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}>
          <User size={20} /><span>Profile</span>
        </NavLink>
      </nav>

      <div className="side-user-card" style={{ borderColor: user.accent + '55' }}>
        {user.avatar ? (
          <div className="side-user-avatar side-user-avatar--veggie">
            <img src={`/veggies/${user.avatar}.png`} alt="" />
          </div>
        ) : (
          <div className="side-user-avatar" style={{ background: user.accent }}>{user.initials}</div>
        )}
        <div className="side-user-meta">
          <strong>{user.name}</strong>
          <span>{user.targets.calories} kcal · {user.targets.hydrationL} L target</span>
        </div>
      </div>
    </aside>
  );
}
