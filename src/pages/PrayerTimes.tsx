import { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PRAYER_ORDER, formatTime, getCurrentPrayer, type PrayerTimeData } from '@/lib/prayerTimes';
import { useAppStore } from '@/store/useAppStore';

export default function PrayerTimesPage() {
  const { user, userZone, fetchPrayerData } = useAppStore();
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimeData | null>(null);
  const [currentPrayer, setCurrentPrayer] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Get zone display name
  const getZoneDisplayName = () => {
    const zone = user?.zone || userZone || 'gelugor';
    switch (zone) {
      case 'usm': return 'USM Induk';
      case 'manual': return 'Manual Zone';
      default: return 'USM (Gelugor)';
    }
  };

  useEffect(() => {
    setLoading(true);
    // Use the store cache — avoids redundant API calls when navigating between pages
    fetchPrayerData().then((times) => {
      setPrayerTimes(times);
      const { current } = getCurrentPrayer(times);
      setCurrentPrayer(current);
      setLoading(false);
    });
    // Intentionally omit zone deps: fetchPrayerTimes is zone-agnostic (PNG01 fixed)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <header className="sticky top-0 z-40 bg-bg-base/80 backdrop-blur-md border-b border-border-color md:hidden">
        <div className="flex items-center gap-2 px-4 py-4">
          <Link to="/home" className="p-2 -ml-2 rounded-full hover:bg-bg-surface">
            <ChevronLeft size={24} className="text-text-primary" />
          </Link>
          <h1 className="font-display text-xl text-text-primary">Prayer Times</h1>
        </div>
      </header>

      {/* Desktop Header - Centered */}
      <header className="hidden md:block sticky top-20 z-40 bg-bg-base/80 backdrop-blur-md">
        <div className="text-center py-6">
          <h1 className="font-display text-3xl text-text-primary">Prayer Times</h1>
        </div>
      </header>

      {/* Full width on both mobile and desktop, centered via Layout wrapper */}
      <div className="p-4 space-y-4 md:px-8">
        {/* Zone Selector - With Drone Video Background */}
        <div className="relative border border-border-color overflow-hidden rounded-xl h-80">
        {/* Drone Video Background */}
        <video 
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="/assets/masjid-drone-view.png"
        >
          <source src="/assets/smooth-drone-masjid.mp4" type="video/mp4" />
          {/* Fallback for browsers that don't support video */}
          <img 
            src="/assets/masjid-drone-view.png" 
            alt="Masjid Al-Malik Khalid" 
            className="w-full h-full object-cover"
          />
        </video>
          {/* Low Blur Overlay */}
          <div className="absolute inset-0 backdrop-blur-[2px] bg-bg-base/50" />
          {/* Content - Centered in middle of photo, single line */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-body text-2xl md:text-3xl text-white font-bold drop-shadow-lg">
              Zone: {getZoneDisplayName()}
            </span>
          </div>
        </div>

        {/* Date */}
        <div className="text-center mb-4">
          <h2 className="font-display text-2xl text-text-primary">
            {prayerTimes?.gregorian.day} {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][Number(prayerTimes?.gregorian.month) - 1]}, {prayerTimes?.gregorian.year}
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
<p className="font-display text-xs md:text-sm text-text-primary">{prayer.nameTransliterated}</p>
                    <p className="font-body text-xs text-text-secondary">{prayer.label}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-body text-sm md:text-base font-semibold ${
                    isActive ? 'text-accent-warm' : 'text-text-primary'
                  }`}>
                    {time ? formatTime(time) : '--:--'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

{/* Sunrise */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-bg-surface border border-border-color">
          <div>
            <p className="font-body text-xs text-text-secondary">Sunrise</p>
            <p className="font-display text-sm md:text-base text-text-primary">Sunrise</p>
          </div>
          <span className="font-body text-sm md:text-base text-text-muted">
            {prayerTimes?.sunrise ? formatTime(prayerTimes.sunrise) : '--:--'}
          </span>
        </div>

        {/* Info */}
        <p className="text-center font-body text-xs text-text-muted">
          Times are based on official JAKIM for Gelugor zone
        </p>
      </div>
    </div>
  );
}

