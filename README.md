<div align="center">

# 🕌 WitrQuran

<a href="https://witrquran.vercel.app">
  <img src="https://readme-typing-svg.demolab.com?font=Cinzel&weight=700&size=24&duration=3500&pause=1000&color=10B981&center=true&vCenter=true&width=650&lines=بِسْمِ+اللَّهِ+الرَّحْمَٰنِ+الرَّحِيمِ;Listen+to+the+Holy+Quran+with+Clarity+and+Peace;100%25+Free+•+Zero+Ads+•+Self-Hosted+Privacy;Zakat+•+Prayer+Times+•+Qibla+•+Hijri+Calendar" alt="WitrQuran Typing Animation" />
</a>

<p align="center">
  <strong>A modern, ultra-fast, ad-free sanctuary for listening to the Holy Quran and accessing precision Islamic utilities.</strong>
</p>

[![Website Status](https://img.shields.io/website?url=https%3A%2F%2Fwitrquran.vercel.app&up_message=Online&down_message=Offline&style=for-the-badge&logo=vercel&logoColor=white&color=10b981)](https://witrquran.vercel.app)
[![Astro Version](https://img.shields.io/badge/Astro-5.0+-BC52EE?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build)
[![React Version](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-F59E0B?style=for-the-badge&logo=open-source-initiative&logoColor=white)](LICENSE)
[![Zero Ads](https://img.shields.io/badge/Ads-0%25%20No%20Monetization-10b981?style=for-the-badge)](https://witrquran.vercel.app)

<br/>

[**Explore Live Website →**](https://witrquran.vercel.app) • [**Browse 114 Surahs**](https://witrquran.vercel.app/surahs) • [**Islamic Tools**](https://witrquran.vercel.app/tools) • [**Report an Issue**](https://witrquran.vercel.app/report-error)

---

</div>

## 📖 Overview

**WitrQuran** is a modern, high-performance web sanctuary engineered to bring the timeless recitation of the Holy Quran to Muslims worldwide. Built using **Astro 5 Islands Architecture**, **React 19**, and **TypeScript**, WitrQuran delivers near-instant page loads, zero client-side layout shifts, and seamless background audio playback.

We firmly believe that the **Holy Quran is a sacred gift of God to all humanity**. Therefore, WitrQuran is **100% free forever**—no subscription fees, no paywalls, no pop-ups, and zero commercial monetization.

```
                  ┌─────────────────────────────────────────┐
                  │          🕌 WitrQuran Platform          │
                  └────────────────────┬────────────────────┘
                                       │
        ┌──────────────────────────────┼──────────────────────────────┐
        ▼                              ▼                              ▼
 🎧 Quran Streamer            🧮 Islamic Utilities          🛡️ Privacy Engine
 ├─ 114 Complete Surahs       ├─ Smart Zakat Calculator     ├─ Self-Hosted Fonts
 ├─ Sheikh Al-Hussary Reciter ├─ Astronomical Prayer Times  ├─ Zero Google Tracking
 ├─ MediaSession Lockscreen   ├─ 3D Qibla Compass           └─ No Third-Party Cookies
 └─ Instant Audio Preload     └─ Umm al-Qura Hijri System
```

---

## ✨ Key Features

### 🎧 Distraction-Free Quran Audio Player
- **Complete 114 Surahs:** Full recitations by renowned master reciter *Sheikh Mahmoud Khalil Al-Hussary*.
- **Instant Playback Preloading:** Uses smart audio metadata caching so audio starts without lag.
- **System MediaSession API:** Native lockscreen, smartwatch, and vehicle Bluetooth playback controls with interactive scrubbing.
- **Floating Global Bar:** Persistent audio bar with Surah repeat toggles, sleep timer, and quick search.

### 🧭 Precision Islamic Utilities (`/tools`)
- **💰 Smart Zakat Calculator:** Instant net-wealth calculation across gold, silver, cash, investments, and trade goods with Nisab threshold benchmarks.
- **🕌 Astronomical Prayer Times:** Pinpoint Fajr, Dhuhr, Asr, Maghrib, Isha, and Tahajjud schedules for any global coordinate with live countdowns.
- **🧭 Interactive Qibla Finder:** 3D compass orientation calculating the Great Circle forward azimuth to the Kaaba in Makkah with geomagnetic declination.
- **🌙 Umm al-Qura Hijri Converter:** Dual-direction Gregorian $\leftrightarrow$ Lunar Hijri date synchronization with regional moon-sighting adjustments.

### 🛡️ Complete Privacy & Self-Hosted Typography
- **Zero Third-Party Data Leaks:** All fonts (*Plus Jakarta Sans, Inter, Playfair Display, Amiri, Cinzel*) are self-hosted locally as WOFF2 files. No user IP addresses or request headers are sent to Google CDN servers.
- **No Cookies & No Trackers:** 100% client-side computation with zero analytics surveillance.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [Astro 5](https://astro.build) | Ultra-fast Static Island Architecture with zero unnecessary JavaScript |
| **UI Library** | [React 19](https://react.dev) | Interactive audio player, search filtering, and calculator state |
| **Language** | [TypeScript](https://www.typescriptlang.org) | Strict type safety and robust data validation |
| **State Management** | [NanoStores](https://github.com/nanostores/nanostores) | Lightweight atomic state shared across isolated Astro islands |
| **Styling** | Vanilla CSS Modules | High-contrast Neo-Brutalist Islamic design with glassmorphic accents |
| **Deployment** | [Vercel](https://vercel.com) | Edge CDN static asset distribution |

---

## 🚀 Getting Started

Follow these simple steps to run WitrQuran locally on your machine:

### Prerequisites
- [Node.js](https://nodejs.org) (v18.17.0 or higher recommended)
- `npm`, `pnpm`, or `yarn`

### 1. Clone the Repository
```bash
git clone https://github.com/witrfaruk/WitrQuran.git
cd WitrQuran
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Launch Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3001` (or your configured local port).

### 4. Build for Production
```bash
npm run build
```
The optimized static build will be generated in the `./dist/` directory ready for deployment.

---

## 📂 Project Architecture

```text
WitrQuran/
├── public/
│   ├── fonts/               # Self-hosted WOFF2 fonts (Zero Google CDN leak)
│   ├── images/              # Optimized static graphics & banners
│   ├── favicon.svg          # Vector branding icons
│   └── google*.html         # Search console verification
├── src/
│   ├── components/          # Reusable Astro & React islands
│   │   ├── layout/          # Navbar, Footer, Mobile Drawer
│   │   ├── player/          # Global persistent Quran Audio Player
│   │   ├── search/          # Instant Surah filtering modal
│   │   └── tools/           # Zakat, Prayer Times, Qibla & Hijri tools
│   ├── data/                # Surahs metadata, reciters & calculation constants
│   ├── layouts/             # Master layout with SEO meta & schema tags
│   ├── pages/               # File-based routing (132 static routes)
│   │   ├── surah/[slug].astro  # Dynamic SSG Surah listening pages
│   │   ├── tools/           # Islamic utilities & educational guides
│   │   ├── index.astro      # Homepage sanctuary
│   │   ├── robots.txt.ts    # Dynamic multi-bot crawler directives
│   │   └── sitemap.xml.ts   # Auto-generating XML sitemap
│   ├── stores/              # NanoStores reactive audio state
│   └── styles/              # Global design tokens, fonts & neo-brutalist variables
├── astro.config.mjs         # Astro integration configuration
├── package.json             # Dependencies and project scripts
├── tsconfig.json            # TypeScript compiler configuration
└── LICENSE                  # MIT License & Open Source Dedication
```

---

## 🤝 Contributing

We welcome community contributions! If you have suggestions, design improvements, or bug fixes:

1. **Fork** the repository.
2. **Create a Feature Branch** (`git checkout -b feature/AmazingFeature`).
3. **Commit Your Changes** (`git commit -m "Add AmazingFeature"`).
4. **Push to the Branch** (`git push origin feature/AmazingFeature`).
5. **Open a Pull Request**.

---

## 📜 License & Dedication

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for complete details.

> *"The best of you are those who learn the Quran and teach it."* — **Sahih al-Bukhari 5027**

<div align="center">
  <br/>
  <sub>Handcrafted with devotion by <a href="https://witrfaruk.vercel.app/social">Faruk</a> for the global Muslim Ummah.</sub>
</div>
