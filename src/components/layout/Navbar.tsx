import React, { useState, useEffect } from 'react';
import styles from './Navbar.module.css';
import SearchModal from '../navigation/SearchModal';
import SurahDrawer from '../navigation/SurahDrawer';

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
      const handlePathChange = () => {
        setCurrentPath(window.location.pathname);
      };
      window.addEventListener('popstate', handlePathChange);
      document.addEventListener('astro:page-load', handlePathChange);
      return () => {
        window.removeEventListener('popstate', handlePathChange);
        document.removeEventListener('astro:page-load', handlePathChange);
      };
    }
  }, []);

  const isActive = (path: string) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath?.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.navbarFrame}>
          {/* Left: Brand Logo & Mobile Toggle */}
          <div className={styles.leftSection}>
            <button 
              className={styles.mobileMenuBtn}
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Open Navigation Drawer"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>

            <a href="/" className={styles.brandLink}>
              <div className={styles.logoImageWrapper}>
                <img
                  src="/logo.png"
                  alt="WitrQuran Logo"
                  width={42}
                  height={42}
                  className={styles.brandLogoImg}
                />
                <span className={styles.brandTitle}>WitrQuran</span>
              </div>
            </a>
          </div>

          {/* Center: Navigation Links */}
          <nav className={styles.navLinks}>
            <a href="/" className={`${styles.navLink} ${isActive('/') ? styles.activeLink : ''}`}>
              Home
            </a>
            <a href="/surahs" className={`${styles.navLink} ${isActive('/surahs') ? styles.activeLink : ''}`}>
              Surahs
            </a>
            <a href="/tools" className={`${styles.navLink} ${isActive('/tools') ? styles.activeLink : ''}`}>
              Tools
            </a>
            <a href="/about" className={`${styles.navLink} ${isActive('/about') ? styles.activeLink : ''}`}>
              About
            </a>
          </nav>

          {/* Right: Search & Start Listening Button */}
          <div className={styles.actions}>
            <button 
              className={styles.searchBtn}
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search Surahs"
              title="Search Surahs"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>

            <a href="/surahs" className={styles.startListeningBtn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              <span>Start Listening</span>
            </a>
          </div>
        </div>
      </header>

      {/* Interactive Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Drawer */}
      <SurahDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
      />
    </>
  );
}
