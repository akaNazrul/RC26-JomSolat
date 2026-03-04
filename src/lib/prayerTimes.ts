// Prayer time API utilities using Al-Adhan API
// Method 11 = JAKIM (Jabatan Kemajuan Islam Malaysia)

const AL_ADHAN_API = 'https://api.aladhan.com/v1/timingsByCity';

export interface AlAdhanTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export interface AlAdhanResponse {
  data: {
    timings: AlAdhanTimings;
    date: {
      readable: string;
      hijri: {
        day: string;
        month: {
          en: string;
          ar: string;
        };
        year: string;
      };
      gregorian: {
        day: string;
        month: {
          number: number;
        };
        year: string;
      };
    };
  };
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

export async function fetchPrayerTimes(city: string = 'Gelugor', country: string = 'Malaysia'): Promise<PrayerTimeData> {
  const today = new Date().toISOString().split('T')[0];
  
  try {
    const response = await fetch(
      `${AL_ADHAN_API}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=11&school=0&date=${today}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch prayer times');
    }
    
    const data: AlAdhanResponse = await response.json();
    
    return {
      fajr: data.data.timings.Fajr,
      sunrise: data.data.timings.Sunrise,
      dhuhr: data.data.timings.Dhuhr,
      asr: data.data.timings.Asr,
      maghrib: data.data.timings.Maghrib,
      isha: data.data.timings.Isha,
      hijri: {
        day: data.data.date.hijri.day,
        month: data.data.date.hijri.month.en,
        monthAr: data.data.date.hijri.month.ar,
        year: data.data.date.hijri.year,
      },
      gregorian: {
        day: data.data.date.gregorian.day,
        month: data.data.date.gregorian.month.number,
        year: data.data.date.gregorian.year,
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
  { key: 'fajr', name: 'Fajr', nameAr: 'الفجر', label: 'Subuh' },
  { key: 'dhuhr', name: 'Dhuhr', nameAr: 'الظهر', label: 'Zuhur' },
  { key: 'asr', name: 'Asr', nameAr: 'العصر', label: 'Asar' },
  { key: 'maghrib', name: 'Maghrib', nameAr: 'المغرب', label: 'Maghrib' },
  { key: 'isha', name: 'Isha', nameAr: 'العشاء', label: 'Isya' },
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
  if (!current && currentTime < parseInt(times.fajr.split(':')[0]) * 60) {
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

