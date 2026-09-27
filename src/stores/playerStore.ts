import { atom } from 'nanostores';
import type { Surah } from '../types/surah';
import surahsData from '../data/surahs.json';
import { getAudioUrl } from '../config';
import { savePlayerStateToStorage, loadPlayerStateFromStorage } from '../utils/cookie';

export type RepeatMode = 'off' | 'one' | 'all';

export const currentSurah = atom<Surah | null>(null);
export const isPlaying = atom<boolean>(false);
export const currentTime = atom<number>(0);
export const duration = atom<number>(0);
export const buffered = atom<number>(0);
export const playbackRate = atom<number>(1);
export const volume = atom<number>(1);
export const isMuted = atom<boolean>(false);
export const repeatMode = atom<RepeatMode>('all');
export const sleepTimerRemaining = atom<number | null>(null);
export const isPlayerVisible = atom<boolean>(false);
export const isBuffering = atom<boolean>(false);
export const isDrawerOpen = atom<boolean>(false);
export const isSearchOpen = atom<boolean>(false);

const surahs = surahsData as Surah[];

// Global audio element singleton
let globalAudio: HTMLAudioElement | null = null;
let timerInterval: any = null;
let fallbackIndex = 0;
let isInitialized = false;

function getAudio(): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null;
  if (!globalAudio) {
    globalAudio = new Audio();
    globalAudio.preload = 'auto';
    globalAudio.autoplay = false;
    setupAudioListeners(globalAudio);
  }
  return globalAudio;
}

function persistCurrentState() {
  const s = currentSurah.get();
  if (!s) return;
  savePlayerStateToStorage({
    surahId: s.id,
    currentTime: globalAudio?.currentTime || 0,
    playbackRate: playbackRate.get(),
    volume: volume.get(),
    isMuted: isMuted.get(),
    repeatMode: repeatMode.get(),
  });
}

function setupAudioListeners(audio: HTMLAudioElement) {
  audio.addEventListener('timeupdate', () => {
    currentTime.set(audio.currentTime);
    if (audio.duration && !isNaN(audio.duration)) {
      duration.set(audio.duration);
    }
    // Calculate buffered percentage
    if (audio.buffered.length > 0 && audio.duration) {
      try {
        const end = audio.buffered.end(audio.buffered.length - 1);
        buffered.set(Math.min(100, (end / audio.duration) * 100));
      } catch {
        // ignore
      }
    }
  });

  audio.addEventListener('loadedmetadata', () => {
    if (audio.duration && !isNaN(audio.duration)) {
      duration.set(audio.duration);
    }
  });

  audio.addEventListener('waiting', () => {
    isBuffering.set(true);
  });

  audio.addEventListener('playing', () => {
    isBuffering.set(false);
    isPlaying.set(true);
  });

  audio.addEventListener('pause', () => {
    isPlaying.set(false);
    persistCurrentState();
  });

  audio.addEventListener('ended', () => {
    handleTrackEnded();
  });

  audio.addEventListener('error', () => {
    const s = currentSurah.get();
    if (!s) return;
    fallbackIndex++;
    if (fallbackIndex < 3) {
      const fallbackUrl = getAudioUrl(s.id, fallbackIndex);
      audio.src = fallbackUrl;
      audio.play().catch(console.warn);
    } else {
      isBuffering.set(false);
      isPlaying.set(false);
    }
  });
}

function handleTrackEnded() {
  const mode = repeatMode.get();
  const s = currentSurah.get();
  if (!s) return;

  if (mode === 'one') {
    playSurah(s, 0);
  } else if (mode === 'all') {
    nextSurah();
  } else {
    isPlaying.set(false);
  }
}

export function initPlayer() {
  if (typeof window === 'undefined' || isInitialized) return;
  isInitialized = true;
  const audio = getAudio();

  // Restore saved state from cookies/storage
  try {
    const isDismissed = typeof window !== 'undefined' && localStorage.getItem('witr_player_dismissed') === 'true';
    const saved = loadPlayerStateFromStorage();
    if (saved && saved.surahId) {
      const found = surahs.find((s) => s.id === saved.surahId);
      if (found) {
        currentSurah.set(found);
        if (!isDismissed) {
          isPlayerVisible.set(true);
        } else {
          isPlayerVisible.set(false);
        }
        if (saved.playbackRate) {
          playbackRate.set(saved.playbackRate);
          if (audio) audio.playbackRate = saved.playbackRate;
        }
        if (saved.volume !== undefined) {
          volume.set(saved.volume);
          if (audio) audio.volume = saved.isMuted ? 0 : saved.volume;
        }
        if (saved.isMuted !== undefined) {
          isMuted.set(saved.isMuted);
          if (audio) audio.muted = saved.isMuted;
        }
        if (saved.repeatMode) {
          repeatMode.set(saved.repeatMode);
        }
        if (saved.currentTime && saved.currentTime > 0) {
          currentTime.set(saved.currentTime);
          if (audio) {
            audio.src = getAudioUrl(found.id, 0);
            try {
              audio.currentTime = saved.currentTime;
            } catch {
              // ignore
            }
          }
        }
      }
    }
  } catch (err) {
    console.warn('Could not restore player state:', err);
  }

  // MediaSession Action Handlers
  if ('mediaSession' in navigator) {
    navigator.mediaSession.setActionHandler('play', () => resume());
    navigator.mediaSession.setActionHandler('pause', () => pause());
    navigator.mediaSession.setActionHandler('nexttrack', () => nextSurah());
    navigator.mediaSession.setActionHandler('previoustrack', () => prevSurah());
  }
}

export function playSurah(surah: Surah, startSeconds?: number) {
  const audio = getAudio();
  if (!audio) return;

  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('witr_player_dismissed');
    } catch {
      // ignore
    }
  }

  fallbackIndex = 0;
  currentSurah.set(surah);
  isPlayerVisible.set(true);
  setIsPlayingState(true);

  const audioUrl = getAudioUrl(surah.id, 0);
  const padded = surah.id.toString().padStart(3, '0');
  const isCurrentSrc = audio.src && audio.src.includes(`/${padded}.mp3`);

  if (!isCurrentSrc) {
    audio.src = audioUrl;
    if (startSeconds !== undefined && startSeconds >= 0) {
      try {
        audio.currentTime = startSeconds;
      } catch {
        // ignore
      }
      currentTime.set(startSeconds);
    } else {
      try {
        audio.currentTime = 0;
      } catch {
        // ignore
      }
      currentTime.set(0);
    }
  } else {
    if (startSeconds !== undefined && startSeconds >= 0) {
      try {
        audio.currentTime = startSeconds;
      } catch {
        // ignore
      }
      currentTime.set(startSeconds);
    }
  }

  audio.playbackRate = playbackRate.get();
  audio.volume = isMuted.get() ? 0 : volume.get();
  audio.muted = isMuted.get();

  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        isPlaying.set(true);
        isBuffering.set(false);
        persistCurrentState();
      })
      .catch((err) => {
        console.warn('Playback error:', err);
        if (err.name === 'AbortError') {
          setTimeout(() => {
            audio.play().then(() => isPlaying.set(true)).catch(console.warn);
          }, 30);
        }
      });
  }

  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: `Surah ${surah.transliteration} (${surah.arabicName})`,
      artist: 'Mahmoud Khalil Al-Hussary',
      album: 'WITRQURAN - The Holy Quran',
      artwork: [{ src: '/logo.png', sizes: '512x512', type: 'image/png' }]
    });
  }
}

export function togglePlay() {
  if (isPlaying.get()) {
    pause();
  } else {
    resume();
  }
}

export function pause() {
  const audio = getAudio();
  if (audio) {
    audio.pause();
    isPlaying.set(false);
    persistCurrentState();
  }
}

export function closePlayer() {
  const audio = getAudio();
  if (audio) {
    audio.pause();
  }
  isPlaying.set(false);
  isPlayerVisible.set(false);
  currentSurah.set(null);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('witr_player_dismissed', 'true');
    } catch {
      // ignore
    }
  }
}

export function resume() {
  const audio = getAudio();
  const s = currentSurah.get();
  if (!audio) return;
  if (!s) {
    const first = surahs[0];
    if (first) playSurah(first);
    return;
  }
  if (!audio.src || audio.src === '') {
    audio.src = getAudioUrl(s.id, 0);
  }
  audio.playbackRate = playbackRate.get();
  audio.volume = isMuted.get() ? 0 : volume.get();
  audio.muted = isMuted.get();

  audio.play()
    .then(() => {
      isPlaying.set(true);
      persistCurrentState();
    })
    .catch((err) => {
      console.warn('Resume failed:', err);
    });
}

export function seek(seconds: number) {
  const audio = getAudio();
  if (audio) {
    try {
      audio.currentTime = seconds;
    } catch {
      // ignore
    }
    currentTime.set(seconds);
    persistCurrentState();
  }
}

export function nextSurah() {
  const s = currentSurah.get();
  if (!s) {
    const first = surahs[0];
    if (first) playSurah(first);
    return;
  }
  const currentIndex = surahs.findIndex((item) => item.id === s.id);
  const nextIndex = (currentIndex + 1) % surahs.length;
  playSurah(surahs[nextIndex]);
}

export function prevSurah() {
  const s = currentSurah.get();
  const audio = getAudio();
  if (audio && audio.currentTime > 3) {
    seek(0);
    return;
  }
  if (!s) return;
  const currentIndex = surahs.findIndex((item) => item.id === s.id);
  const prevIndex = (currentIndex - 1 + surahs.length) % surahs.length;
  playSurah(surahs[prevIndex]);
}

export function setPlaybackRateSpeed(rate: number) {
  playbackRate.set(rate);
  const audio = getAudio();
  if (audio) {
    audio.playbackRate = rate;
  }
  persistCurrentState();
}

export function setAudioVolume(vol: number) {
  const clamped = Math.max(0, Math.min(1, vol));
  volume.set(clamped);
  const audio = getAudio();
  if (audio) {
    audio.volume = isMuted.get() ? 0 : clamped;
  }
  persistCurrentState();
}

export function toggleAudioMute() {
  const next = !isMuted.get();
  isMuted.set(next);
  const audio = getAudio();
  if (audio) {
    audio.muted = next;
    audio.volume = next ? 0 : volume.get();
  }
  persistCurrentState();
}

export function cycleRepeat() {
  const current = repeatMode.get();
  const next = current === 'all' ? 'one' : current === 'one' ? 'off' : 'all';
  repeatMode.set(next);
  persistCurrentState();
}

export function setTimer(minutes: number | null, customSeconds?: number) {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  if (minutes === null && customSeconds === undefined) {
    sleepTimerRemaining.set(null);
    return;
  }

  let totalSeconds = customSeconds !== undefined ? customSeconds : (minutes || 0) * 60;
  sleepTimerRemaining.set(totalSeconds);

  timerInterval = setInterval(() => {
    totalSeconds -= 1;
    if (totalSeconds <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      sleepTimerRemaining.set(null);
      pause();
    } else {
      sleepTimerRemaining.set(totalSeconds);
    }
  }, 1000);
}

function setIsPlayingState(val: boolean) {
  isPlaying.set(val);
}

export function openSurahDrawer() {
  isDrawerOpen.set(true);
}

export function closeSurahDrawer() {
  isDrawerOpen.set(false);
}

export function openSearchModal() {
  isSearchOpen.set(true);
}

export function closeSearchModal() {
  isSearchOpen.set(false);
}
