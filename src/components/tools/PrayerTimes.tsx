'use client';

import React, { useState, useEffect, useMemo } from 'react';
import styles from './PrayerTimes.module.css';

interface CityPreset {
  name: string;
  country: string;
  lat: number;
  lng: number;
  timezone: number;
}

const CITIES: CityPreset[] = [
  { name: 'Makkah', country: 'Saudi Arabia', lat: 21.4225, lng: 39.8262, timezone: 3 },
  { name: 'Madinah', country: 'Saudi Arabia', lat: 24.4672, lng: 39.6111, timezone: 3 },
  { name: 'Jerusalem', country: 'Palestine', lat: 31.7683, lng: 35.2137, timezone: 2 },
  { name: 'Cairo', country: 'Egypt', lat: 30.0444, lng: 31.2357, timezone: 2 },
  { name: 'Istanbul', country: 'Turkey', lat: 41.0082, lng: 28.9784, timezone: 3 },
  { name: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278, timezone: 0 },
  { name: 'New York', country: 'United States', lat: 40.7128, lng: -74.006, timezone: -5 },
  { name: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832, timezone: -5 },
  { name: 'Dubai', country: 'United Arab Emirates', lat: 25.2048, lng: 55.2708, timezone: 4 },
  { name: 'Karachi', country: 'Pakistan', lat: 24.8607, lng: 67.0011, timezone: 5 },
  { name: 'Dhaka', country: 'Bangladesh', lat: 23.8103, lng: 90.4125, timezone: 6 },
  { name: 'Kuala Lumpur', country: 'Malaysia', lat: 3.139, lng: 101.6869, timezone: 8 },
  { name: 'Jakarta', country: 'Indonesia', lat: -6.2088, lng: 106.8456, timezone: 7 },
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, timezone: 10 },
  { name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522, timezone: 1 },
];

const PRAYER_ICONS: Record<string, string> = {
  fajr: '🌄',
  sunrise: '🌅',
  dhuhr: '☀️',
  asr: '🌤️',
  maghrib: '🌇',
  isha: '🌌',
};

const PRAYER_COLORS: Record<string, string> = {
  fajr: 'rgba(56, 189, 248, 0.15)',
  sunrise: 'rgba(251, 191, 36, 0.15)',
  dhuhr: 'rgba(234, 179, 8, 0.15)',
  asr: 'rgba(249, 115, 22, 0.15)',
  maghrib: 'rgba(244, 63, 94, 0.15)',
  isha: 'rgba(129, 140, 248, 0.15)',
};

export default function PrayerTimes() {
  const [selectedCityIndex, setSelectedCityIndex] = useState<number>(0);
  const [customLat, setCustomLat] = useState<number | null>(null);
  const [customLng, setCustomLng] = useState<number | null>(null);
  const [customName, setCustomName] = useState<string>('');
  const [calculationMethod, setCalculationMethod] = useState<'MWL' | 'ISNA' | 'UmmAlQura' | 'Karachi'>('MWL');
  const [asrJuristic, setAsrJuristic] = useState<'Standard' | 'Hanafi'>('Standard');
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeCity = useMemo(() => {
    if (customLat !== null && customLng !== null) {
      const offsetHours = -new Date().getTimezoneOffset() / 60;
      return {
        name: customName || 'Current Location',
        country: 'GPS Detected',
        lat: customLat,
        lng: customLng,
        timezone: offsetHours,
      };
    }
    return CITIES[selectedCityIndex] || CITIES[0];
  }, [selectedCityIndex, customLat, customLng, customName]);

  const handleUseGeolocation = () => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCustomLat(pos.coords.latitude);
          setCustomLng(pos.coords.longitude);
          setCustomName('My Location (GPS)');
        },
        (err) => {
          alert('Could not retrieve geolocation: ' + err.message);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  // Astronomical calculation algorithm
  const prayerTimes = useMemo(() => {
    const { lat, lng, timezone } = activeCity;
    const date = now;
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // Day of Year
    const N = Math.floor(275 * month / 9) - 2 * Math.floor((month + 9) / 12) + day - 30;
    
    // Sun declination & Equation of time
    const B = (2 * Math.PI * (N - 81)) / 365;
    const EoT = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B); // in minutes
    const declination = 23.45 * Math.sin(2 * Math.PI * (284 + N) / 365) * (Math.PI / 180); // in radians
    const latRad = lat * (Math.PI / 180);

    // Solar Noon (Dhuhr)
    const solarNoonHours = 12 + timezone - (lng / 15) - (EoT / 60);

    // Hour angle helper
    const getHourAngle = (alphaDeg: number) => {
      const alphaRad = alphaDeg * (Math.PI / 180);
      const cosH = (Math.sin(alphaRad) - Math.sin(latRad) * Math.sin(declination)) / (Math.cos(latRad) * Math.cos(declination));
      if (cosH > 1) return 0;
      if (cosH < -1) return Math.PI;
      return Math.acos(cosH);
    };

    // Calculation Method Angles
    let fajrAngle = -18;
    let ishaAngle = -17;
    let ishaFixedMinutes = 0;

    if (calculationMethod === 'ISNA') {
      fajrAngle = -15;
      ishaAngle = -15;
    } else if (calculationMethod === 'Karachi') {
      fajrAngle = -18;
      ishaAngle = -18;
    } else if (calculationMethod === 'UmmAlQura') {
      fajrAngle = -18.5;
      ishaFixedMinutes = 90;
    }

    // Sunrise & Sunset: alpha = -0.8333°
    const H_sun = getHourAngle(-0.8333);
    const sunHalfDayHours = (H_sun * (180 / Math.PI)) / 15;

    const sunriseHours = solarNoonHours - sunHalfDayHours;
    const maghribHours = solarNoonHours + sunHalfDayHours;

    // Fajr
    const H_fajr = getHourAngle(fajrAngle);
    const fajrHours = solarNoonHours - (H_fajr * (180 / Math.PI)) / 15;

    // Asr calculation
    const t = asrJuristic === 'Hanafi' ? 2 : 1;
    const asrAltitudeRad = Math.atan(1 / (t + Math.tan(Math.abs(latRad - declination))));
    const asrAltitudeDeg = asrAltitudeRad * (180 / Math.PI);
    const H_asr = getHourAngle(asrAltitudeDeg);
    const asrHours = solarNoonHours + (H_asr * (180 / Math.PI)) / 15;

    // Isha
    let ishaHours = 0;
    if (ishaFixedMinutes > 0) {
      ishaHours = maghribHours + (ishaFixedMinutes / 60);
    } else {
      const H_isha = getHourAngle(ishaAngle);
      ishaHours = solarNoonHours + (H_isha * (180 / Math.PI)) / 15;
    }

    const toTimeString = (decimalHours: number) => {
      let h = Math.floor(decimalHours);
      let m = Math.round((decimalHours - h) * 60);
      if (m === 60) {
        h += 1;
        m = 0;
      }
      h = (h + 24) % 24;
      const period = h >= 12 ? 'PM' : 'AM';
      const displayHours = h % 12 === 0 ? 12 : h % 12;
      const displayMins = m.toString().padStart(2, '0');
      return {
        formatted: `${displayHours}:${displayMins} ${period}`,
        hours24: h,
        minutes: m,
        totalSeconds: h * 3600 + m * 60,
      };
    };

    return [
      { id: 'fajr', nameEn: 'Fajr', nameAr: 'الفجر', type: 'prayer', ...toTimeString(fajrHours) },
      { id: 'sunrise', nameEn: 'Sunrise', nameAr: 'الشروق', type: 'event', ...toTimeString(sunriseHours) },
      { id: 'dhuhr', nameEn: 'Dhuhr', nameAr: 'الظهر', type: 'prayer', ...toTimeString(solarNoonHours) },
      { id: 'asr', nameEn: 'Asr', nameAr: 'العصر', type: 'prayer', ...toTimeString(asrHours) },
      { id: 'maghrib', nameEn: 'Maghrib', nameAr: 'المغرب', type: 'prayer', ...toTimeString(maghribHours) },
      { id: 'isha', nameEn: 'Isha', nameAr: 'العشاء', type: 'prayer', ...toTimeString(ishaHours) },
    ];
  }, [activeCity, now, calculationMethod, asrJuristic]);

  // Current time in seconds of day
  const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  // Find next prayer and countdown
  const { nextPrayer, timeUntilSeconds, activePrayerId } = useMemo(() => {
    let next = prayerTimes.find((p) => p.totalSeconds > currentSeconds);
    let diff = 0;
    let activeId = 'isha';

    if (next) {
      diff = next.totalSeconds - currentSeconds;
      const nextIndex = prayerTimes.findIndex((p) => p.id === next?.id);
      activeId = nextIndex > 0 ? prayerTimes[nextIndex - 1].id : 'isha';
    } else {
      next = prayerTimes[0];
      diff = (24 * 3600 - currentSeconds) + next.totalSeconds;
      activeId = 'isha';
    }

    return { nextPrayer: next, timeUntilSeconds: diff, activePrayerId: activeId };
  }, [prayerTimes, currentSeconds]);

  // Calculate Tahajjud & Last Third of Night
  const lastThirdInfo = useMemo(() => {
    const maghrib = prayerTimes.find((p) => p.id === 'maghrib');
    const fajr = prayerTimes.find((p) => p.id === 'fajr');
    if (!maghrib || !fajr) return null;

    let nightDurationSec = (24 * 3600 - maghrib.totalSeconds) + fajr.totalSeconds;
    let oneThirdSec = Math.floor(nightDurationSec / 3);
    let lastThirdStartSec = (maghrib.totalSeconds + (2 * oneThirdSec)) % (24 * 3600);

    let h = Math.floor(lastThirdStartSec / 3600);
    let m = Math.floor((lastThirdStartSec % 3600) / 60);
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHours = h % 12 === 0 ? 12 : h % 12;
    const displayMins = m.toString().padStart(2, '0');

    return `${displayHours}:${displayMins} ${period}`;
  }, [prayerTimes]);

  const formatCountdown = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.prayerCard}>
      {/* Top Controls: City Selection & Location */}
      <div className={styles.topControls}>
        <div className={styles.locationGroup}>
          <select
            value={customLat !== null ? 'custom' : selectedCityIndex}
            onChange={(e) => {
              if (e.target.value === 'custom') return;
              setCustomLat(null);
              setCustomLng(null);
              setSelectedCityIndex(parseInt(e.target.value, 10));
            }}
            className={styles.selectInput}
          >
            {customLat !== null && (
              <option value="custom">📍 {customName || 'Custom Location'}</option>
            )}
            {CITIES.map((c, idx) => (
              <option key={c.name} value={idx}>
                {c.name}, {c.country}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleUseGeolocation}
            className={styles.geoBtn}
            title="Detect your exact location with GPS"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
            </svg>
            <span>Auto-Detect GPS</span>
          </button>
        </div>

        <div className={styles.liveClockBadge}>
          <span className={styles.clockIcon}>🕒</span>
          <span className={styles.clockText}>
            {now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
          <span className={styles.dateText}>
            · {now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Quick City Presets Infinite Horizontal Scrolling Bar */}
      <div className={styles.marqueeContainer}>
        <div className={styles.marqueeTrack}>
          {[...CITIES, ...CITIES].map((c, idx) => {
            const realIdx = idx % CITIES.length;
            const isSelected = selectedCityIndex === realIdx && customLat === null;
            return (
              <button
                key={`${c.name}-${idx}`}
                type="button"
                className={`${styles.cityChip} ${isSelected ? styles.cityChipActive : ''}`}
                onClick={() => {
                  setCustomLat(null);
                  setCustomLng(null);
                  setSelectedCityIndex(realIdx);
                }}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Next Prayer Countdown Hero Banner */}
      <div className={styles.nextPrayerBanner}>
        <div className={styles.nextPrayerInfo}>
          <div className={styles.nextPrayerTag}>
            <span className={styles.livePulseDot} />
            <span>Upcoming Salah</span>
          </div>
          <h2 className={styles.nextPrayerName}>
            {nextPrayer.nameEn} <span className={styles.nextPrayerArabic}>({nextPrayer.nameAr})</span>
          </h2>
          <span className={styles.nextPrayerTimeText}>
            Adhan at <strong>{nextPrayer.formatted}</strong> for {activeCity.name}
          </span>
        </div>

        <div className={styles.countdownBlock}>
          <span className={styles.countdownLabel}>Time Remaining</span>
          <span className={styles.countdownValue}>{formatCountdown(timeUntilSeconds)}</span>
        </div>
      </div>

      {/* 6 Prayer Checkpoint Cards Grid */}
      <div className={styles.prayersGrid}>
        {prayerTimes.map((prayer) => {
          const isActive = prayer.id === activePrayerId;
          return (
            <div
              key={prayer.id}
              className={`${styles.prayerBox} ${isActive ? styles.prayerBoxActive : ''}`}
              style={{
                background: isActive ? undefined : PRAYER_COLORS[prayer.id],
              }}
            >
              <div className={styles.cardTopRow}>
                <span className={styles.prayerIcon}>{PRAYER_ICONS[prayer.id]}</span>
                {prayer.id === 'sunrise' && <span className={styles.eventBadge}>Event</span>}
              </div>
              <span className={styles.prayerNameEn}>{prayer.nameEn}</span>
              <span className={styles.prayerNameAr}>{prayer.nameAr}</span>
              <span className={styles.prayerTimeValue}>{prayer.formatted}</span>
            </div>
          );
        })}
      </div>

      {/* Tahajjud & Celestial Windows Callout */}
      {lastThirdInfo && (
        <div className={styles.tahajjudCard}>
          <div className={styles.tahajjudLeft}>
            <span className={styles.tahajjudIcon}>🌌</span>
            <div>
              <h4 className={styles.tahajjudTitle}>Last Third of the Night (Qiyam al-Layl &amp; Tahajjud)</h4>
              <p className={styles.tahajjudSub}>The most spiritually blessed hour for accepted Du'a &amp; Istighfar.</p>
            </div>
          </div>
          <div className={styles.tahajjudTimeBadge}>
            <span className={styles.tahajjudLabel}>Starts Around</span>
            <span className={styles.tahajjudTime}>{lastThirdInfo}</span>
          </div>
        </div>
      )}

      {/* Bottom Jurisprudence & Method Configuration */}
      <div className={styles.settingsBar}>
        <div className={styles.settingItem}>
          <label htmlFor="methodSelect" className={styles.settingLabel}>
            <span>📐 Calculation Method:</span>
          </label>
          <select
            id="methodSelect"
            value={calculationMethod}
            onChange={(e: any) => setCalculationMethod(e.target.value)}
            className={styles.selectInput}
          >
            <option value="MWL">Muslim World League (MWL - 18°/17°)</option>
            <option value="ISNA">ISNA North America (15°/15°)</option>
            <option value="UmmAlQura">Umm Al-Qura (Makkah - 18.5°/90min)</option>
            <option value="Karachi">Univ. of Islamic Sciences Karachi (18°/18°)</option>
          </select>
        </div>

        <div className={styles.settingItem}>
          <label htmlFor="asrSelect" className={styles.settingLabel}>
            <span>⚖️ Asr Juristic Shadow:</span>
          </label>
          <select
            id="asrSelect"
            value={asrJuristic}
            onChange={(e: any) => setAsrJuristic(e.target.value)}
            className={styles.selectInput}
          >
            <option value="Standard">Standard (Shafi'i, Maliki, Hanbali - 1x Shadow)</option>
            <option value="Hanafi">Hanafi (2x Shadow Length)</option>
          </select>
        </div>
      </div>
    </div>
  );
}

