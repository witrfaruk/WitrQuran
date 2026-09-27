'use client';

import React from 'react';
import styles from './SleepTimerModal.module.css';
import { usePlayer } from '@/context/PlayerContext';

interface SleepTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SleepTimerModal({ isOpen, onClose }: SleepTimerModalProps) {
  const { sleepTimerRemaining, setSleepTimer, setSleepTimerEndOfSurah } = usePlayer();

  if (!isOpen) return null;

  const presets = [
    { label: '5 min', minutes: 5 },
    { label: '15 min', minutes: 15 },
    { label: '30 min', minutes: 30 },
    { label: '45 min', minutes: 45 },
    { label: '60 min', minutes: 60 },
    { label: 'End of Surah', isEnd: true },
  ];

  const formatRemainingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) {
      return `${secs}s`;
    }
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentMinutes = sleepTimerRemaining ? Math.ceil(sleepTimerRemaining / 60) : 0;
  const sliderPercentage = Math.min(100, Math.max(0, (currentMinutes / 120) * 100));

  const handleDecrease = () => {
    const current = sleepTimerRemaining !== null ? sleepTimerRemaining : 15 * 60;
    const newSec = Math.max(0, current - 5 * 60);
    if (newSec === 0) {
      setSleepTimer(null);
    } else {
      setSleepTimer(null, newSec);
    }
  };

  const handleIncrease = () => {
    const current = sleepTimerRemaining !== null ? sleepTimerRemaining : 0;
    const newSec = Math.min(120 * 60, current + 5 * 60);
    setSleepTimer(null, newSec);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const mins = parseInt(e.target.value, 10);
    if (mins <= 0) {
      setSleepTimer(null);
    } else {
      setSleepTimer(mins);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header with Back Button and Cross Button */}
        <div className={styles.header}>
          <button className={styles.iconBtn} onClick={onClose} aria-label="Back" title="Back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <span className={styles.headerTitle}>Sleep timer</span>
          <button className={styles.iconBtn} onClick={onClose} aria-label="Close" title="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Large Value Display */}
        <div className={styles.displayArea}>
          <span className={styles.timerValue}>
            {sleepTimerRemaining !== null ? formatRemainingTime(sleepTimerRemaining) : 'Off'}
          </span>
          <span className={styles.timerSub}>
            {sleepTimerRemaining !== null ? 'TIMER IS ACTIVE' : 'TIMER IS TURNED OFF'}
          </span>
        </div>

        {/* Stepper with [-] and [+] Buttons & Custom Slider Track */}
        <div className={styles.sliderRow}>
          <button
            className={styles.stepperBtn}
            onClick={handleDecrease}
            disabled={sleepTimerRemaining === null || sleepTimerRemaining <= 60}
            aria-label="Decrease 5 minutes"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>

          <div className={styles.sliderTrackContainer}>
            <input
              type="range"
              min="0"
              max="120"
              step="5"
              value={currentMinutes}
              onChange={handleSliderChange}
              className={styles.timerSlider}
              style={{
                background: `linear-gradient(to right, #10b981 0%, #10b981 ${sliderPercentage}%, rgba(255, 255, 255, 0.15) ${sliderPercentage}%, rgba(255, 255, 255, 0.15) 100%)`
              }}
              aria-label="Sleep timer duration slider"
            />
          </div>

          <button
            className={styles.stepperBtn}
            onClick={handleIncrease}
            aria-label="Increase 5 minutes"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>

        {/* Presets Grid */}
        <div className={styles.presetsGrid}>
          {presets.map((preset) => {
            let isActive = false;
            if (preset.minutes && sleepTimerRemaining !== null) {
              isActive = Math.abs(sleepTimerRemaining - preset.minutes * 60) < 5;
            }

            return (
              <button
                key={preset.label}
                className={`${styles.presetPill} ${isActive ? styles.activePill : ''}`}
                onClick={() => {
                  if (preset.isEnd) {
                    setSleepTimerEndOfSurah();
                  } else if (preset.minutes) {
                    setSleepTimer(preset.minutes);
                  }
                }}
              >
                <span className={styles.presetLabel}>{preset.label}</span>
              </button>
            );
          })}
        </div>

        {/* Turn Off Button if active */}
        {sleepTimerRemaining !== null && (
          <button
            className={styles.offBtn}
            onClick={() => setSleepTimer(null)}
          >
            Turn Off Timer
          </button>
        )}
      </div>
    </div>
  );
}

