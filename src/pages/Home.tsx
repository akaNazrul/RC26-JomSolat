import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun, Bell, Building2, Waves, Car, Calendar, ChevronRight } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import DonutTimer from '@/components/DonutTimer';
import { fetchPrayerTimes, PRAYER_ORDER, formatTime, getCurrentPrayer, type PrayerTimeData } from '@/lib/prayerTimes';

export default function Home() {
  const { theme, toggleTheme, user, userZone, setUserZone } = useAppStore();
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimeData | null>(null);
  const [currentPrayer, setCurrentPrayer] = useState<string>('fajr');

  useEffect(() => {
    fetchPrayerTimes().then((times) => {
      setPrayerTimes(times);
      const { current } = getCurrentPrayer(times);
      if (current) setCurrentPrayer(current);
    });
  }, []);

  const quickAccessCards = [
    { to: '/mosque-info', icon: Building2, label: 'Mosque Info', color: 'bg-accent-primary/20 text-accent-primary' },
    { to: '/facilities', icon: Waves, label: 'Facilities', color: 'bg-blue-500/20 text-blue-500' },
    { to: '/parking', icon: Car, label: 'Parking', color: 'bg-green-500/20 text-green-500' },
    { to: '/events', icon: Calendar, label: 'Events', color: 'bg-accent-warm/20 text-accent-warm' },
  ];

  const upcomingEvents = [
    { title: 'Taraweeh Prayer', date: 'Every night in Ramadan', type: 'taraweeh' },
    { title: 'Friday Sermon', date: "Jumu'ah 12:00 PM", type: 'ceramah' },
  ];

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-bg-base/80 backdrop-blur-md border-b border-border-color">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent-primary flex items-center justify-center">
              <span className="text-white font-arabic text-lg">م</span>
            </div>
            <span className="font-display text-xl text-text-primary">JomSolat</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-bg-surface text-text-primary"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="p-2 rounded-full bg-bg-surface text-text-primary relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent-warm" />
            </button>
          </div>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Greeting */}
        <div>
          <h1 className="font-display text-2xl text-text-primary">
            Assalamualaikum, {user?.display_name || 'Guest'}
          </h1>
          <p className="font-body text-sm text-text-secondary">
            {prayerTimes?.hijri.day} {prayerTimes?.hijri.month} {prayerTimes?.hijri.year}H ·{' '}
            {prayerTimes?.gregorian.day}/{prayerTimes?.gregorian.month}/{prayerTimes?.gregorian.year}
          </p>
        </div>

        {/* Donut Timer Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-bg-surface to-bg-elevated border border-border-color">
          <div className="text-center mb-4">
            <h2 className="font-display text-lg text-text-primary">Next Prayer</h2>
          </div>
          {prayerTimes ? (
            <DonutTimer prayerTimes={prayerTimes} />
          ) : (
            <div className="w-48 h-48 mx-auto rounded-full border-8 border-border-color animate-pulse" />
          )}
        </div>

        {/* Prayer Time Strip */}
        <div className="overflow-x-auto pb-2 -mx-4 px-4">
          <div className="flex gap-2 min-w-max">
            {PRAYER_ORDER.map((prayer) => {
              const isActive = currentPrayer === prayer.key;
              
              return (
                <button
                  key={prayer.key}
                  className={`flex-shrink-0 px-4 py-3 rounded-xl min-w-[80px] text-center transition-all ${
                    isActive
                      ? 'bg-accent-warm text-white'
                      : 'bg-bg-surface text-text-primary border border-border-color'
                  }`}
                >
                  <span className="font-arabic text-xs block mb-1">{prayer.nameAr}</span>
                  <span className="font-body text-sm font-medium">
                    {prayerTimes ? formatTime(prayerTimes[prayer.key as keyof PrayerTimeData] as string) : '--:--'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Access Grid */}
        <div>
          <h2 className="font-display text-lg text-text-primary mb-3">Quick Access</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickAccessCards.map((card) => (
              <Link
                key={card.to}
                to={card.to}
                className="flex items-center gap-3 p-4 rounded-2xl bg-bg-surface border border-border-color card-hover"
              >
                <div className={`p-2 rounded-xl ${card.color}`}>
                  <card.icon size={20} />
                </div>
                <span className="font-body font-medium text-text-primary">{card.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Events Teaser */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg text-text-primary">Upcoming Events</h2>
            <Link to="/events" className="text-sm text-accent-primary flex items-center gap-1">
              See All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="space-y-2">
            {upcomingEvents.map((event, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl bg-bg-surface border border-border-color"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    event.type === 'taraweeh' ? 'bg-purple-500/20 text-purple-500' : 'bg-accent-warm/20 text-accent-warm'
                  }`}>
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="font-body font-medium text-text-primary">{event.title}</p>
                    <p className="font-body text-xs text-text-secondary">{event.date}</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-text-muted" />
              </div>
            ))}
          </div>
        </div>

        {/* KrackedDevs Promo */}
        <div className="p-4 rounded-xl bg-accent-primary/10 border border-accent-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-sm text-accent-primary font-semibold">Built for RC26</p>
              <p className="font-body text-xs text-text-secondary">Kracked Devs Ramadan Challenge 2026</p>
            </div>
            <div className="px-3 py-1 rounded-full bg-accent-primary/20">
              <span className="text-xs font-body font-medium text-accent-primary">Murtabug</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

