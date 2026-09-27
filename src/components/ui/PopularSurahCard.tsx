import React from 'react';
import { useStore } from '@nanostores/react';
import styles from './PopularSurahCard.module.css';
import { currentSurah, isPlaying, playSurah, pause, resume } from '../../stores/playerStore';
import surahsData from '../../data/surahs.json';
import type { Surah } from '../../types/surah';

interface PopularSurahCardProps {
  id: number;
  slug: string;
  arabicName: string;
  transliteration: string;
  imageSrc?: string;
}

export default function PopularSurahCard({
  id,
  arabicName,
  transliteration,
  imageSrc
}: PopularSurahCardProps) {
  const $currentSurah = useStore(currentSurah);
  const $isPlaying = useStore(isPlaying);

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
      className={styles.card}
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
      {/* Visual Header / Image Container */}
      <div className={styles.imageContainer}>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={transliteration}
            className={styles.image}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div className={styles.imagePlaceholder}>
            <div className={styles.placeholderGlow} />
            <svg
              className={styles.placeholderIcon}
              viewBox="0 0 100 60"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M72 10 A 6 6 0 0 0 76 18 A 8 8 0 0 1 72 10 Z" fill="rgba(45, 212, 191, 0.6)" />
              <path d="M0 60 L25 35 L50 60 Z" fill="rgba(6, 45, 60, 0.4)" />
              <path d="M35 60 L65 28 L95 60 Z" fill="rgba(6, 40, 55, 0.5)" />
              <path d="M15 60 L15 32 L20 28 L25 32 L25 60 Z" fill="rgba(16, 185, 129, 0.25)" />
              <path d="M50 60 L50 25 Q57 15 64 25 L64 60 Z" fill="rgba(16, 185, 129, 0.35)" />
              <path d="M80 60 L80 34 L85 30 L90 34 L90 60 Z" fill="rgba(16, 185, 129, 0.25)" />
            </svg>
          </div>
        )}
      </div>

      {/* Card Content (Arabic & English transliteration) */}
      <div className={styles.content}>
        <div className={styles.arabicName}>{arabicName}</div>
        <div className={styles.transliteration}>{transliteration}</div>

        {/* Play Button */}
        <div className={styles.playBtnWrapper}>
          <div
            className={`${styles.playBtn} ${isThisPlaying ? styles.activePlayBtn : ''}`}
            aria-hidden="true"
          >
            {isThisPlaying ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1"></rect>
                <rect x="14" y="4" width="4" height="16" rx="1"></rect>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
