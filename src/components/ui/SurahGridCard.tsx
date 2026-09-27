import React from 'react';
import { useStore } from '@nanostores/react';
import styles from './SurahGridCard.module.css';
import { currentSurah, isPlaying, playSurah, pause, resume } from '../../stores/playerStore';
import surahsData from '../../data/surahs.json';
import type { Surah } from '../../types/surah';

interface SurahGridCardProps {
  id: number;
  slug?: string;
  arabicName: string;
  transliteration: string;
}

export default function SurahGridCard({
  id,
  arabicName,
  transliteration,
}: SurahGridCardProps) {
  const $currentSurah = useStore(currentSurah);
  const $isPlaying = useStore(isPlaying);

  const formattedNumber = id.toString().padStart(2, '0');
  const isCurrentSurah = $currentSurah?.id === id;
  const isThisPlaying = isCurrentSurah && $isPlaying;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const fullSurah = (surahsData as Surah[]).find((s) => s.id === id);
    if (!fullSurah) return;

    if (isCurrentSurah) {
      if ($isPlaying) {
        pause();
      } else {
        resume();
      }
    } else {
      playSurah({
        ...fullSurah,
        arabicName,
        transliteration
      });
    }
  };

  return (
    <div
      className={`${styles.card} ${isCurrentSurah ? styles.activeCard : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e as any);
        }
      }}
      aria-label={`${isThisPlaying ? 'Pause' : 'Listen to'} Surah ${transliteration}`}
    >
      {/* Top Number */}
      <div className={styles.topRow}>
        <span className={styles.numberBadge}>{formattedNumber}</span>
      </div>

      {/* Middle Arabic Calligraphy & English Name */}
      <div className={styles.centerContent}>
        <div className={styles.arabicName}>{arabicName}</div>
        <div className={styles.transliteration}>{transliteration}</div>
      </div>

      {/* Bottom Row: Islamic Geometric Star Emblem on Left, Play Button on Right */}
      <div className={styles.bottomRow}>
        <div className={styles.starIconWrapper} title="Surah">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M12 2L14.5 5.5L19 4L18 8.5L22 11L18.5 13.5L20 18L15.5 17L13 21L10.5 17.5L6 19L7 14.5L3 12L6.5 9.5L5 5L9.5 6L12 2Z" stroke="var(--emerald)" />
            <circle cx="12" cy="11.5" r="3" stroke="var(--emerald)" fill="rgba(16, 185, 129, 0.15)" />
          </svg>
        </div>

        <div
          className={`${styles.playBtn} ${isThisPlaying ? styles.activePlayBtn : ''}`}
          aria-hidden="true"
        >
          {isThisPlaying ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1"></rect>
              <rect x="14" y="4" width="4" height="16" rx="1"></rect>
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
