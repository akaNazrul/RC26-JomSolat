import React, { useState, useMemo, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { 
  Heart, 
  ExternalLink, 
  MapPin, 
  Calendar as CalIcon, 
  Bell,
  Share2,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';

const Feedpage: React.FC = () => {
  const { theme } = useAppStore();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [igData, setIgData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch live data from Supabase
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const { data, error } = await supabase
          .from('instagram_feed')
          .select('*')
          .order('event_date', { ascending: false });
        
        if (error) throw error;
        if (data) setIgData(data);
      } catch (err) {
        console.error("Error fetching mosque updates:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  // 2. YOUR ORIGINAL LOGIC: Parsing March 2026 events via Regex
  const eventDates = useMemo(() => {
    return igData.map(post => {
      // Still using your regex to find the date within the caption string
      const dateMatch = post.caption?.match(/(\d{1,2})\s(Mac|Februari)\s2026/);
      if (dateMatch) {
        const monthMap: { [key: string]: number } = { 'Februari': 1, 'Mac': 2 };
        return {
          postId: post.id,
          dateString: new Date(2026, monthMap[dateMatch[2]], parseInt(dateMatch[1])).toDateString()
        };
      }
      return null;
    }).filter(Boolean);
  }, [igData]);

  const activePost = useMemo(() => {
    if (!selectedDate) return null;
    const selectedStr = selectedDate.toDateString();
    const found = eventDates.find(ed => ed?.dateString === selectedStr);
    return found ? igData.find(p => p.id === found.postId) : null;
  }, [selectedDate, eventDates, igData]);

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month' && eventDates.find(ed => ed?.dateString === date.toDateString())) {
      return 'event-tile'; 
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg-base text-accent-primary">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="font-display font-bold text-xl">Syncing with Mosque Feed...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base text-text-primary pb-24 font-body transition-colors duration-300">
      <nav className="sticky top-0 z-50 bg-bg-surface/70 backdrop-blur-xl border-b border-border-color px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-accent-warm uppercase tracking-tighter">Community</span>
            <h1 className="text-2xl font-display font-bold">Mosque Updates</h1>
          </div>
          <button className="p-2 rounded-full bg-bg-surface border border-border-color text-text-secondary shadow-sm hover:text-accent-primary transition-colors">
            <Bell size={20} />
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-10">
        <section className="bg-bg-surface rounded-3xl p-6 border border-border-color shadow-xl shadow-accent-primary/5">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-accent-warm/20 text-accent-warm">
                <CalIcon size={22} />
              </div>
              <h2 className="text-lg font-bold">Event Schedule</h2>
            </div>
            <span className="text-xs font-medium text-text-muted">Ramadan 1447H</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className={`modern-calendar flex justify-center ${theme === 'light' ? 'light-calendar' : ''}`}>
              <Calendar 
                onChange={(val) => setSelectedDate(val as Date)} 
                value={selectedDate}
                tileClassName={tileClassName}
                next2Label={null}
                prev2Label={null}
                className="w-full max-w-md"
              />
            </div>

            <div className="flex flex-col h-full justify-center space-y-4">
              {activePost ? (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-accent-primary/10 to-transparent border border-accent-primary/20 animate-in zoom-in-95 duration-300 h-full flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold py-1 px-2 rounded-md bg-accent-primary text-white uppercase tracking-widest">
                      Event Detail
                    </span>
                    <button 
                       onClick={() => document.getElementById(activePost.id)?.scrollIntoView({ behavior: 'smooth' })}
                       className="p-2 rounded-full bg-accent-primary text-white shadow-lg active:scale-90 transition-transform"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Selected Event:</h3>
                  <p className="text-sm text-text-secondary italic leading-relaxed">
                    "{activePost.caption.substring(0, 180)}..."
                  </p>
                  <p className="mt-4 text-xs font-bold text-accent-primary flex items-center gap-1 uppercase tracking-wide">
                     <MapPin size={14} /> {activePost.location_name || "Masjid Al-Malik Khalid"}
                  </p>
                </div>
              ) : (
                <div className="h-full min-h-[200px] flex flex-col items-center justify-center border-2 border-dashed border-border-color rounded-2xl text-center p-6 text-text-muted">
                  <CalIcon size={40} className="mb-3 opacity-20" />
                  <p className="text-sm">Click a highlighted date on the calendar to see event details here.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="max-w-2xl mx-auto space-y-12">
          {igData.map((post) => (
            <article 
              key={post.id} 
              id={post.id}
              className={`group relative bg-bg-surface rounded-[2.5rem] border transition-all duration-500 hover:shadow-2xl ${
                activePost?.id === post.id ? 'border-accent-primary ring-4 ring-accent-primary/10' : 'border-border-color'
              }`}
            >
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-accent-primary to-accent-warm p-[2px]">
                      <div className="w-full h-full rounded-full bg-bg-surface flex items-center justify-center font-bold text-accent-primary text-xs">
                        USM
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-sm leading-tight">Pusat Islam USM</p>
                    <p className="text-xs text-text-muted flex items-center gap-1 font-medium">
                      <MapPin size={12} className="text-accent-warm" /> {post.location_name || "Masjid Al-Malik Khalid"}
                    </p>
                  </div>
                </div>
                <button className="text-text-muted hover:text-text-primary transition-colors">
                  <Share2 size={20} />
                </button>
              </div>

              <div className="aspect-square bg-bg-base mx-4 rounded-[2rem] overflow-hidden relative shadow-inner">
                <img 
                  src={`https://images.weserv.nl/?url=${encodeURIComponent(post.display_url)}`} 
                  alt="Post content" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-6">
                    <button className="flex items-center gap-2 group/heart">
                      <Heart size={24} className="text-text-muted group-heart:text-rose-500 transition-colors" />
                      <span className="text-sm font-bold text-text-secondary">{post.likes_count}</span>
                    </button>
                  </div>
                  <a 
                    href={post.ig_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-3 bg-bg-base border border-border-color rounded-2xl text-accent-primary hover:bg-accent-primary hover:text-white transition-all shadow-sm"
                  >
                    <ExternalLink size={20} />
                  </a>
                </div>
                
                <div className="bg-bg-base/50 p-4 rounded-2xl border border-border-color/50 text-text-secondary text-sm italic whitespace-pre-wrap leading-relaxed">
                  {post.caption}
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Feedpage;