import surahsData from '../data/surahs.json';
import type { Surah } from '../types/surah';
import { rawQuotesText } from '../data/rawQuotes';

export interface DailyQuote {
  id: number;
  text: string;
  surahName: string;
  surahSlug: string;
  ayah: string;
}

interface Quote {
  id: number;
  text: string;
  surahId: number | null;
  ayah: string | null;
}

// Parse quotes once and cache them
let cachedQuotes: Quote[] | null = null;

function getQuotesData() {
  if (cachedQuotes) return cachedQuotes;
  
  const lines = rawQuotesText.split('\n');
  const quotes = [];
  let idCounter = 1;

  for (const line of lines) {
    const match = line.match(/^\s*\d+\.\s+(.*?)\s+\((.*?)\)/);
    if (match) {
      const text = match[1];
      const reference = match[2];
      
      let surahId = null;
      let ayah = null;
      if (reference.includes(':')) {
        const parts = reference.split(':');
        surahId = parseInt(parts[0], 10);
        ayah = parts[1];
      }
      
      quotes.push({
        id: idCounter++,
        text: text,
        surahId: surahId,
        ayah: ayah
      });
    }
  }
  
  cachedQuotes = quotes;
  return cachedQuotes;
}

/**
 * Calculates the Day of the Year (1 to 366) based STRICTLY on the provided Date object (local time).
 * Uses the local timezone offset to avoid any UTC shifting issues.
 */
export function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = (date.getTime() - start.getTime()) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * Retrieves the Quran quote for the current local calendar date.
 * Relies exclusively on the user's device time.
 */
export function getDailyQuote(): DailyQuote {
  const quotesData = getQuotesData();
  const today = new Date();
  const dayOfYear = getDayOfYear(today);
  
  // Ensure we don't go out of bounds (1 to 366)
  // Arrays are 0-indexed, so day 1 is index 0.
  const quoteIndex = Math.max(0, Math.min(dayOfYear - 1, quotesData.length - 1));
  const quote = quotesData[quoteIndex];
  
  // Resolve Surah details
  const surah = (surahsData as Surah[]).find((s) => s.id === quote.surahId);
  
  return {
    id: quote.id,
    text: quote.text,
    surahName: surah ? `Surah ${surah.transliteration}` : 'Unknown Surah',
    surahSlug: surah ? surah.slug : '',
    ayah: quote.ayah || ''
  };
}
