import { useState, useEffect } from 'react';

const STORAGE_KEY = 'food-garden-journal';

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useJournal() {
  const [entries, setEntries] = useState(load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const add = (data) => {
    const entry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...data,
    };
    setEntries(prev => [entry, ...prev]);
  };

  const remove = (id) => setEntries(prev => prev.filter(e => e.id !== id));

  return { entries, add, remove };
}
