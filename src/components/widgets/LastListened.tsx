import React, { useEffect, useState } from 'react';
import styles from './LastListened.module.css';
import { storage } from '../../utils/storage';
import type { Surah } from '../../types/surah';

export default function LastListened() {
  const [lastListened, setLastListened] = useState<Surah[]>([]);

  useEffect(() => {
    setLastListened(storage.getLastListened().slice(0, 3));
  }, []);

  if (lastListened.length === 0) {
    return null;
  }

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8V12L15 15" stroke="var(--highlight)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="var(--highlight)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h3 className={styles.title}>Last Listened</h3>
        </div>
      </div>
      
      <div className={styles.list}>
        {lastListened.map((surah) => (
          <a key={surah.id} href={`/surah/${surah.slug}`} className={styles.listItem}>
            <div className={styles.itemLeft}>
              <div className={styles.numberBlock}>{surah.id}</div>
              <div className={styles.surahInfo}>
                <div className={styles.surahName}>{surah.transliteration}</div>
                <div className={styles.arabicName}>{surah.arabicName}</div>
              </div>
            </div>
            <div className={styles.itemRight}>
              <button className={styles.moreBtn} aria-label="More options" onClick={(e) => e.preventDefault()}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="5" r="2" fill="currentColor"/>
                  <circle cx="12" cy="12" r="2" fill="currentColor"/>
                  <circle cx="12" cy="19" r="2" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
