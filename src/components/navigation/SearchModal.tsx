import React, { useState, useEffect, useRef } from 'react';
import styles from './SearchModal.module.css';
import surahsData from '../../data/surahs.json';
import { usePlayer } from '../../context/PlayerContext';
import type { Surah } from '../../types/surah';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { playSurah } = usePlayer();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredSurahs = (surahsData as Surah[]).filter((surah) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      surah.id.toString() === q ||
      surah.englishName.toLowerCase().includes(q) ||
      surah.transliteration.toLowerCase().includes(q) ||
      surah.arabicName.includes(q)
    );
  });

  const handleSelectSurah = (surah: Surah) => {
    playSurah(surah);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.searchIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            placeholder="Search surah by name, number, or Arabic..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className={styles.resultsList}>
          {filteredSurahs.length === 0 ? (
            <div className={styles.noResults}>
              <p>No Surahs found matching &ldquo;{query}&rdquo;</p>
            </div>
          ) : (
            filteredSurahs.slice(0, 15).map((surah) => (
              <div
                key={surah.id}
                className={styles.surahItem}
                onClick={() => handleSelectSurah(surah)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleSelectSurah(surah);
                  }
                }}
              >
                <div className={styles.numberBadge}>
                  {surah.id.toString().padStart(2, '0')}
                </div>
                <div className={styles.surahInfo}>
                  <div className={styles.transliteration}>{surah.transliteration}</div>
                  <div className={styles.englishName}>{surah.englishName}</div>
                </div>
                <div className={styles.arabicName}>{surah.arabicName}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
