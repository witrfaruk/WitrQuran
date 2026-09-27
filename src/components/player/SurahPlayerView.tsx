import React, { useState, useMemo, useEffect } from 'react';
import styles from './SurahPlayerView.module.css';
import { usePlayer } from '@/context/PlayerContext';
import type { Surah } from '@/types/surah';

interface SurahPlayerViewProps {
  surah: Surah;
  prevSurah: Surah | null;
  nextSurah: Surah | null;
  allSurahs: Surah[];
}

export default function SurahPlayerView({
  surah,
  prevSurah,
  nextSurah,
  allSurahs,
}: SurahPlayerViewProps) {
  const { currentSurah, isPlaying, playSurah, togglePlay } = usePlayer();
  const [searchQuery, setSearchQuery] = useState('');

  // Determine cover art image from curated 6 high-res popular surahs images
  const coverImageIndex = ((surah.id - 1) % 6) + 1;
  const coverImageSrc = `/popular-surahs/${coverImageIndex}.jpg`;

  const isCurrentSurahPlaying = currentSurah?.id === surah.id && isPlaying;
  const isCurrentSurahSelected = currentSurah?.id === surah.id;

  const handleHeroPlayToggle = () => {
    if (isCurrentSurahSelected) {
      togglePlay();
    } else {
      playSurah(surah);
    }
  };

  const handleSelectSurahFromQueue = (selectedSurah: Surah) => {
    if (currentSurah?.id === selectedSurah.id) {
      togglePlay();
    } else {
      playSurah(selectedSurah);
    }
  };

  // Filtered Queue
  const filteredQueue = useMemo(() => {
    if (!searchQuery.trim()) return allSurahs;
    const q = searchQuery.toLowerCase();
    return allSurahs.filter(
      (s) =>
        s.transliteration.toLowerCase().includes(q) ||
        s.englishName.toLowerCase().includes(q) ||
        s.arabicName.includes(q) ||
        s.id.toString() === q
    );
  }, [searchQuery, allSurahs]);

  return (
    <div className={styles.stageContainer}>
      {/* Breadcrumb Navigation */}
      <nav className={styles.topBreadcrumb} aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span>/</span>
        <a href="/surahs">All Surahs</a>
        <span>/</span>
        <span>Surah {surah.transliteration}</span>
      </nav>

      {/* 2-Column YouTube Music Style Player Stage */}
      <div className={styles.mainGrid}>
        {/* Left Column: Now Playing Hero Stage */}
        <section className={styles.leftStage} aria-label="Now Playing Showcase">
          <div className={styles.coverArtCard}>
            <img
              src={coverImageSrc}
              alt={`Surah ${surah.transliteration} Cover Art`}
              className={styles.coverImage}
              loading="eager"
            />
            <div className={styles.coverOverlay}>
              <span className={styles.floatingChapterBadge}>
                SURAH #{surah.id}
              </span>
            </div>
          </div>

          <div className={styles.surahTitlesBlock}>
            <h1 className={styles.englishTranslit}>Surah {surah.transliteration}</h1>
          </div>

          <div className={styles.stageActions}>
            {prevSurah && (
              <a
                href={`/surah/${prevSurah.slug}`}
                className={styles.navArrowBtn}
                title={`Previous: Surah ${prevSurah.transliteration}`}
                aria-label="Previous Surah"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="19 20 9 12 19 4 19 20"></polygon>
                  <line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"></line>
                </svg>
              </a>
            )}

            <button
              onClick={handleHeroPlayToggle}
              className={`${styles.primaryPlayBtn} ${isCurrentSurahPlaying ? styles.primaryPlayBtnPlaying : ''}`}
              aria-label={isCurrentSurahPlaying ? 'Pause Surah' : 'Play Surah'}
            >
              {isCurrentSurahPlaying ? (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" rx="1"></rect>
                    <rect x="14" y="4" width="4" height="16" rx="1"></rect>
                  </svg>
                  <span>Pause Recitation</span>
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                  <span>Play Surah</span>
                </>
              )}
            </button>

            {nextSurah && (
              <a
                href={`/surah/${nextSurah.slug}`}
                className={styles.navArrowBtn}
                title={`Next: Surah ${nextSurah.transliteration}`}
                aria-label="Next Surah"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 4 15 12 5 20 5 4"></polygon>
                  <line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"></line>
                </svg>
              </a>
            )}
          </div>
        </section>

        {/* Right Column: "UP NEXT" Playlist Queue */}
        <section className={styles.rightQueue} aria-label="Up Next Playlist Queue">
          <div className={styles.queueHeader}>
            <div className={styles.queueTitleGroup}>
              <h2 className={styles.queueTitle}>UP NEXT</h2>
              <span className={styles.queueCountBadge}>114 Surahs</span>
            </div>
            <a href="/surahs" style={{ fontSize: '0.85rem', color: 'var(--emerald-bright)', fontWeight: 700, textDecoration: 'none' }}>
              View All Grid →
            </a>
          </div>

          <div className={styles.queueSearchBox}>
            <svg className={styles.searchIconInside} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search in queue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.queueSearchInput}
            />
          </div>

          <div className={styles.queueList}>
            {filteredQueue.map((item) => {
              const isItemActive = currentSurah?.id === item.id;
              const isItemPlaying = isItemActive && isPlaying;
              const thumbIndex = ((item.id - 1) % 6) + 1;
              const thumbSrc = `/popular-surahs/${thumbIndex}.jpg`;

              return (
                <div
                  key={item.id}
                  className={`${styles.queueItem} ${isItemActive ? styles.queueItemActive : ''}`}
                  onClick={() => handleSelectSurahFromQueue(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleSelectSurahFromQueue(item);
                    }
                  }}
                >
                  <div className={styles.queueItemLeft}>
                    <img
                      src={thumbSrc}
                      alt={item.transliteration}
                      className={styles.queueThumb}
                      loading="lazy"
                    />
                    <div className={styles.queueDetails}>
                      <span className={styles.queueTranslit}>
                        {item.id}. {item.transliteration}
                      </span>
                      <span className={styles.queueSub}>
                        {item.englishName} • {item.totalAyahs} Ayahs
                      </span>
                    </div>
                  </div>

                  <div className={styles.queueItemRight}>
                    <span className={styles.queueArabic}>{item.arabicName}</span>
                    {isItemPlaying && (
                      <div className={styles.equalizerBars}>
                        <span className={styles.eqBar} />
                        <span className={styles.eqBar} />
                        <span className={styles.eqBar} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
