// Prayer time API utilities using api.waktusolat.app
// Zone PNG01 = Pulau Pinang (covers entire Penang state including Gelugor)
// Data source: JAKIM E-Solat official data

const WAKTUSOLAT_API = 'https://api.waktusolat.app';
const ZONE = 'PNG01'; // Pulau Pinang – Gelugor, Penang

export interface WaktuSolatPrayer {
  day: number;
  hijri: string; // "YYYY-MM-DD" hijri date
  fajr: number;   // Unix timestamp (seconds)
  syuruk: number;
  dhuhr: number;
  asr: number;
  maghrib: number;
  isha: number;
}

export interface WaktuSolatResponse {
  zone: string;
  year: number;
  month: string;
  month_number: number;
  last_updated: string | null;
  prayers: WaktuSolatPrayer[];
}

// Hijri month name mappings
const HIJRI_MONTHS_EN: Record<number, string> = {
  1: 'Muharram', 2: 'Safar', 3: "Rabi' al-Awwal", 4: "Rabi' al-Thani",
  5: 'Jumada al-Awwal', 6: 'Jumada al-Thani', 7: 'Rajab', 8: "Sha'ban",
  9: 'Ramadan', 10: 'Shawwal', 11: "Dhu al-Qi'dah", 12: 'Dhu al-Hijjah',
};

const HIJRI_MONTHS_AR: Record<number, string> = {
  1: 'محرم', 2: 'صفر', 3: 'ربيع الأول', 4: 'ربيع الثاني',
  5: 'جمادى الأولى', 6: 'جمادى الآخرة', 7: 'رجب', 8: 'شعبان',
  9: 'رمضان', 10: 'شوال', 11: 'ذو القعدة', 12: 'ذو الحجة',
};

function unixToTimeString(unix: number): string {
  // Shift to Malaysia Time (UTC+8) explicitly so the result is correct
  // regardless of which timezone the device is running in.
  const myt = new Date(unix * 1000 + 8 * 60 * 60 * 1000);
  const hours = myt.getUTCHours().toString().padStart(2, '0');
  const minutes = myt.getUTCMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export interface PrayerTimeData {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  hijri: {
    day: string;
    month: string;
    monthAr: string;
    year: string;
  };
  gregorian: {
    day: string;
    month: number;
    year: string;
  };
}

export async function fetchPrayerTimes(): Promise<PrayerTimeData> {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  try {
    const response = await fetch(
      `${WAKTUSOLAT_API}/v2/solat/${ZONE}?year=${year}&month=${month}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch prayer times: ${response.status}`);
    }

    const data: WaktuSolatResponse = await response.json();

    const todayPrayer = data.prayers.find((p) => p.day === day);
    if (!todayPrayer) {
      throw new Error('No prayer data found for today');
    }

    // Parse hijri date string "YYYY-MM-DD"
    const [hijriYear, hijriMonth, hijriDay] = todayPrayer.hijri
      .split('-')
      .map(Number);

    return {
      fajr: unixToTimeString(todayPrayer.fajr),
      sunrise: unixToTimeString(todayPrayer.syuruk),
      dhuhr: unixToTimeString(todayPrayer.dhuhr),
      asr: unixToTimeString(todayPrayer.asr),
      maghrib: unixToTimeString(todayPrayer.maghrib),
      isha: unixToTimeString(todayPrayer.isha),
      hijri: {
        day: String(hijriDay),
        month: HIJRI_MONTHS_EN[hijriMonth] ?? `Month ${hijriMonth}`,
        monthAr: HIJRI_MONTHS_AR[hijriMonth] ?? '',
        year: String(hijriYear),
      },
      gregorian: {
        day: String(day),
        month: month,
        year: String(year),
      },
    };
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    // Return fallback data
    return getFallbackPrayerTimes();
  }
}

function getFallbackPrayerTimes(): PrayerTimeData {
  const now = new Date();
  return {
    fajr: '05:50',
    sunrise: '07:10',
    dhuhr: '13:15',
    asr: '16:40',
    maghrib: '19:28',
    isha: '20:40',
    hijri: {
      day: '1',
      month: 'Ramadan',
      monthAr: 'رمضان',
      year: '1447',
    },
    gregorian: {
      day: String(now.getDate()),
      month: now.getMonth() + 1,
      year: String(now.getFullYear()),
    },
  };
}

// Prayer order and names
export const PRAYER_ORDER = [
  { key: 'fajr', name: 'Fajr', nameAr: 'الفجر', nameTransliterated: 'Subuh', label: 'Subuh' },
  { key: 'dhuhr', name: 'Dhuhr', nameAr: 'الظهر', nameTransliterated: 'Zuhur', label: 'Zuhur' },
  { key: 'asr', name: 'Asr', nameAr: 'العصر', nameTransliterated: 'Asar', label: 'Asar' },
  { key: 'maghrib', name: 'Maghrib', nameAr: 'المغرب', nameTransliterated: 'Maghrib', label: 'Maghrib' },
  { key: 'isha', name: 'Isha', nameAr: 'العشاء', nameTransliterated: 'Isyak', label: 'Isyak' },
] as const;

export type PrayerKey = typeof PRAYER_ORDER[number]['key'];

// Calculate time remaining until next prayer
export function getTimeUntilPrayer(prayerTime: string): { hours: number; minutes: number; seconds: number; total: number } {
  const now = new Date();
  const [hours, minutes] = prayerTime.split(':').map(Number);
  
  const prayerDate = new Date();
  prayerDate.setHours(hours, minutes, 0, 0);
  
  // If prayer time has passed today, return 0
  if (prayerDate <= now) {
    return { hours: 0, minutes: 0, seconds: 0, total: 0 };
  }
  
  const diff = prayerDate.getTime() - now.getTime();
  const hoursRemaining = Math.floor(diff / (1000 * 60 * 60));
  const minutesRemaining = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secondsRemaining = Math.floor((diff % (1000 * 60)) / 1000);
  
  return {
    hours: hoursRemaining,
    minutes: minutesRemaining,
    seconds: secondsRemaining,
    total: diff,
  };
}

// Get current prayer based on time
export function getCurrentPrayer(times: PrayerTimeData): { current: PrayerKey | null; next: PrayerKey } {
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTime = currentHours * 60 + currentMinutes;
  
  const prayerTimesInMinutes: { key: PrayerKey; time: string }[] = [
    { key: 'fajr', time: times.fajr },
    { key: 'dhuhr', time: times.dhuhr },
    { key: 'asr', time: times.asr },
    { key: 'maghrib', time: times.maghrib },
    { key: 'isha', time: times.isha },
  ];
  
  let current: PrayerKey | null = null;
  let next: PrayerKey = 'fajr';
  
  for (let i = 0; i < prayerTimesInMinutes.length; i++) {
    const [ph, pm] = prayerTimesInMinutes[i].time.split(':').map(Number);
    const prayerTime = ph * 60 + pm;
    
    if (currentTime >= prayerTime) {
      current = prayerTimesInMinutes[i].key;
    } else {
      next = prayerTimesInMinutes[i].key;
      break;
    }
  }
  
  // If all prayers have passed, next is fajr of next day (default)
  // Fix: use both hours AND minutes so e.g. 05:50 → 350, not just 300
  const [fh, fm] = times.fajr.split(':').map(Number);
  if (!current && currentTime < fh * 60 + fm) {
    next = 'fajr';
  }
  
  return { current, next };
}

// Format time for display
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const h = parseInt(hours);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
}