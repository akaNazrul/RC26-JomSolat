import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Waves, Car, Calendar, ChevronRight, Heart } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import DonutTimer from '@/components/DonutTimer';
import { PRAYER_ORDER, formatTime, getCurrentPrayer, type PrayerTimeData } from '@/lib/prayerTimes';
import { getSupabase } from '@/lib/supabase';
import { sanitizeHtml } from '@/lib/security';

interface UpcomingEvent {
  id: string;
  title: string;
  event_date: string;
  type: string;
}

interface FeedEvent {
  id: string;
  caption: string;
  display_url: string;
  likes_count: number;
  type: string;
}

export default function Home() {
  const { user, fetchPrayerData } = useAppStore();
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimeData | null>(null);
  const [currentPrayer, setCurrentPrayer] = useState<string>('fajr');
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [feedEvents, setFeedEvents] = useState<FeedEvent[]>([]);

  useEffect(() => {
    // Use cached prayer data — avoids a redundant API call if already fetched today
    fetchPrayerData().then((times) => {
      setPrayerTimes(times);
      const { current } = getCurrentPrayer(times);
      if (current) setCurrentPrayer(current);
    });

    // Fetch the next 2 upcoming events from Supabase
    (async () => {
      try {
        const client = getSupabase();
        const todayISO = new Date().toISOString().split('T')[0];
        const res = await client
          .from('events')
          .select('id, title, event_date, type')
          .eq('is_active', true)
          .gte('event_date', todayISO)
          .order('event_date', { ascending: true })
          .limit(2);
        const data = res.data as UpcomingEvent[] | null;
        if (data) setUpcomingEvents(data);
      } catch (e) {
        console.error('Failed to fetch upcoming events', e);
      }
    })();

    // Fetch Instagram feed events for the home page carousel
    (async () => {
      try {
        const client = getSupabase();
        const { data, error } = await client
          .from('instagram_feed')
          .select('id, caption, display_url, likes_count')
          .order('created_at', { ascending: false })
          .limit(6);
        
        if (error) throw error;
        if (data) {
          // Categorize the feed events based on keywords
          const CLUSTERS = {
            taraweeh: ['taraweeh', 'terawih', 'witir', 'qiyam', 'solat sunat', 'isyak'],
            ceramah: ['ceramah', 'kuliah', 'tazkirah', 'ustaz', 'sharing', 'panel', 'ilmu'],
            class: ['kelas', 'pengajian', 'tadabbur', 'bengkel', 'workshop', 'halaqah', 'belajar'],
            community: ['iftar', 'berbuka', 'makan', 'rewang', 'gotong', 'sumbangan', 'sedekah']
          };

          const categorizedData = data.map((post: any) => {
            const caption = post.caption?.toLowerCase() || '';
            let type = 'general';
            let maxScore = 0;

            Object.entries(CLUSTERS).forEach(([category, keywords]) => {
              const score = keywords.reduce((acc, word) => acc + (caption.includes(word) ? 1 : 0), 0);
              if (score > maxScore) {
                maxScore = score;
                type = category;
              }
            });

            return { ...post, type };
          });

          setFeedEvents(categorizedData);
        }
      } catch (e) {
        console.error('Failed to fetch feed events', e);
      }
    })();
  }, []);

  // Immediately available from JS — no API needed
  const today = new Date();
  // Fix: Use proper locale-aware date formatting
  const todayLabel = today.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).replace(/\//g, '/');

  const quickAccessCards = [
    { to: '/mosque-info', icon: Building2, label: 'Mosque Info', color: 'bg-accent-primary/20 text-accent-primary' },
    { to: '/facilities', icon: Waves, label: 'Facilities', color: 'bg-blue-500/20 text-blue-500' },
    { to: '/parking', icon: Car, label: 'Parking', color: 'bg-green-500/20 text-green-500' },
    { to: '/events', icon: Calendar, label: 'Events', color: 'bg-accent-warm/20 text-accent-warm' },
  ];

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Header — visible on mobile only; desktop uses the top Navbar */}
      <header className="sticky top-0 z-40 bg-bg-base/80 backdrop-blur-md border-b border-border-color md:hidden">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            {/* mobile view of logo */}
            <img
              src="/assets/v2-SVG.svg"
              alt="JomSolat"
              className="h-10 w-auto"
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
          {/* Show today's Gregorian date immediately; add Hijri once API resolves */}
          <p className="font-body text-sm text-text-secondary">
            {prayerTimes
              ? `${prayerTimes.hijri.day} ${prayerTimes.hijri.month} ${prayerTimes.hijri.year}H · `
              : ''}
            {todayLabel}
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
<span className="font-display text-[10px] md:text-xs block mb-1">{prayer.nameTransliterated}</span>
                  <span className="font-body text-sm md:text-base font-medium">
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

        {/* Feed Events Carousel */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg text-text-primary">Mosque Updates</h2>
            <Link to="/feed" className="text-sm text-accent-primary flex items-center gap-1">
              See All <ChevronRight size={16} />
            </Link>
          </div>
          {feedEvents.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar snap-x">
              {feedEvents.map((event) => (
                <Link
                  key={event.id}
                  to="/feed"
                  className="flex-shrink-0 w-40 snap-start"
                >
                  <div className="bg-bg-surface border border-border-color rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    {/* Poster Image */}
                    <div className="aspect-square bg-bg-elevated overflow-hidden">
                      <img 
                        src={`https://images.weserv.nl/?url=${encodeURIComponent(event.display_url)}`} 
                        alt="Feed post" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Caption & Info */}
                    <div className="p-3 space-y-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ${
                        event.type === 'taraweeh' ? 'bg-purple-500/20 text-purple-500' :
                        event.type === 'ceramah' ? 'bg-orange-500/20 text-orange-500' :
                        event.type === 'class' ? 'bg-teal-500/20 text-teal-500' :
                        event.type === 'community' ? 'bg-green-500/20 text-green-500' :
                        'bg-accent-primary/20 text-accent-primary'
                      }`}>
                        {event.type}
                      </span>
                      <p className="font-body text-xs text-text-secondary line-clamp-2">
                        {sanitizeHtml(event.caption?.substring(0, 60))}{event.caption && event.caption.length > 60 ? '...' : ''}
                      </p>
                      <div className="flex items-center gap-1 text-text-muted">
                        <Heart size={12} />
                        <span className="text-[10px] font-medium">{event.likes_count}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="font-body text-sm text-text-muted text-center py-4">No feed updates available</p>
          )}
        </div>

        {/* KrackedDevs Promo */}
        <div className="p-4 rounded-xl bg-accent-primary/10 border border-accent-primary/20">
          <div className="flex items-center gap-3">
            <img 
              src="/assets/kracked-dev-logo.svg" 
              alt="Kracked Devs" 
              className="w-10 h-10"
            />
            <div className="flex-1">
              <p className="font-body text-sm text-accent-primary font-semibold">Built for RC26</p>
              <p className="font-body text-xs text-text-secondary">Kracked Devs Ramadan Challenge 2026</p>
            </div>
            <div className="px-3 py-1 rounded-full bg-accent-primary/20">
              <span className="text-xs font-body font-medium text-accent-primary">MurtaBug</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

