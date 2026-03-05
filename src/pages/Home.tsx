import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Waves, Car, Calendar, ChevronRight } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import DonutTimer from '@/components/DonutTimer';
import { fetchPrayerTimes, PRAYER_ORDER, formatTime, getCurrentPrayer, type PrayerTimeData } from '@/lib/prayerTimes';

export default function Home() {
  const { user } = useAppStore();
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

  {/* should retrieve the data from social media pusat islam media for their latest info*/}
  const upcomingEvents = [
    { title: 'Taraweeh Prayer', date: 'Every night in Ramadan', type: 'taraweeh' },
    { title: 'Friday khutbah', date: "Jumu'ah 1:30 PM", type: 'ceramah' },
  ];

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Header — visible on mobile only; desktop uses the top Navbar */}
      <header className="sticky top-0 z-40 bg-bg-base/80 backdrop-blur-md border-b border-border-color md:hidden">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            {/* mobile view of logo */}
            <img
              src="/assets/jomSolat-logo-noBg.svg"
              alt="JomSolat"
              className="h-16 w-auto"
            />
          </div>
        </div>
      </header>


      <div className="px-4 py-6 space-y-6 md:px-8">
        {/* Greeting */}
        <div className="md:text-center">
          <h1 className="font-display text-2xl md:text-3xl text-text-primary">
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

        {/* Prayer Time Strip — centered grid on mobile, full grid on desktop */}
        <div className="md:overflow-visible md:mx-0 md:px-0">
          <div className="grid grid-cols-5 gap-2">
            {PRAYER_ORDER.map((prayer) => {
              const isActive = currentPrayer === prayer.key;
              
              return (
                <button
                  key={prayer.key}
                  className={`px-2 py-3 rounded-xl text-center transition-all ${
                    isActive
                      ? 'bg-accent-warm text-white'
                      : 'bg-bg-surface text-text-primary border border-border-color'
                  }`}
                >
                  <span className="font-arabic text-[10px] md:text-xs block mb-1">{prayer.nameAr}</span>
                  <span className="font-body text-xs md:text-sm font-medium">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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

