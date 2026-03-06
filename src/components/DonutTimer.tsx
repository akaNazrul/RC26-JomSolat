import { useEffect, useState, useRef, useMemo } from 'react';
import { getTimeUntilPrayer, getCurrentPrayer, PRAYER_ORDER, formatTime, type PrayerTimeData } from '@/lib/prayerTimes';

interface DonutTimerProps {
  prayerTimes: PrayerTimeData;
}

export default function DonutTimer({ prayerTimes }: DonutTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0, total: 0 });
  const [progress, setProgress] = useState(0);
  const animationRef = useRef<number>();

  // Compute current/next once per render tick (in the interval), not repeatedly.
  // Also used outside the interval for the label — derive from latest timeLeft.
  const { next: nextPrayer } = useMemo(() => getCurrentPrayer(prayerTimes), [prayerTimes]);

  // Time span between the current prayer start and the next prayer — used to
  // calculate the progress arc. Recomputed only when prayerTimes changes.
  const prayerInterval = useMemo(() => {
    const { current, next } = getCurrentPrayer(prayerTimes);

    const nextTime = prayerTimes[next as keyof PrayerTimeData] as string;
    if (!nextTime) return 60 * 60 * 1000;

    const now = new Date();
    const [nextHours, nextMinutes] = nextTime.split(':').map(Number);
    const nextDate = new Date();
    nextDate.setHours(nextHours, nextMinutes, 0, 0);

    if (current) {
      const currentTime = prayerTimes[current as keyof PrayerTimeData] as string;
      const [currHours, currMinutes] = currentTime.split(':').map(Number);
      const currDate = new Date();
      currDate.setHours(currHours, currMinutes, 0, 0);
      if (currDate < nextDate) {
        return nextDate.getTime() - currDate.getTime();
      }
    }

    return Math.max(nextDate.getTime() - now.getTime(), 60 * 60 * 1000);
  }, [prayerTimes]);

  useEffect(() => {
    const updateTimer = () => {
      // Single call to getCurrentPrayer per tick
      const { next } = getCurrentPrayer(prayerTimes);
      const nextPrayerTime = prayerTimes[next as keyof PrayerTimeData] as string;
      if (!nextPrayerTime) return;

      const timeUntil = getTimeUntilPrayer(nextPrayerTime);

      // After all prayers have passed for the day, timeUntil.total === 0.
      // Calculate time remaining until tomorrow's Fajr instead.
      if (timeUntil.total === 0) {
        const [fh, fm] = prayerTimes.fajr.split(':').map(Number);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(fh, fm, 0, 0);
        const diff = tomorrow.getTime() - Date.now();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds, total: diff });
        setProgress(Math.max(0, Math.min(1, (prayerInterval - diff) / prayerInterval)));
        return;
      }

      setTimeLeft(timeUntil);
      const elapsed = prayerInterval - timeUntil.total;
      setProgress(Math.max(0, Math.min(1, elapsed / prayerInterval)));
    };

    updateTimer();
    animationRef.current = window.setInterval(updateTimer, 1000);

    return () => {
      if (animationRef.current) clearInterval(animationRef.current);
    };
  }, [prayerTimes, prayerInterval]);

  const nextPrayerLabel = PRAYER_ORDER.find(p => p.key === nextPrayer)?.label || nextPrayer;
  const nextPrayerTime = prayerTimes[nextPrayer as keyof PrayerTimeData] as string;

  // SVG circle properties
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const formatTimeDisplay = () => {
    const { hours, minutes, seconds } = timeLeft;
    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-48 h-48">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
          {/* Background circle */}
          <circle cx="60" cy="60" r={radius} fill="none" stroke="var(--border-color)" strokeWidth="8" />
          {/* Progress circle */}
          <circle
            cx="60" cy="60" r={radius}
            fill="none"
            stroke="var(--accent-warm)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-body text-4xl font-bold text-text-primary" aria-live="polite" aria-atomic="true">
            {formatTimeDisplay()}
          </span>
          <span className="font-body text-sm text-text-secondary mt-1">
            until {nextPrayerLabel}
          </span>
        </div>
      </div>

      {/* Next prayer time label */}
      {nextPrayerTime && (
        <p className="font-body text-sm text-text-muted">
          {nextPrayerLabel} at {formatTime(nextPrayerTime)}
        </p>
      )}
    </div>
  );
}

