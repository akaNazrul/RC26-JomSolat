import { useEffect, useState, useRef } from 'react';
import { getTimeUntilPrayer, getCurrentPrayer, PRAYER_ORDER, type PrayerKey, type PrayerTimeData } from '@/lib/prayerTimes';

interface DonutTimerProps {
  prayerTimes: PrayerTimeData;
}

export default function DonutTimer({ prayerTimes }: DonutTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0, total: 0 });
  const [progress, setProgress] = useState(0);
  const animationRef = useRef<number>();
  
  useEffect(() => {
    const updateTimer = () => {
      const { current, next } = getCurrentPrayer(prayerTimes);
      
      // Get the next prayer time
      const nextPrayerTime = prayerTimes[next as keyof PrayerTimeData] as string;
      if (!nextPrayerTime) return;
      
      const timeUntil = getTimeUntilPrayer(nextPrayerTime);
      setTimeLeft(timeUntil);
      
      // Calculate progress (simplified - assumes 1 hour window for countdown)
      const totalSeconds = 60 * 60; // 1 hour
      const elapsed = totalSeconds - timeUntil.total;
      const progressPercent = Math.max(0, Math.min(1, elapsed / totalSeconds));
      setProgress(progressPercent);
    };
    
    updateTimer();
    animationRef.current = window.setInterval(updateTimer, 1000);
    
    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [prayerTimes]);
  
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

