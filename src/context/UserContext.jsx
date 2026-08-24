import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { calcTargets, profileComplete } from './userData';

const UserContext = createContext(null);
const STORAGE_KEY = 'food-garden-profile';
// Logout is stored as an explicit flag so existing profiles stay signed in.
const LOGGED_OUT_KEY = 'food-garden-logged-out';

function loadProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    return profileComplete(p) ? p : null;
  } catch {
    return null;
  }
}

export function UserProvider({ children }) {
  const [profile, setProfile] = useState(loadProfile);
  const [loggedOut, setLoggedOut] = useState(() => {
    try { return localStorage.getItem(LOGGED_OUT_KEY) === '1'; } catch { return false; }
  });

  useEffect(() => {
    try {
      if (profile) localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      else localStorage.removeItem(STORAGE_KEY);
    } catch { /* ignore */ }
  }, [profile]);

  useEffect(() => {
    try {
      if (loggedOut) localStorage.setItem(LOGGED_OUT_KEY, '1');
      else localStorage.removeItem(LOGGED_OUT_KEY);
    } catch { /* ignore */ }
  }, [loggedOut]);

  const user = useMemo(() => {
    if (!profile) return null;
    const numeric = {
      ...profile,
      age: Number(profile.age),
      weight: Number(profile.weight),
      height: Number(profile.height),
    };
    return {
      ...numeric,
      initials: numeric.name.trim().charAt(0).toUpperCase() || '?',
      accent: '#39793C', // = --primary-color; kept as hex so alpha suffixes (e.g. accent + '30') work
      targets: calcTargets(numeric),
    };
  }, [profile]);

  const createProfile = (data) => {
    if (!profileComplete(data)) return false;
    setProfile({ ...data, name: data.name.trim() });
    setLoggedOut(false);
    return true;
  };

  const updateProfile = (patch) => {
    setProfile(prev => (prev ? { ...prev, ...patch } : prev));
  };

  const resetProfile = () => setProfile(null);

  // Prototype log-in: the account lives on this device, so we check the
  // email against the stored profile. Returns 'ok' | 'mismatch' | 'none'.
  const login = (email) => {
    if (!user) return 'none';
    if (user.email && email.trim().toLowerCase() !== user.email.trim().toLowerCase()) return 'mismatch';
    setLoggedOut(false);
    return 'ok';
  };

  // Log out keeps every bit of data — it only closes the session.
  const logout = () => setLoggedOut(true);

  const value = {
    user,
    hasProfile: !!user,
    authenticated: !!user && !loggedOut,
    createProfile, updateProfile, resetProfile,
    login, logout,
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used inside <UserProvider>');
  return ctx;
}
