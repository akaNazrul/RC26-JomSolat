import { useEffect, useState, useRef, useMemo } from 'react';
import { getTimeUntilPrayer, getCurrentPrayer, PRAYER_ORDER, type PrayerTimeData } from '@/lib/prayerTimes';

interface DonutTimerProps {
  prayerTimes: PrayerTimeData;
}

export default function DonutTimer({ prayerTimes }: DonutTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0, total: 0 });
  const [progress, setProgress] = useState(0);
  const animationRef = useRef<number>();
  
  // Calculate the time interval between current prayer and next prayer
  const prayerInterval = useMemo(() => {
    const { current, next } = getCurrentPrayer(prayerTimes);
    
    // Get current and next prayer times
    const currentTime = current ? prayerTimes[current as keyof PrayerTimeData] as string : null;
    const nextTime = prayerTimes[next as keyof PrayerTimeData] as string;
    
    if (!nextTime) return 60 * 60 * 1000; // Default 1 hour
    
    const now = new Date();
    const [nextHours, nextMinutes] = nextTime.split(':').map(Number);
    const nextDate = new Date();
    nextDate.setHours(nextHours, nextMinutes, 0, 0);
    
    if (currentTime) {
      const [currHours, currMinutes] = currentTime.split(':').map(Number);
      const currDate = new Date();
      currDate.setHours(currHours, currMinutes, 0, 0);
      
      // If current prayer is before next prayer today
      if (currDate < nextDate) {
        return nextDate.getTime() - currDate.getTime();
      }
    }
    
    // Default to time from now until next prayer
    return Math.max(nextDate.getTime() - now.getTime(), 60 * 60 * 1000);
  }, [prayerTimes]);
  
  useEffect(() => {
    const updateTimer = () => {
      const { next } = getCurrentPrayer(prayerTimes);
      
      // Get the next prayer time
      const nextPrayerTime = prayerTimes[next as keyof PrayerTimeData] as string;
      if (!nextPrayerTime) return;
      
      const timeUntil = getTimeUntilPrayer(nextPrayerTime);
      setTimeLeft(timeUntil);
      
      // Calculate progress based on actual time interval
      const elapsed = prayerInterval - timeUntil.total;
      const progressPercent = Math.max(0, Math.min(1, elapsed / prayerInterval));
      setProgress(progressPercent);
    };
    
    updateTimer();
    animationRef.current = window.setInterval(updateTimer, 1000);
    
    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [prayerTimes, prayerInterval]);
  
  const { next } = getCurrentPrayer(prayerTimes);
  const nextPrayerLabel = PRAYER_ORDER.find(p => p.key === next)?.label || next;
  
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
    <div className="relative w-48 h-48 mx-auto">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
        {/* Background circle */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="var(--border-color)"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <circle
          cx="60"
          cy="60"
          r={radius}
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
        <span className="font-body text-4xl font-bold text-text-primary">
          {formatTimeDisplay()}
        </span>
        <span className="font-body text-sm text-text-secondary mt-1">
          until {nextPrayerLabel}
        </span>
      </div>
    </div>
  );
}

