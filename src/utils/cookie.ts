export interface SavedPlayerState {
  surahId: number;
  currentTime: number;
  playbackRate: number;
  volume: number;
  isMuted: boolean;
  repeatMode: 'off' | 'one' | 'all';
}

const STORAGE_KEY = 'witr_player_state';

export function savePlayerStateToStorage(state: SavedPlayerState): void {
  if (typeof window === 'undefined') return;
  try {
    const json = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, json);
    
    // Also save in cookie with 365 days expiration
    const maxAge = 365 * 24 * 60 * 60;
    document.cookie = `${STORAGE_KEY}=${encodeURIComponent(json)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  } catch (err) {
    console.warn('Could not save player state to storage:', err);
  }
}

export function loadPlayerStateFromStorage(): SavedPlayerState | null {
  if (typeof window === 'undefined') return null;
  try {
    // 1. Try localStorage first
    const fromLocal = localStorage.getItem(STORAGE_KEY);
    if (fromLocal) {
      return JSON.parse(fromLocal) as SavedPlayerState;
    }

    // 2. Try cookie fallback
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === STORAGE_KEY && value) {
        return JSON.parse(decodeURIComponent(value)) as SavedPlayerState;
      }
    }
  } catch (err) {
    console.warn('Could not load player state from storage:', err);
  }
  return null;
}
