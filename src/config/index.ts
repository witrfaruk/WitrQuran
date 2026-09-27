export const AUDIO_SOURCES = [
  (id: string) => `https://download.quranicaudio.com/quran/mahmood_khaleel_al-husaree/${id}.mp3`,
  (id: string) => `https://server13.mp3quran.net/husr/${id}.mp3`,
  (id: string) => `https://pub-55d552f89c8e4183935d201d3f3435b0.r2.dev/audio/Mahmoud%20Khalil%20Al%20Hussary/${id}.webm`
];

export const getAudioUrl = (id: number | string, sourceIndex = 0): string => {
  const numericId = Number(id);
  const validId = isNaN(numericId) || numericId < 1 || numericId > 114 ? 1 : numericId;
  const paddedId = String(validId).padStart(3, '0');
  const sourceFn = AUDIO_SOURCES[sourceIndex % AUDIO_SOURCES.length];
  return sourceFn(paddedId);
};
