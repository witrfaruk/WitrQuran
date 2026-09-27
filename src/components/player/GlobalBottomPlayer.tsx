import React, { useState, useEffect } from 'react';
import styles from './GlobalBottomPlayer.module.css';
import { usePlayer } from '@/context/PlayerContext';
import { initPlayer } from '@/stores/playerStore';
import PlaybackSpeedModal from './PlaybackSpeedModal';
import SleepTimerModal from './SleepTimerModal';

export default function GlobalBottomPlayer() {
  const {
    currentSurah,
    isPlaying,
    currentTime,
    duration,
    buffered,
    playbackRate,
    volume,
    isMuted,
    repeatMode,
    sleepTimerRemaining,
    isPlayerVisible,
    togglePlay,
    seek,
    nextSurah,
    prevSurah,
    setVolume,
    toggleMute,
    setRepeatMode,
    closePlayer,
  } = usePlayer();

  const [isSpeedModalOpen, setIsSpeedModalOpen] = useState(false);
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);

  useEffect(() => {
    initPlayer();
  }, []);

  if (!currentSurah || !isPlayerVisible) return null;

  // Format seconds to mm:ss or hh:mm:ss
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    seek(val);
  };

  const cycleRepeatMode = () => {
    if (repeatMode === 'off') setRepeatMode('all');
    else if (repeatMode === 'all') setRepeatMode('one');
    else setRepeatMode('off');
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTimerShort = (seconds: number) => {
    const mins = Math.ceil(seconds / 60);
    return `${mins}m`;
  };

  return (
    <>
      <div
        className={`${styles.bottomPlayer} ${styles.visible}`}
        role="region"
        aria-label="Audio player"
      >
        <div className={styles.playerInner}>
          {/* LEFT: SURAH INFO */}
          <div className={styles.surahInfo}>
            <div className={styles.numberBadge}>
              {currentSurah.id.toString().padStart(2, '0')}
            </div>
            <div className={styles.textDetails}>
              <span className={styles.surahName}>
                {currentSurah.transliteration}
              </span>
              <span className={styles.arabicName}>
                {currentSurah.arabicName}
              </span>
            </div>
          </div>

          {/* CENTER: CONTROLS & TIMELINE */}
          <div className={styles.centerControls}>
            <div className={styles.buttonRow}>
              {/* Repeat Mode */}
              <button
                className={`${styles.controlBtn} ${repeatMode !== 'off' ? styles.activeControlBtn : ''}`}
                onClick={cycleRepeatMode}
                title={`Repeat: ${repeatMode}`}
                aria-label={`Repeat mode: ${repeatMode}`}
              >
                {repeatMode === 'one' ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="17 1 21 5 17 9"></polyline>
                    <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                    <polyline points="7 23 3 19 7 15"></polyline>
                    <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                    <text x="10" y="15" fontSize="8" fill="#10b981" fontWeight="bold">1</text>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={repeatMode === 'all' ? '#10b981' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="17 1 21 5 17 9"></polyline>
                    <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                    <polyline points="7 23 3 19 7 15"></polyline>
                    <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                  </svg>
                )}
              </button>

              {/* Previous Surah */}
              <button
                className={styles.controlBtn}
                onClick={prevSurah}
                title="Previous Surah"
                aria-label="Previous Surah"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="19 20 9 12 19 4 19 20"></polygon>
                  <line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></line>
                </svg>
              </button>

              {/* Play / Pause */}
              <button
                className={styles.playPauseBtn}
                onClick={togglePlay}
                title={isPlaying ? 'Pause' : 'Play'}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" rx="1"></rect>
                    <rect x="14" y="4" width="4" height="16" rx="1"></rect>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '2px' }}>
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                )}
              </button>

              {/* Next Surah */}
              <button
                className={styles.controlBtn}
                onClick={nextSurah}
                title="Next Surah"
                aria-label="Next Surah"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 4 15 12 5 20 5 4"></polygon>
                  <line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></line>
                </svg>
              </button>

              {/* Speed Button */}
              <button
                className={`${styles.controlBtn} ${styles.speedBtn}`}
                onClick={() => setIsSpeedModalOpen(true)}
                title="Playback Speed"
                aria-label="Playback Speed"
              >
                <span className={styles.speedBadge}>{playbackRate}x</span>
              </button>
            </div>

            {/* Timeline Progress Scrubber */}
            <div className={styles.timelineRow}>
              <span className={styles.timeText}>{formatTime(currentTime)}</span>
              
              <div className={styles.scrubberWrapper}>
                <div className={styles.scrubberTrack}>
                  <div
                    className={styles.bufferBar}
                    style={{ width: `${buffered}%` }}
                  />
                  <div
                    className={styles.progressBar}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeekChange}
                  className={styles.scrubberInput}
                  aria-label="Audio scrubber"
                />
              </div>

              <span className={styles.timeText}>{formatTime(duration)}</span>
            </div>
          </div>

          {/* RIGHT: EXTRA CONTROLS (SLEEP TIMER & VOLUME) - NO CLOSE BUTTON */}
          <div className={styles.rightControls}>
            {/* Sleep Timer */}
            <button
              className={`${styles.timerBtn} ${sleepTimerRemaining !== null ? styles.timerActive : ''}`}
              onClick={() => setIsTimerModalOpen(true)}
              title="Sleep Timer"
              aria-label="Sleep Timer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>
                {sleepTimerRemaining !== null ? formatTimerShort(sleepTimerRemaining) : 'Timer'}
              </span>
            </button>

            {/* Volume Control */}
            <div className={styles.volumeControl}>
              <button
                className={styles.controlBtn}
                onClick={toggleMute}
                title={isMuted ? 'Unmute' : 'Mute'}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <line x1="23" y1="9" x2="17" y2="15"></line>
                    <line x1="17" y1="9" x2="23" y2="15"></line>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                  </svg>
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className={styles.volumeSlider}
                aria-label="Volume slider"
              />
            </div>

            {/* Close Player (✕) Button */}
            <button
              className={`${styles.controlBtn} ${styles.closePlayerBtn}`}
              onClick={closePlayer}
              title="Close Player"
              aria-label="Close Player"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <PlaybackSpeedModal
        isOpen={isSpeedModalOpen}
        onClose={() => setIsSpeedModalOpen(false)}
      />

      <SleepTimerModal
        isOpen={isTimerModalOpen}
        onClose={() => setIsTimerModalOpen(false)}
      />
    </>
  );
}
