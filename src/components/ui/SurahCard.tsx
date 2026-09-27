import React from 'react';
import styles from './SurahCard.module.css';
import Skeleton from './Skeleton';

interface SurahCardProps {
  number: number;
  slug: string;
  englishName: string;
  translation: string;
  isLoading?: boolean;
}

export default function SurahCard({ number, slug, englishName, translation, isLoading = false }: SurahCardProps) {
  if (isLoading) {
    return (
      <div className={styles.card} style={{ pointerEvents: 'none' }}>
        <div className={styles.content}>
          <div className={styles.numberBadge}>
            <Skeleton width="100%" height="100%" borderRadius="50%" />
          </div>
          <div className={styles.info}>
            <Skeleton width="120px" height="24px" className={styles.skeletonTitle} />
            <Skeleton width="80px" height="16px" />
          </div>
        </div>
        <div className={styles.action}>
          <Skeleton width="32px" height="32px" borderRadius="50%" />
        </div>
      </div>
    );
  }

  return (
    <a href={`/surah/${slug}`} className={styles.card}>
      <div className={styles.numberBadge}>
        <div className={styles.decorativeBorder}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 2L23 8L29.5 6.5L30.5 13L37 15L34 20L37 25L30.5 27L29.5 33.5L23 32L20 38L17 32L10.5 33.5L9.5 27L3 25L6 20L3 15L9.5 13L10.5 6.5L17 8L20 2Z" stroke="var(--border)" strokeWidth="1" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className={styles.numberText}>{number}</span>
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{englishName}</h3>
        <p className={styles.subtitle}>{translation}</p>
      </div>

      <div className={styles.actions}>
        <div className={styles.iconWrapper}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        </div>
        <div className={styles.chevronWrapper}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </a>
  );
}
