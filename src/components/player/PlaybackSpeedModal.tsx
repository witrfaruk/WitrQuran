'use client';

import React from 'react';
import styles from './PlaybackSpeedModal.module.css';
import { usePlayer } from '@/context/PlayerContext';

interface PlaybackSpeedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PlaybackSpeedModal({ isOpen, onClose }: PlaybackSpeedModalProps) {
  const { playbackRate, setSpeed } = usePlayer();

  if (!isOpen) return null;

  const presets = [
    { label: '0.75', value: 0.75 },
    { label: '1.0', sub: 'Normal', value: 1.0, isNormal: true },
    { label: '1.25', value: 1.25 },
    { label: '1.5', value: 1.5 },
    { label: '2.0', value: 2.0 },
    { label: '3.0', value: 3.0 },
  ];

  const handleDecrease = () => {
    const next = Math.max(0.25, parseFloat((playbackRate - 0.05).toFixed(2)));
    setSpeed(next);
  };

  const handleIncrease = () => {
    const next = Math.min(3.0, parseFloat((playbackRate + 0.05).toFixed(2)));
    setSpeed(next);
  };

  const sliderPercentage = Math.min(100, Math.max(0, ((playbackRate - 0.25) / (3.0 - 0.25)) * 100));

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header with Back and Cross buttons */}
        <div className={styles.header}>
          <button className={styles.iconBtn} onClick={onClose} aria-label="Back" title="Back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <span className={styles.headerTitle}>Playback speed</span>
          <button className={styles.iconBtn} onClick={onClose} aria-label="Close" title="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Large Speed Display */}
        <div className={styles.speedDisplay}>
          <span className={styles.speedValue}>{playbackRate.toFixed(2)}x</span>
        </div>

        {/* Slider with [-] and [+] Stepper Buttons */}
        <div className={styles.sliderRow}>
          <button
            className={styles.stepperBtn}
            onClick={handleDecrease}
            disabled={playbackRate <= 0.25}
            aria-label="Decrease speed"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>

          <div className={styles.sliderTrackContainer}>
            <input
              type="range"
              min="0.25"
              max="3.0"
              step="0.05"
              value={playbackRate}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className={styles.speedSlider}
              style={{
                background: `linear-gradient(to right, #10b981 0%, #10b981 ${sliderPercentage}%, rgba(255, 255, 255, 0.15) ${sliderPercentage}%, rgba(255, 255, 255, 0.15) 100%)`
              }}
              aria-label="Playback speed slider"
            />
          </div>

          <button
            className={styles.stepperBtn}
            onClick={handleIncrease}
            disabled={playbackRate >= 3.0}
            aria-label="Increase speed"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>

        {/* Preset Pill Buttons */}
        <div className={styles.presetsGrid}>
          {presets.map((preset) => {
            const isSelected = Math.abs(playbackRate - preset.value) < 0.02;
            return (
              <button
                key={preset.value}
                className={`${styles.presetPill} ${isSelected ? styles.activePill : ''}`}
                onClick={() => setSpeed(preset.value)}
              >
                <span className={styles.presetLabel}>{preset.label}</span>
                {preset.sub && <span className={styles.presetSub}>{preset.sub}</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

