import React, { useState } from 'react';
import styles from '../../styles/surahs.module.css';
import SurahGridCard from '../ui/SurahGridCard';
import surahsData from '../../data/surahs.json';
import type { Surah } from '../../types/surah';

export default function SurahCatalog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'makki' | 'madani' | 'popular'>('all');

  const surahs = surahsData as Surah[];

  const popularIds = [1, 2, 3, 4, 5, 10, 18, 36, 55, 67, 112, 113, 114];

  const filteredSurahs = surahs.filter((surah) => {
    // Filter by category
    if (activeFilter === 'makki' && surah.revelationType?.toLowerCase() !== 'meccan') {
      return false;
    }
    if (activeFilter === 'madani' && surah.revelationType?.toLowerCase() !== 'medinan') {
      return false;
    }
    if (activeFilter === 'popular' && !popularIds.includes(surah.id)) {
      return false;
    }

    // Filter by search query
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      surah.englishName.toLowerCase().includes(query) ||
      surah.arabicName.includes(query) ||
      surah.transliteration.toLowerCase().includes(query) ||
      surah.id.toString() === query
    );
  });

  return (
    <div className={styles.pageWrapper}>
      {/* Hero Header */}
      <section className={styles.heroSection}>
        <div className="divider">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>

        <h1 className={styles.heroTitle}>The Holy Quran</h1>
        <p className={styles.heroSubtitle}>114 Surahs • Complete Audio Recitations</p>

        {/* Live Search & Filter Controls */}
        <div className={styles.searchBarWrapper}>
          <div className={styles.searchBar}>
            <div className={styles.searchIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search Surah by name, number, or Arabic..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className={styles.clearBtn}
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className={styles.filterPills}>
            <button
              className={`${styles.filterPill} ${activeFilter === 'all' ? styles.activeFilterPill : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All Surahs (114)
            </button>
            <button
              className={`${styles.filterPill} ${activeFilter === 'popular' ? styles.activeFilterPill : ''}`}
              onClick={() => setActiveFilter('popular')}
            >
              Popular
            </button>
            <button
              className={`${styles.filterPill} ${activeFilter === 'makki' ? styles.activeFilterPill : ''}`}
              onClick={() => setActiveFilter('makki')}
            >
              Makki
            </button>
            <button
              className={`${styles.filterPill} ${activeFilter === 'madani' ? styles.activeFilterPill : ''}`}
              onClick={() => setActiveFilter('madani')}
            >
              Madani
            </button>
          </div>
        </div>
      </section>

      {/* Surahs Grid Section */}
      <section className={styles.contentSection}>
        <div className="container">
          <div className={styles.resultsInfo}>
            <span>Showing <strong>{filteredSurahs.length}</strong> of 114 Surahs</span>
          </div>

          <div className={styles.grid}>
            {filteredSurahs.map((surah) => (
              <SurahGridCard
                key={surah.id}
                id={surah.id}
                arabicName={surah.arabicName}
                transliteration={surah.transliteration}
              />
            ))}
          </div>

          {filteredSurahs.length === 0 && (
            <div className={styles.noResults}>
              <p>No Surahs found matching your filter</p>
              <button
                className={styles.resetBtn}
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
