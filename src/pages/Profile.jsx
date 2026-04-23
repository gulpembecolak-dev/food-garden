import { Settings, Award, History, LogOut } from 'lucide-react';
import './Profile.css';

export default function Profile() {
  return (
    <div className="profile-container animate-fade-in">
      <div className="profile-header text-center mt-6">
        <div className="avatar-large">AG</div>
        <h2 className="profile-name">Alex Gardener</h2>
        <div className="level-badge">Level 12: Master Planter</div>
      </div>

      <div className="glass-panel profile-stats mt-6">
        <div className="stat-box">
          <span className="stat-num">45</span>
          <span className="stat-label">Plants</span>
        </div>
        <div className="stat-box">
          <span className="stat-num">14</span>
          <span className="stat-label">Day Streak</span>
        </div>
        <div className="stat-box">
          <span className="stat-num">8</span>
          <span className="stat-label">Badges</span>
        </div>
      </div>

      <div className="settings-list mt-6">
        <button className="settings-row">
          <div className="sr-left">
            <Award size={20} color="var(--primary-color)" />
            <span>Achievements</span>
          </div>
        </button>
        <button className="settings-row">
          <div className="sr-left">
            <History size={20} color="var(--text-primary)" />
            <span>Garden History</span>
          </div>
        </button>
        <button className="settings-row">
          <div className="sr-left">
            <Settings size={20} color="var(--text-primary)" />
            <span>App Settings</span>
          </div>
        </button>
        
        <button className="settings-row mt-6">
          <div className="sr-left">
            <LogOut size={20} color="#F43F5E" />
            <span style={{ color: '#F43F5E' }}>Log Out</span>
          </div>
        </button>
      </div>
    </div>
  );
}
