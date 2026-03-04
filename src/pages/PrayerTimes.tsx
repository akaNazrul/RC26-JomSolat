import { useState, useEffect } from 'react';
import { Bell, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchPrayerTimes, PRAYER_ORDER, formatTime, getCurrentPrayer, type PrayerTimeData } from '@/lib/prayerTimes';
import { useAppStore } from '@/store/useAppStore';

export default function PrayerTimesPage() {
  const { userZone } = useAppStore();
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimeData | null>(null);
  const [currentPrayer, setCurrentPrayer] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrayerTimes().then((times) => {
      setPrayerTimes(times);
      const { current } = getCurrentPrayer(times);
      setCurrentPrayer(current);
      setLoading(false);
    });
  }, [userZone]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-base p-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-bg-surface rounded-xl skeleton" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-bg-base/80 backdrop-blur-md border-b border-border-color">
        <div className="flex items-center gap-2 px-4 py-4">
          <Link to="/home" className="p-2 -ml-2 rounded-full hover:bg-bg-surface">
            <ChevronLeft size={24} className="text-text-primary" />
          </Link>
          <h1 className="font-display text-xl text-text-primary">Prayer Times</h1>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Zone Selector */}
        <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-bg-surface border border-border-color">
          <span className="font-body text-sm text-text-secondary">Zone:</span>
          <span className="font-body font-semibold text-accent-primary">USM (Gelugor)</span>
        </div>

        {/* Date */}
        <div className="text-center mb-4">
          <h2 className="font-display text-2xl text-text-primary">
            {prayerTimes?.gregorian.day} {prayerTimes?.gregorian.month}, {prayerTimes?.gregorian.year}
          </h2>
          <p className="font-body text-text-secondary">
            {prayerTimes?.hijri.day} {prayerTimes?.hijri.month} {prayerTimes?.hijri.year}H
          </p>
        </div>

        {/* Prayer Times Table */}
        <div className="rounded-2xl bg-bg-surface border border-border-color overflow-hidden">
{PRAYER_ORDER.map((prayer, index) => {
            const isActive = currentPrayer === prayer.key;
            const time = prayerTimes?.[prayer.key as keyof PrayerTimeData] as string;
            
            return (
              <div
                key={prayer.key}
                className={`flex items-center justify-between p-4 ${
                  index !== PRAYER_ORDER.length - 1 ? 'border-b border-border-color' : ''
                } ${isActive ? 'bg-accent-warm/10' : ''}`}
              >
                <div className="flex items-center gap-3">
                  {isActive && (
                    <div className="w-1 h-10 rounded-full bg-accent-warm" />
                  )}
                  <div>
                    <p className="font-arabic text-lg text-text-primary">{prayer.nameAr}</p>
                    <p className="font-body text-sm text-text-secondary">{prayer.label}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-body text-lg font-semibold ${
                    isActive ? 'text-accent-warm' : 'text-text-primary'
                  }`}>
                    {time ? formatTime(time) : '--:--'}
                  </span>
                  <button className="p-2 rounded-full hover:bg-bg-base">
                    <Bell size={18} className="text-text-muted" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sunrise */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-bg-surface border border-border-color">
          <div>
            <p className="font-body text-sm text-text-secondary">Sunrise</p>
            <p className="font-arabic text-lg text-text-primary"> الشروق</p>
          </div>
          <span className="font-body text-lg text-text-muted">
            {prayerTimes?.sunrise ? formatTime(prayerTimes.sunrise) : '--:--'}
          </span>
        </div>

        {/* Info */}
        <p className="text-center font-body text-xs text-text-muted">
          Times are based on JAKIM method (Method 11) for Gelugor zone
        </p>
      </div>
    </div>
  );
}

