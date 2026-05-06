import { createContext, useContext, useState, useMemo } from 'react';
import { calcTargets, seedProfiles } from './userData';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [profiles, setProfiles] = useState(seedProfiles);
  const [activeId, setActiveId] = useState('ann');

  const user = useMemo(() => {
    const p = profiles[activeId];
    return { ...p, targets: calcTargets(p) };
  }, [profiles, activeId]);

  const updateProfile = (patch) => {
    setProfiles(prev => ({
      ...prev,
      [activeId]: { ...prev[activeId], ...patch },
    }));
  };

  const value = { user, activeId, setActiveId, updateProfile, profileIds: Object.keys(profiles) };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used inside <UserProvider>');
  return ctx;
}
