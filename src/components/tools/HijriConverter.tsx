'use client';

import React, { useState, useMemo } from 'react';
import styles from './HijriConverter.module.css';

interface HijriMonth {
  id: number;
  en: string;
  ar: string;
  isSacred?: boolean;
}

const HIJRI_MONTHS: HijriMonth[] = [
  { id: 1, en: 'Muharram', ar: 'المُحَرَّم', isSacred: true },
  { id: 2, en: 'Safar', ar: 'صَفَر' },
  { id: 3, en: "Rabi' al-Awwal", ar: 'رَبِيع الأَوَّل' },
  { id: 4, en: "Rabi' al-Thani", ar: 'رَبِيع الآخِر' },
  { id: 5, en: 'Jumada al-Awwal', ar: 'جُمَادَى الأُولَى' },
  { id: 6, en: 'Jumada al-Thani', ar: 'جُمَادَى الآخِرَة' },
  { id: 7, en: 'Rajab', ar: 'رَجَب', isSacred: true },
  { id: 8, en: "Sha'ban", ar: 'شَعْبَان' },
  { id: 9, en: 'Ramadan', ar: 'رَمَضَان' },
  { id: 10, en: 'Shawwal', ar: 'شَوَّال' },
  { id: 11, en: "Dhul-Qi'dah", ar: 'ذُو القَعْدَة', isSacred: true },
  { id: 12, en: 'Dhul-Hijjah', ar: 'ذُو الحِجَّة', isSacred: true },
];

const DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAYS_AR = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

interface IslamicHoliday {
  name: string;
  arName: string;
  hijriDate: string;
  description: string;
  icon: string;
}

const KEY_HOLIDAYS: IslamicHoliday[] = [
  { name: 'Islamic New Year', arName: 'رأس السنة الهجرية', hijriDate: '1 Muharram', description: 'Beginning of the new Hijri lunar calendar year.', icon: '🌙' },
  { name: 'Day of Ashura', arName: 'يوم عاشوراء', hijriDate: '10 Muharram', description: 'Day Musa (AS) and Bani Israel were saved from Pharaoh.', icon: '🌊' },
  { name: 'Mawlid an-Nabi', arName: 'المولد النبوي', hijriDate: "12 Rabi' al-Awwal", description: 'Commemoration of the birth of Prophet Muhammad ﷺ.', icon: '✨' },
  { name: 'Isra & Mi\'raj', arName: 'الإسراء والمعراج', hijriDate: '27 Rajab', description: 'The miraculous night journey and heavenly ascension.', icon: '🌌' },
  { name: '1st Day of Ramadan', arName: 'أول رمضان', hijriDate: '1 Ramadan', description: 'Beginning of the sacred month of fasting and revelation.', icon: '📖' },
  { name: 'Laylat al-Qadr', arName: 'ليلة القدر', hijriDate: '27 Ramadan (odd nights)', description: 'The Night of Decree, better than a thousand months.', icon: '⭐' },
  { name: 'Eid al-Fitr', arName: 'عيد الفطر', hijriDate: '1 Shawwal', description: 'Celebration marking the conclusion of Ramadan fasting.', icon: '🎉' },
  { name: 'Day of Arafah', arName: 'يوم عرفة', hijriDate: '9 Dhul-Hijjah', description: 'The greatest day of Hajj; expiation for two years of sins.', icon: '🕋' },
  { name: 'Eid al-Adha', arName: 'عيد الأضحى', hijriDate: '10 Dhul-Hijjah', description: 'Feast of Sacrifice commemorating Ibrahim (AS).', icon: '🐑' },
];

// Gregorian Date to Julian Day Number
function gregorianToJD(year: number, month: number, day: number): number {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

// Julian Day Number to Gregorian Date
function jdToGregorian(jd: number) {
  const z = Math.floor(jd + 0.5);
  const f = jd + 0.5 - z;
  let alpha = Math.floor((z - 1867216.25) / 36524.25);
  let a = z + 1 + alpha - Math.floor(alpha / 4);
  let b = a + 1524;
  let c = Math.floor((b - 122.1) / 365.25);
  let d = Math.floor(365.25 * c);
  let e = Math.floor((b - d) / 30.6001);
  let day = Math.floor(b - d - Math.floor(30.6001 * e) + f);
  let month = e < 14 ? e - 1 : e - 13;
  let year = month > 2 ? c - 4716 : c - 4715;
  return { year, month, day };
}

// Gregorian Date to Hijri
function gregorianToHijri(gYear: number, gMonth: number, gDay: number, adjustment = 0) {
  const jd = gregorianToJD(gYear, gMonth, gDay) + adjustment;
  const l = Math.floor(jd) - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j =
    Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) +
    Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
  const l3 =
    l2 -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;
  const month = Math.floor((24 * l3) / 709);
  const day = l3 - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;

  const dayOfWeekIdx = Math.floor(jd + 1.5) % 7;
  return {
    hYear: year,
    hMonth: month,
    hDay: day,
    dayNameEn: DAYS_EN[dayOfWeekIdx],
    dayNameAr: DAYS_AR[dayOfWeekIdx],
  };
}

// Hijri Date to Gregorian
function hijriToGregorian(hYear: number, hMonth: number, hDay: number, adjustment = 0) {
  const jd =
    Math.floor((11 * hYear + 3) / 30) +
    354 * hYear +
    30 * hMonth -
    Math.floor((hMonth - 1) / 2) +
    hDay +
    1948440 -
    385 -
    adjustment;
  const g = jdToGregorian(jd);
  const dayOfWeekIdx = Math.floor(jd + 1.5) % 7;
  return {
    gYear: g.year,
    gMonth: g.month,
    gDay: g.day,
    dayNameEn: DAYS_EN[dayOfWeekIdx],
    dayNameAr: DAYS_AR[dayOfWeekIdx],
  };
}

export default function HijriConverter() {
  const [mode, setMode] = useState<'g2h' | 'h2g'>('g2h');
  const [adjustment, setAdjustment] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  // G2H inputs
  const [selectedGDate, setSelectedGDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  // H2G inputs
  const todayH = useMemo(() => {
    const today = new Date();
    return gregorianToHijri(today.getFullYear(), today.getMonth() + 1, today.getDate(), adjustment);
  }, [adjustment]);

  const [inputHYear, setInputHYear] = useState<number>(todayH.hYear);
  const [inputHMonth, setInputHMonth] = useState<number>(todayH.hMonth);
  const [inputHDay, setInputHDay] = useState<number>(todayH.hDay);

  // Result G2H
  const g2hResult = useMemo(() => {
    if (!selectedGDate) return null;
    const [y, m, d] = selectedGDate.split('-').map(Number);
    const h = gregorianToHijri(y, m, d, adjustment);
    const monthObj = HIJRI_MONTHS.find((item) => item.id === h.hMonth) || HIJRI_MONTHS[0];
    return { ...h, monthObj };
  }, [selectedGDate, adjustment]);

  // Result H2G
  const h2gResult = useMemo(() => {
    const g = hijriToGregorian(inputHYear, inputHMonth, inputHDay, adjustment);
    const monthObj = HIJRI_MONTHS.find((item) => item.id === inputHMonth) || HIJRI_MONTHS[0];
    const gDateObj = new Date(g.gYear, g.gMonth - 1, g.gDay);
    return { ...g, monthObj, gDateObj };
  }, [inputHYear, inputHMonth, inputHDay, adjustment]);

  const handleCopyDate = () => {
    let textToCopy = '';
    if (mode === 'g2h' && g2hResult) {
      textToCopy = `${g2hResult.dayNameEn}, ${g2hResult.hDay} ${g2hResult.monthObj.en} ${g2hResult.hYear} AH (${g2hResult.hDay} ${g2hResult.monthObj.ar} ${g2hResult.hYear} هـ)`;
    } else if (mode === 'h2g' && h2gResult) {
      textToCopy = `${h2gResult.dayNameEn}, ${h2gResult.gDateObj.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}`;
    }

    if (textToCopy && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSetToday = () => {
    const today = new Date();
    setSelectedGDate(today.toISOString().split('T')[0]);
    setInputHYear(todayH.hYear);
    setInputHMonth(todayH.hMonth);
    setInputHDay(todayH.hDay);
  };

  return (
    <div className={styles.converterCard}>
      {/* Today's Live Hijri Date Banner */}
      <div className={styles.todayBanner}>
        <div className={styles.todayLeft}>
          <div className={styles.todayHeaderTag}>
            <span className={styles.liveIndicator}></span>
            <span>Today's Islamic Calendar Date</span>
          </div>
          <h2 className={styles.todayHijriText}>
            {todayH.hDay} {HIJRI_MONTHS[todayH.hMonth - 1]?.en} {todayH.hYear} <span className={styles.ahBadge}>AH</span>
          </h2>
          <div className={styles.todayGregorianText}>
            📅 {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>

        <div className={styles.todayArabicBadge}>
          <span className={styles.arabicHijriDate}>
            {todayH.hDay} {HIJRI_MONTHS[todayH.hMonth - 1]?.ar} {todayH.hYear} هـ
          </span>
          {HIJRI_MONTHS[todayH.hMonth - 1]?.isSacred && (
            <span className={styles.sacredBadge}>
              <span className={styles.sacredIcon}>✨</span> Sacred Month (شهر حرام)
            </span>
          )}
        </div>
      </div>

      {/* Conversion Mode Tabs & Presets */}
      <div className={styles.tabsRow}>
        <div className={styles.tabButtonsGroup}>
          <button
            type="button"
            className={`${styles.tabBtn} ${mode === 'g2h' ? styles.tabBtnActive : ''}`}
            onClick={() => setMode('g2h')}
          >
            Gregorian ➔ Hijri
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${mode === 'h2g' ? styles.tabBtnActive : ''}`}
            onClick={() => setMode('h2g')}
          >
            Hijri ➔ Gregorian
          </button>
        </div>

        <button
          type="button"
          onClick={handleSetToday}
          className={styles.todayShortcutBtn}
          title="Reset to today's date"
        >
          ⏱️ Reset to Today
        </button>
      </div>

      {/* Main Converter Form & Result Grid */}
      <div className={styles.converterGrid}>
        {/* Left: Input Form */}
        <div className={styles.formBox}>
          <div className={styles.formSectionHeader}>
            <span className={styles.formIcon}>🗓️</span>
            <span className={styles.formTitle}>
              {mode === 'g2h' ? 'Enter Solar (Gregorian) Date' : 'Enter Lunar (Hijri) Date'}
            </span>
          </div>

          {mode === 'g2h' ? (
            <div className={styles.formGroup}>
              <label htmlFor="gDateInput" className={styles.label}>Select Gregorian Date:</label>
              <input
                id="gDateInput"
                type="date"
                value={selectedGDate}
                onChange={(e) => setSelectedGDate(e.target.value)}
                className={styles.dateInput}
              />
            </div>
          ) : (
            <div className={styles.hijriInputFields}>
              <div className={styles.formGroup}>
                <label htmlFor="hDaySelect" className={styles.label}>Hijri Day:</label>
                <select
                  id="hDaySelect"
                  value={inputHDay}
                  onChange={(e) => setInputHDay(parseInt(e.target.value, 10))}
                  className={styles.selectInput}
                >
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>
                      Day {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="hMonthSelect" className={styles.label}>Hijri Month:</label>
                <select
                  id="hMonthSelect"
                  value={inputHMonth}
                  onChange={(e) => setInputHMonth(parseInt(e.target.value, 10))}
                  className={styles.selectInput}
                >
                  {HIJRI_MONTHS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.id}. {m.en} ({m.ar}) {m.isSacred ? '⭐' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="hYearInput" className={styles.label}>Hijri Year (AH):</label>
                <input
                  id="hYearInput"
                  type="number"
                  min="1"
                  max="2000"
                  value={inputHYear}
                  onChange={(e) => setInputHYear(parseInt(e.target.value, 10) || 1447)}
                  className={styles.numberInput}
                />
              </div>
            </div>
          )}

          {/* Regional Moon Sighting Adjustment */}
          <div className={styles.adjustmentGroup}>
            <div className={styles.adjHeaderRow}>
              <label htmlFor="adjSelect" className={styles.adjLabel}>
                <span>🌙 Moon Sighting Adjustment:</span>
              </label>
              <span className={styles.adjSub}>For regional lunar discrepancies</span>
            </div>
            <select
              id="adjSelect"
              value={adjustment}
              onChange={(e) => setAdjustment(parseInt(e.target.value, 10))}
              className={styles.adjSelectInput}
            >
              <option value="-2">-2 Days (Western Sighting / Delay)</option>
              <option value="-1">-1 Day (Local Sightings)</option>
              <option value="0">Standard Umm al-Qura Calculation (0 Days)</option>
              <option value="1">+1 Day (Early Crescent Sighting)</option>
              <option value="2">+2 Days (Eastern Sighting)</option>
            </select>
          </div>
        </div>

        {/* Right: Conversion Result Box */}
        <div className={styles.resultBox}>
          {mode === 'g2h' && g2hResult && (
            <>
              <div className={styles.resultHeader}>
                <span className={styles.resultTitle}>Converted Islamic Hijri Date</span>
                <button
                  type="button"
                  onClick={handleCopyDate}
                  className={styles.copyBtn}
                >
                  {copied ? '✓ Copied!' : '📋 Copy Date'}
                </button>
              </div>

              <div className={styles.convertedMain}>
                <span className={styles.dayBadge}>{g2hResult.dayNameEn}</span>
                <div className={styles.dateNumberText}>
                  {g2hResult.hDay} {g2hResult.monthObj.en} {g2hResult.hYear} AH
                </div>
              </div>

              <div className={styles.convertedArabic}>
                يوم {g2hResult.dayNameAr}، {g2hResult.hDay} {g2hResult.monthObj.ar} {g2hResult.hYear} هـ
              </div>

              {g2hResult.monthObj.isSacred && (
                <div className={styles.sacredCallout}>
                  <span className={styles.sacredCalloutIcon}>✨</span>
                  <span>This date falls within one of the <strong>4 Sacred Months (الأشهر الحرم)</strong> in Islam.</span>
                </div>
              )}

              <div className={styles.convertedMetaGrid}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Gregorian Equivalent</span>
                  <span className={styles.metaValue}>
                    {new Date(selectedGDate + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Month Order</span>
                  <span className={styles.metaValue}>Month #{g2hResult.hMonth} of 12</span>
                </div>
              </div>
            </>
          )}

          {mode === 'h2g' && h2gResult && (
            <>
              <div className={styles.resultHeader}>
                <span className={styles.resultTitle}>Converted Gregorian Solar Date</span>
                <button
                  type="button"
                  onClick={handleCopyDate}
                  className={styles.copyBtn}
                >
                  {copied ? '✓ Copied!' : '📋 Copy Date'}
                </button>
              </div>

              <div className={styles.convertedMain}>
                <span className={styles.dayBadge}>{h2gResult.dayNameEn}</span>
                <div className={styles.dateNumberText}>
                  {h2gResult.gDateObj.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
              </div>

              <div className={styles.convertedArabic}>
                {inputHDay} {h2gResult.monthObj.ar} {inputHYear} هـ
              </div>

              <div className={styles.convertedMetaGrid}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Hijri Input Date</span>
                  <span className={styles.metaValue}>
                    {inputHDay} {h2gResult.monthObj.en} {inputHYear} AH
                  </span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Day of Week</span>
                  <span className={styles.metaValue}>{h2gResult.dayNameEn} ({h2gResult.dayNameAr})</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Islamic Calendar Key Dates Showcase */}
      <div className={styles.holidaysSection}>
        <div className={styles.holidaysHeader}>
          <span className={styles.holidaysTitle}>🌟 Key Islamic Calendar Dates & Milestones</span>
          <span className={styles.holidaysSubtitle}>Reference dates across the 12 lunar months</span>
        </div>

        <div className={styles.holidaysGrid}>
          {KEY_HOLIDAYS.map((holiday) => (
            <div key={holiday.name} className={styles.holidayCard}>
              <div className={styles.holidayTop}>
                <span className={styles.holidayIcon}>{holiday.icon}</span>
                <span className={styles.holidayDatePill}>{holiday.hijriDate}</span>
              </div>
              <h4 className={styles.holidayNameEn}>{holiday.name}</h4>
              <span className={styles.holidayNameAr}>{holiday.arName}</span>
              <p className={styles.holidayDesc}>{holiday.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

