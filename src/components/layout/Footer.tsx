import React from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Top 4 Columns */}
      <div className={`container ${styles.footerGrid}`}>
        {/* Column 1: Brand & Description */}
        <div className={styles.brandCol}>
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
          <p className={styles.brandDescription}>
            A simple, peaceful and uninterrupted Holy Quran listening experience. Free, open source and ad-free forever.
          </p>
          <a
            href="https://github.com/witrfaruk/WitrQuran"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.openSourceBadgeBtn}
            title="100% Free & Open Source on GitHub"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span>Open Source</span>
            <span className={styles.mitPill}>MIT</span>
          </a>
        </div>

        {/* Column 2: Navigation */}
        <div className={styles.navCol}>
          <h4 className={styles.colTitle}>Navigation</h4>
          <ul className={styles.linkList}>
            <li><a href="/" className={styles.link}>Home</a></li>
            <li><a href="/surahs" className={styles.link}>All Surahs</a></li>
            <li><a href="/tools" className={styles.link}>Islamic Tools</a></li>
            <li><a href="/about" className={styles.link}>About Us</a></li>
            <li><a href="/open-source" className={styles.link}>Open Source</a></li>
            <li><a href="/founder" className={styles.link}>The Founder</a></li>
          </ul>
        </div>

        {/* Column 3: Support & Feedback */}
        <div className={styles.navCol}>
          <h4 className={styles.colTitle}>Support & Help</h4>
          <ul className={styles.linkList}>
            <li><a href="/contact" className={styles.link}>Contact Us</a></li>
            <li><a href="/report-error" className={styles.link}>Report an Error</a></li>
            <li><a href="https://github.com/witrfaruk/WitrQuran" target="_blank" rel="noopener noreferrer" className={styles.link}>GitHub Repository</a></li>
            <li><a href="https://github.com/witrfaruk/WitrQuran/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className={styles.link}>MIT License</a></li>
          </ul>
        </div>

        {/* Column 4: Legal & Policies */}
        <div className={styles.navCol}>
          <h4 className={styles.colTitle}>Legal & Policies</h4>
          <ul className={styles.linkList}>
            <li><a href="/terms" className={styles.link}>Terms of Use</a></li>
            <li><a href="/privacy" className={styles.link}>Privacy Policy</a></li>
            <li><a href="/cookies" className={styles.link}>Cookie Policy</a></li>
            <li><a href="/disclaimer" className={styles.link}>Disclaimer</a></li>
            <li><a href="/copyright" className={styles.link}>Copyright Policy</a></li>
          </ul>
        </div>
      </div>

      {/* Stay Connected (Email & Website & Social Links) */}
      <div className={styles.socialSection}>
        <span className={styles.socialTitle}>Stay Connected</span>
        <div className={styles.socialRow}>
          {/* Website Link */}
          <a
            href="https://witrfaruk.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialIconBtn}
            title="Founder Website"
            aria-label="Founder Website"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
          </a>

          {/* Email Link */}
          <a
            href="mailto:witrfaruk@proton.me"
            className={styles.socialIconBtn}
            title="Email: witrfaruk@proton.me"
            aria-label="Email"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/witrfaruk/WitrQuran"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialIconBtn}
            title="GitHub Repository"
            aria-label="GitHub"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/witrfaruk"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialIconBtn}
            title="LinkedIn"
            aria-label="LinkedIn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/witrfaruk"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialIconBtn}
            title="Instagram"
            aria-label="Instagram"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>

          {/* X / Twitter */}
          <a
            href="https://x.com/witrfaruk"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialIconBtn}
            title="X (Twitter)"
            aria-label="X (Twitter)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Bottom Bar - Open Source Notice & Tech Tagline */}
      <div className={styles.bottomBar}>
        <div className={`container ${styles.bottomContent}`}>
          <p className={styles.openSourceNotice}>
            Released under the <strong>MIT License</strong> · Open-Source Project by <strong>Md Faruk Abdulla</strong>
          </p>
          <span className={styles.subTagline}>
            Built for Speed, AI Agents &amp; Search Precision
          </span>
        </div>
      </div>

      {/* Giant Branding Watermark "Witr Quran" (Placed Below at Footer Bottom) */}
      <div className={styles.watermarkContainer} aria-hidden="true">
        <span className={styles.watermarkText}>Witr Quran</span>
      </div>
    </footer>
  );
}
