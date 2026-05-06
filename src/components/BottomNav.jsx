import { NavLink } from 'react-router-dom';
import { Home, Calendar, LayoutDashboard, User } from 'lucide-react';
import './BottomNav.css';

export default function BottomNav() {
  return (
    <div className="bottom-nav">
      <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Home size={22} />
        <span>Home</span>
      </NavLink>
      <NavLink to="/calendar" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Calendar size={22} />
        <span>Calendar</span>
      </NavLink>
      <NavLink to="/insights" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <LayoutDashboard size={22} />
        <span>Insights</span>
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <User size={22} />
        <span>Profile</span>
      </NavLink>
    </div>
  );
}
