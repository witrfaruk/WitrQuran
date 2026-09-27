import type { Surah } from '@/types/surah';

const LAST_LISTENED_KEY = 'quran_last_listened';
const PREFERENCES_KEY = 'quran_preferences';

export interface UserPreferences {
  volume: number;
  playbackRate: number;
}

export const storage = {
  // Last Listened (Session Storage Only)
  getLastListened: (): Surah[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = sessionStorage.getItem(LAST_LISTENED_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error parsing last listened', e);
      return [];
    }
  },

  addLastListened: (surah: Surah) => {
    if (typeof window === 'undefined') return;
    try {
      const current = storage.getLastListened();
      // Remove if exists to move it to the top (prevents duplicates)
      const filtered = current.filter((s) => s.id !== surah.id);
      const updated = [surah, ...filtered].slice(0, 10);
      sessionStorage.setItem(LAST_LISTENED_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving last listened', e);
    }
  },

  // Preferences (Local Storage)
  getPreferences: (): UserPreferences => {
    const defaultPrefs: UserPreferences = { volume: 1, playbackRate: 1 };
    if (typeof window === 'undefined') return defaultPrefs;
    try {
      const data = localStorage.getItem(PREFERENCES_KEY);
      return data ? { ...defaultPrefs, ...JSON.parse(data) } : defaultPrefs;
    } catch (e) {
      console.error('Error parsing preferences', e);
      return defaultPrefs;
    }
  },

  savePreferences: (prefs: Partial<UserPreferences>) => {
    if (typeof window === 'undefined') return;
    try {
      const current = storage.getPreferences();
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify({ ...current, ...prefs }));
    } catch (e) {
      console.error('Error saving preferences', e);
    }
  }
};
