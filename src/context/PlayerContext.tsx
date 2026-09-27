import React, { createContext, useContext, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import type { Surah } from '../types/surah';
import {
  currentSurah as currentSurahStore,
  isPlaying as isPlayingStore,
  currentTime as currentTimeStore,
  duration as durationStore,
  buffered as bufferedStore,
  playbackRate as playbackRateStore,
  volume as volumeStore,
  isMuted as isMutedStore,
  repeatMode as repeatModeStore,
  sleepTimerRemaining as sleepTimerRemainingStore,
  isPlayerVisible as isPlayerVisibleStore,
  isBuffering as isBufferingStore,
  type RepeatMode,
  initPlayer,
  playSurah,
  togglePlay,
  pause,
  closePlayer,
  resume,
  seek,
  nextSurah,
  prevSurah,
  setPlaybackRateSpeed,
  setAudioVolume,
  toggleAudioMute,
  cycleRepeat,
  setTimer,
} from '../stores/playerStore';

export type { RepeatMode };

export interface PlayerContextType {
  currentSurah: Surah | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  buffered: number;
  playbackRate: number;
  volume: number;
  isMuted: boolean;
  repeatMode: RepeatMode;
  sleepTimerRemaining: number | null;
  isPlayerVisible: boolean;
  isBuffering: boolean;
  
  // Actions
  playSurah: (surah: Surah, startSeconds?: number) => void;
  togglePlay: () => void;
  pause: () => void;
  closePlayer: () => void;
  resume: () => void;
  seek: (seconds: number) => void;
  nextSurah: () => void;
  prevSurah: () => void;
  setSpeed: (speed: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  setRepeatMode: (mode: RepeatMode) => void;
  setSleepTimer: (minutes: number | null, customSeconds?: number) => void;
  setSleepTimerEndOfSurah: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const currentSurahVal = useStore(currentSurahStore);
  const isPlayingVal = useStore(isPlayingStore);
  const currentTimeVal = useStore(currentTimeStore);
  const durationVal = useStore(durationStore);
  const bufferedVal = useStore(bufferedStore);
  const playbackRateVal = useStore(playbackRateStore);
  const volumeVal = useStore(volumeStore);
  const isMutedVal = useStore(isMutedStore);
  const repeatModeVal = useStore(repeatModeStore);
  const sleepTimerRemainingVal = useStore(sleepTimerRemainingStore);
  const isPlayerVisibleVal = useStore(isPlayerVisibleStore);
  const isBufferingVal = useStore(isBufferingStore);

  useEffect(() => {
    initPlayer();
  }, []);

  const value: PlayerContextType = {
    currentSurah: currentSurahVal,
    isPlaying: isPlayingVal,
    currentTime: currentTimeVal,
    duration: durationVal,
    buffered: bufferedVal,
    playbackRate: playbackRateVal,
    volume: volumeVal,
    isMuted: isMutedVal,
    repeatMode: repeatModeVal,
    sleepTimerRemaining: sleepTimerRemainingVal,
    isPlayerVisible: isPlayerVisibleVal,
    isBuffering: isBufferingVal,

    playSurah,
    togglePlay,
    pause,
    closePlayer,
    resume,
    seek,
    nextSurah,
    prevSurah,
    setSpeed: setPlaybackRateSpeed,
    setVolume: setAudioVolume,
    toggleMute: toggleAudioMute,
    setRepeatMode: (mode: RepeatMode) => repeatModeStore.set(mode),
    setSleepTimer: setTimer,
    setSleepTimerEndOfSurah: () => {
      const audioDuration = durationVal;
      const audioCurrent = currentTimeVal;
      if (audioDuration > audioCurrent) {
        setTimer(null, Math.ceil(audioDuration - audioCurrent));
      }
    },
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer(): PlayerContextType {
  const context = useContext(PlayerContext);
  const currentSurahVal = useStore(currentSurahStore);
  const isPlayingVal = useStore(isPlayingStore);
  const currentTimeVal = useStore(currentTimeStore);
  const durationVal = useStore(durationStore);
  const bufferedVal = useStore(bufferedStore);
  const playbackRateVal = useStore(playbackRateStore);
  const volumeVal = useStore(volumeStore);
  const isMutedVal = useStore(isMutedStore);
  const repeatModeVal = useStore(repeatModeStore);
  const sleepTimerRemainingVal = useStore(sleepTimerRemainingStore);
  const isPlayerVisibleVal = useStore(isPlayerVisibleStore);
  const isBufferingVal = useStore(isBufferingStore);

  if (context) {
    return context;
  }

  return {
    currentSurah: currentSurahVal,
    isPlaying: isPlayingVal,
    currentTime: currentTimeVal,
    duration: durationVal,
    buffered: bufferedVal,
    playbackRate: playbackRateVal,
    volume: volumeVal,
    isMuted: isMutedVal,
    repeatMode: repeatModeVal,
    sleepTimerRemaining: sleepTimerRemainingVal,
    isPlayerVisible: isPlayerVisibleVal,
    isBuffering: isBufferingVal,
    playSurah,
    togglePlay,
    pause,
    closePlayer,
    resume,
    seek,
    nextSurah,
    prevSurah,
    setSpeed: setPlaybackRateSpeed,
    setVolume: setAudioVolume,
    toggleMute: toggleAudioMute,
    setRepeatMode: (mode: RepeatMode) => repeatModeStore.set(mode),
    setSleepTimer: setTimer,
    setSleepTimerEndOfSurah: () => {
      const audioDuration = durationVal;
      const audioCurrent = currentTimeVal;
      if (audioDuration > audioCurrent) {
        setTimer(null, Math.ceil(audioDuration - audioCurrent));
      }
    },
  };
}
