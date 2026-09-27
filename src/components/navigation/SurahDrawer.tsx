import React, { useState, useMemo, useEffect } from 'react';
import styles from './SurahDrawer.module.css';
import surahsData from '../../data/surahs.json';
import { usePlayer } from '../../context/PlayerContext';
import type { Surah } from '../../types/surah';

interface SurahDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export default function SurahDrawer({ isOpen, onClose, onMouseEnter, onMouseLeave }: SurahDrawerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { currentSurah, isPlaying, playSurah, togglePlay } = usePlayer();
  const surahs = surahsData as Surah[];

  const filteredSurahs = useMemo(() => {
    if (!searchQuery.trim()) return surahs;
    
    const query = searchQuery.toLowerCase();
    return surahs.filter(surah => 
      surah.englishName.toLowerCase().includes(query) ||
      surah.transliteration.toLowerCase().includes(query) ||
      surah.arabicName.includes(query) ||
      surah.id.toString() === query
    );
  }, [searchQuery, surahs]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isOpen && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    if (isLeftSwipe && typeof window !== 'undefined' && window.innerWidth < 1024) {
      onClose();
    }
  };

  const handleSelectSurah = (surah: Surah) => {
    if (currentSurah?.id === surah.id) {
      togglePlay();
    } else {
      playSurah(surah);
    }
    onClose();
  };

  return (
    <div 
      className={`${styles.drawerWrapper} ${isOpen ? styles.open : ''}`}
    >
      {/* Mobile backdrop */}
      <div className={`${styles.backdrop} ${isOpen ? styles.open : ''}`} onClick={onClose} />

      <div 
        className={styles.drawer}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className={styles.header}>
          <div className={styles.headerTitleGroup}>
            <span className={styles.headerBadge}>114 Surahs</span>
            <h2 className={styles.title}>Browse Surahs</h2>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close drawer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6L18 18"/>
            </svg>
          </button>
        </div>

        {/* Search inside drawer */}
        <div className={styles.searchContainer}>
          <div className={styles.searchInputWrapper}>
            <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text"
              placeholder="Search by name, number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button 
                className={styles.clearSearchBtn}
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* List of Surahs */}
        <div className={styles.surahList}>
          {filteredSurahs.length === 0 ? (
            <div className={styles.emptyState}>
              <span>No Surahs found for "{searchQuery}"</span>
            </div>
          ) : (
            filteredSurahs.map((surah) => {
              const isSelected = currentSurah?.id === surah.id;
              const verseCount = surah.totalAyahs || (surah as any).totalVerses || (surah as any).versesCount;
              return (
                <div 
                  key={surah.id}
                  className={`${styles.surahItem} ${isSelected ? styles.active : ''}`}
                  onClick={() => handleSelectSurah(surah)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleSelectSurah(surah);
                    }
                  }}
                >
                  <div className={styles.surahNumber}>
                    {surah.id.toString().padStart(2, '0')}
                  </div>

                  <div className={styles.surahInfo}>
                    <div className={styles.englishName}>{surah.transliteration}</div>
                    <div className={styles.translatedName}>
                      {surah.englishName} • {verseCount ? `${verseCount} Verses` : `${surah.revelationType || ''}`}
                    </div>
                  </div>

                  <div className={styles.itemRight}>
                    <div className={styles.arabicName}>{surah.arabicName}</div>
                    {isSelected && (
                      <div className={styles.playingIndicator}>
                        {isPlaying ? (
                          <>
                            <span className={styles.bar} />
                            <span className={styles.bar} />
                            <span className={styles.bar} />
                          </>
                        ) : (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                          </svg>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
