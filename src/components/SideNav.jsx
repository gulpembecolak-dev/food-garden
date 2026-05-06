import { NavLink } from 'react-router-dom';
import { Home, Calendar, LayoutDashboard, User, Sprout } from 'lucide-react';
import { useUser } from '../context/UserContext';
import './SideNav.css';

export default function SideNav() {
  const { user, activeId, setActiveId, profileIds } = useUser();

  return (
    <aside className="side-nav" aria-label="Primary">
      <div className="side-brand">
        <div className="side-brand-mark"><Sprout size={22} /></div>
        <div className="side-brand-text">
          <strong>Food Garden</strong>
          <span>Health dashboard</span>
        </div>
      </div>

      <div className="side-profile-switcher" role="tablist" aria-label="Switch profile">
        {profileIds.map(id => (
          <button
            key={id}
            role="tab"
            aria-selected={activeId === id}
            className={`side-profile-pill ${activeId === id ? 'active' : ''}`}
            onClick={() => setActiveId(id)}
          >
            {id.charAt(0).toUpperCase() + id.slice(1)}
          </button>
        ))}
      </div>

      <nav className="side-links">
        <NavLink to="/" end className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}>
          <Home size={20} /><span>Home</span>
        </NavLink>
        <NavLink to="/log" className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}>
          <Calendar size={20} /><span>Log meal</span>
        </NavLink>
        <NavLink to="/insights" className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} /><span>Insights</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}>
          <User size={20} /><span>Profile</span>
        </NavLink>
      </nav>

      <div className="side-user-card" style={{ borderColor: user.accent + '55' }}>
        <div className="side-user-avatar" style={{ background: user.accent }}>{user.initials}</div>
        <div className="side-user-meta">
          <strong>{user.name}</strong>
          <span>{user.targets.calories} kcal · {user.targets.hydrationL} L target</span>
        </div>
      </div>
    </aside>
  );
}
