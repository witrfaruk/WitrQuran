'use client';

import React, { useState, useEffect, useMemo } from 'react';
import styles from './QiblaFinder.module.css';

interface CityCoord {
  name: string;
  country: string;
  lat: number;
  lng: number;
}

const CITIES: CityCoord[] = [
  { name: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278 },
  { name: 'New York', country: 'United States', lat: 40.7128, lng: -74.006 },
  { name: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832 },
  { name: 'Cairo', country: 'Egypt', lat: 30.0444, lng: 31.2357 },
  { name: 'Istanbul', country: 'Turkey', lat: 41.0082, lng: 28.9784 },
  { name: 'Dubai', country: 'United Arab Emirates', lat: 25.2048, lng: 55.2708 },
  { name: 'Karachi', country: 'Pakistan', lat: 24.8607, lng: 67.0011 },
  { name: 'Dhaka', country: 'Bangladesh', lat: 23.8103, lng: 90.4125 },
  { name: 'Kuala Lumpur', country: 'Malaysia', lat: 3.139, lng: 101.6869 },
  { name: 'Jakarta', country: 'Indonesia', lat: -6.2088, lng: 106.8456 },
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093 },
  { name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 },
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503 },
  { name: 'Johannesburg', country: 'South Africa', lat: -26.2041, lng: 28.0473 },
  { name: 'Los Angeles', country: 'United States', lat: 34.0522, lng: -118.2437 },
];

// Coordinates of the Holy Kaaba in Makkah al-Mukarramah
const KAABA_LAT = 21.422487;
const KAABA_LNG = 39.826206;

export default function QiblaFinder() {
  const [selectedCityIdx, setSelectedCityIdx] = useState<number>(0);
  const [customLat, setCustomLat] = useState<number | null>(null);
  const [customLng, setCustomLng] = useState<number | null>(null);
  const [customLocationName, setCustomLocationName] = useState<string>('');
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);

  // Device orientation listener for mobile compass
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.webkitCompassHeading !== undefined) {
        setDeviceHeading(Math.round(e.webkitCompassHeading));
      } else if (e.alpha !== null) {
        setDeviceHeading(Math.round((360 - e.alpha) % 360));
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }
    return () => {
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleOrientation, true);
      }
    };
  }, []);

  const activeLocation = useMemo(() => {
    if (customLat !== null && customLng !== null) {
      return {
        name: customLocationName || 'Current Location (GPS)',
        country: 'Detected Coordinates',
        lat: customLat,
        lng: customLng,
      };
    }
    return CITIES[selectedCityIdx] || CITIES[0];
  }, [selectedCityIdx, customLat, customLng, customLocationName]);

  const handleUseGeolocation = () => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCustomLat(pos.coords.latitude);
          setCustomLng(pos.coords.longitude);
          setCustomLocationName('My Location (GPS)');
        },
        (err) => {
          alert('Could not get geolocation: ' + err.message);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  // Calculate Forward Azimuth & Great Circle Distance
  const { qiblaAngle, distanceKm, distanceMiles, cardinalDirection } = useMemo(() => {
    const lat1 = activeLocation.lat * (Math.PI / 180);
    const lng1 = activeLocation.lng * (Math.PI / 180);
    const lat2 = KAABA_LAT * (Math.PI / 180);
    const lng2 = KAABA_LNG * (Math.PI / 180);

    const deltaLng = lng2 - lng1;

    // Forward Azimuth formula:
    // θ = atan2( sin Δλ · cos φ₂, cos φ₁ · sin φ₂ − sin φ₁ · cos φ₂ · cos Δλ )
    const y = Math.sin(deltaLng) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLng);
    let bearingRad = Math.atan2(y, x);
    let bearingDeg = (bearingRad * (180 / Math.PI) + 360) % 360;

    // Great Circle Distance via Haversine
    const R = 6371; // Earth radius in km
    const dLat = lat2 - lat1;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distKm = R * c;
    const distMi = distKm * 0.621371;

    // Convert bearing to 16-wind cardinal
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const idx = Math.round(bearingDeg / 22.5) % 16;

    return {
      qiblaAngle: parseFloat(bearingDeg.toFixed(1)),
      distanceKm: Math.round(distKm),
      distanceMiles: Math.round(distMi),
      cardinalDirection: directions[idx],
    };
  }, [activeLocation]);

  const needleRotation = deviceHeading !== null ? (qiblaAngle - deviceHeading + 360) % 360 : qiblaAngle;
  const isAligned = deviceHeading !== null && Math.abs(needleRotation) < 5;

  return (
    <div className={styles.qiblaCard}>
      {/* Top Location Selection Bar */}
      <div className={styles.topControls}>
        <div className={styles.locationGroup}>
          <select
            value={customLat !== null ? 'custom' : selectedCityIdx}
            onChange={(e) => {
              if (e.target.value === 'custom') return;
              setCustomLat(null);
              setCustomLng(null);
              setSelectedCityIdx(parseInt(e.target.value, 10));
            }}
            className={styles.selectInput}
          >
            {customLat !== null && (
              <option value="custom">📍 {customLocationName || 'Custom Location'}</option>
            )}
            {CITIES.map((c, i) => (
              <option key={c.name} value={i}>
                {c.name}, {c.country}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleUseGeolocation}
            className={styles.geoBtn}
            title="Auto-detect coordinates via GPS"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
            </svg>
            <span>Auto-Detect GPS</span>
          </button>
        </div>

        <div className={styles.kaabaCoordBadge}>
          <span className={styles.kaabaBadgeIcon}>🕋</span>
          <span>Kaaba: 21.4225° N, 39.8262° E</span>
        </div>
      </div>

      {/* Quick City Presets Infinite Horizontal Scrolling Bar */}
      <div className={styles.marqueeContainer}>
        <div className={styles.marqueeTrack}>
          {[...CITIES, ...CITIES].map((c, idx) => {
            const realIdx = idx % CITIES.length;
            const isSelected = selectedCityIdx === realIdx && customLat === null;
            return (
              <button
                key={`${c.name}-${idx}`}
                type="button"
                className={`${styles.cityChip} ${isSelected ? styles.cityChipActive : ''}`}
                onClick={() => {
                  setCustomLat(null);
                  setCustomLng(null);
                  setSelectedCityIdx(realIdx);
                }}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Compass and Stats Grid */}
      <div className={styles.mainGrid}>
        {/* Left: Visual Interactive Compass */}
        <div className={styles.compassWrapper}>
          <div className={`${styles.compassOuterBezel} ${isAligned ? styles.compassAligned : ''}`}>
            {/* Degree Ticks */}
            <div className={styles.degreeTicks} />

            {/* Inner Ring Glow */}
            <div className={styles.innerRing} />

            {/* Cardinal Points */}
            <div className={styles.cardinalPoints}>
              <span className={styles.cardinalN}>N</span>
              <span className={styles.cardinalNE}>NE</span>
              <span className={styles.cardinalE}>E</span>
              <span className={styles.cardinalSE}>SE</span>
              <span className={styles.cardinalS}>S</span>
              <span className={styles.cardinalSW}>SW</span>
              <span className={styles.cardinalW}>W</span>
              <span className={styles.cardinalNW}>NW</span>
            </div>

            {/* Rotating Qibla Needle Pointer */}
            <div
              className={styles.needleGroup}
              style={{ transform: `rotate(${needleRotation}deg)` }}
            >
              <div className={styles.kaabaPointer}>
                <div className={styles.kaabaIconBox}>
                  <span style={{ fontSize: '16px', lineHeight: 1 }}>🕋</span>
                </div>
                <div className={styles.needleLine} />
              </div>
            </div>

            {/* Center Hub */}
            <div className={styles.compassCenterHub}>
              <div className={styles.compassCenterCore} />
            </div>
          </div>

          <div className={styles.compassStatusNotice}>
            {isAligned ? (
              <span className={styles.alignedBadge}>
                ✨ Perfectly Aligned with the Holy Kaaba!
              </span>
            ) : deviceHeading !== null ? (
              <span className={styles.headingBadge}>
                📱 Phone Heading: {deviceHeading}° · Rotate until needle points straight up (0°)
              </span>
            ) : (
              <p className={styles.compassInstruction}>
                🧭 Angle measured clockwise from True North (0°). Point your phone or physical compass toward North to align with the golden Kaaba pointer.
              </p>
            )}
          </div>
        </div>

        {/* Right: Primary Stats & Distance */}
        <div className={styles.statsBox}>
          <div className={styles.primaryStatCard}>
            <div className={styles.statTopBadgeRow}>
              <span className={styles.statTag}>Exact Qibla Bearing</span>
              <span className={styles.cardinalPill}>{cardinalDirection} Direction</span>
            </div>
            <div className={styles.statAngleValue}>{qiblaAngle}°</div>
            <span className={styles.statAngleSub}>
              From <strong>{activeLocation.name}</strong>, turn <strong>{qiblaAngle}° clockwise</strong> from True North directly facing the Holy Kaaba in Makkah.
            </span>
          </div>

          <div className={styles.secondaryStatsGrid}>
            <div className={styles.subStatItem}>
              <div className={styles.subStatHeader}>
                <span className={styles.subStatIcon}>📏</span>
                <span className={styles.subStatLabel}>Distance to Makkah</span>
              </div>
              <span className={styles.subStatValue}>{distanceKm.toLocaleString()} km</span>
              <span className={styles.subStatSub}>({distanceMiles.toLocaleString()} miles)</span>
            </div>

            <div className={styles.subStatItem}>
              <div className={styles.subStatHeader}>
                <span className={styles.subStatIcon}>🧭</span>
                <span className={styles.subStatLabel}>Cardinal Direction</span>
              </div>
              <span className={styles.subStatValue}>{cardinalDirection}</span>
              <span className={styles.subStatSub}>Azimuth: {qiblaAngle}°</span>
            </div>

            <div className={styles.subStatItem}>
              <div className={styles.subStatHeader}>
                <span className={styles.subStatIcon}>🌐</span>
                <span className={styles.subStatLabel}>Your Latitude</span>
              </div>
              <span className={styles.subStatValue}>{activeLocation.lat.toFixed(4)}°</span>
              <span className={styles.subStatSub}>{activeLocation.lat >= 0 ? 'North' : 'South'}</span>
            </div>

            <div className={styles.subStatItem}>
              <div className={styles.subStatHeader}>
                <span className={styles.subStatIcon}>📍</span>
                <span className={styles.subStatLabel}>Your Longitude</span>
              </div>
              <span className={styles.subStatValue}>{activeLocation.lng.toFixed(4)}°</span>
              <span className={styles.subStatSub}>{activeLocation.lng >= 0 ? 'East' : 'West'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

