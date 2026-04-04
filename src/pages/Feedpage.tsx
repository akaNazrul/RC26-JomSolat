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
  Loader2,
  Filter
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { usePageMetadata } from '@/hooks/usePageMetadata';

const Feedpage: React.FC = () => {
  const { theme } = useAppStore();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [igData, setIgData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [showUpcoming, setShowUpcoming] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const response = await fetch('/assets/feed/data.json');
        if (!response.ok) throw new Error('Failed to load feed data');
        
        const data = await response.json();
        if (Array.isArray(data)) {
          setIgData(data);
        }
      } catch (err) {
        console.error("Error fetching mosque updates:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  // Scroll to post from URL hash
  useEffect(() => {
    if (loading) return;
    const hash = window.location.hash.slice(1);
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [loading]);

  usePageMetadata(
    'Mosque Updates — JomSolat',
    'Latest community updates, events and announcements from Masjid Al-Malik Khalid (Pusat Islam USM).'
  );

  // THE INTELLIGENT ENGINE: Mapping, Categorizing, and Scoring
  const processedData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Define Keyword Clusters for USM Mosque
    const CLUSTERS = {
      taraweeh: ['taraweeh', 'terawih', 'witir', 'qiyam', 'solat sunat', 'isyak'],
      ceramah: ['ceramah', 'kuliah', 'tazkirah', 'ustaz', 'sharing', 'panel', 'ilmu'],
      class: ['kelas', 'pengajian', 'tadabbur', 'bengkel', 'workshop', 'halaqah', 'belajar'],
      community: ['iftar', 'berbuka', 'makan', 'rewang', 'gotong', 'sumbangan', 'sedekah']
    };

    return igData.map(post => {
      const caption = post.caption?.toLowerCase() || "";
      
      // 1. Regex Date Parsing (Your Signature Logic)
      const dateMatch = post.caption?.match(/(\d{1,2})\s(Mac|Februari)\s2026/);
      let parsedDate = null;
      if (dateMatch) {
        const monthMap: { [key: string]: number } = { 'Februari': 1, 'Mac': 2 };
        parsedDate = new Date(2026, monthMap[dateMatch[2]], parseInt(dateMatch[1]));
      }

      // 2. Category Scoring Logic
      let type = 'general';
      let maxScore = 0;

      Object.entries(CLUSTERS).forEach(([category, keywords]) => {
        const score = keywords.reduce((acc, word) => acc + (caption.includes(word) ? 1 : 0), 0);
        if (score > maxScore) {
          maxScore = score;
          type = category;
        }
      });

      return { ...post, parsedDate, type };
    });
  }, [igData]);

  // Filtering Logic for Upcoming/Past & Categories
  const filteredFeed = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return processedData.filter(post => {
      const categoryMatch = activeFilter === 'all' || post.type === activeFilter;
      
      let dateMatch = true;
      if (post.parsedDate) {
        dateMatch = showUpcoming ? post.parsedDate >= today : post.parsedDate < today;
      } else {
        // If no date found, only show in "Upcoming" as a recent update
        dateMatch = showUpcoming;
      }

      return categoryMatch && dateMatch;
    });
  }, [processedData, activeFilter, showUpcoming]);

  // Calendar Highlighting Logic
  const eventDatesStrings = useMemo(() => {
    return processedData
      .filter(p => p.parsedDate)
      .map(p => ({ id: p.id, dateStr: p.parsedDate!.toDateString() }));
  }, [processedData]);

  const activePostFromCalendar = useMemo(() => {
    if (!selectedDate) return null;
    const selectedStr = selectedDate.toDateString();
    const found = eventDatesStrings.find(ed => ed.dateStr === selectedStr);
    return found ? igData.find(p => p.id === found.id) : null;
  }, [selectedDate, eventDatesStrings, igData]);

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month' && eventDatesStrings.some(ed => ed.dateStr === date.toDateString())) {
      return 'event-tile'; 
    }
    return null;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'taraweeh': return 'bg-purple-500/20 text-purple-500';
      case 'ceramah': return 'bg-orange-500/20 text-orange-500';
      case 'class': return 'bg-teal-500/20 text-teal-500';
      case 'community': return 'bg-green-500/20 text-green-500';
      default: return 'bg-accent-primary/20 text-accent-primary';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg-base text-accent-primary">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="font-display font-bold text-xl">Loading Mosque Updates...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base text-text-primary pb-24 font-body transition-colors duration-300">
      <nav className="sticky top-0 z-50 bg-bg-surface/70 backdrop-blur-xl border-b border-border-color px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-accent-warm uppercase tracking-tighter">Community Hub</span>
            <h1 className="text-2xl font-display font-bold">Mosque Updates</h1>
          </div>
          <button className="p-2 rounded-full bg-bg-surface border border-border-color text-text-secondary shadow-sm hover:text-accent-primary">
            <Bell size={20} />
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-12">
        {/* Section 1: Interactive Calendar */}
        <section className="bg-bg-surface rounded-3xl p-6 border border-border-color shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-accent-warm/20 text-accent-warm"><CalIcon size={22} /></div>
              <h2 className="text-lg font-bold">Event Schedule</h2>
            </div>
            <span className="text-xs font-medium text-text-muted italic">Ramadan 1447H</span>
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

            <div className="flex flex-col h-full justify-center">
              {activePostFromCalendar ? (
                <div className="p-6 rounded-2xl bg-bg-base border border-accent-primary/20 animate-in zoom-in-95 duration-300">
                   <span className="text-[10px] font-bold py-1 px-3 rounded-md bg-accent-primary text-white uppercase tracking-widest mb-4 inline-block">Event Highlight</span>
                   <h3 className="font-bold text-lg mb-2">Happening this day:</h3>
                   <p className="text-sm text-text-secondary leading-relaxed mb-4">"{activePostFromCalendar.caption.substring(0, 160)}..."</p>
                   <button 
                    onClick={() => document.getElementById(activePostFromCalendar.id)?.scrollIntoView({ behavior: 'smooth' })}
                    className="flex items-center gap-2 text-xs font-bold text-accent-primary uppercase"
                   >
                     View Full Post <ChevronRight size={16} />
                   </button>
                </div>
              ) : (
                <div className="h-full min-h-[200px] flex flex-col items-center justify-center border-2 border-dashed border-border-color rounded-2xl text-center p-6 text-text-muted opacity-50">
                  <CalIcon size={40} className="mb-3" />
                  <p className="text-sm">Click an orange date on the calendar to see details.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Section 2: Controls & Feed */}
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="space-y-4">
            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              <div className="p-2 bg-bg-surface border border-border-color rounded-lg"><Filter size={18} className="text-text-muted" /></div>
              {['all', 'taraweeh', 'ceramah', 'class', 'community'].map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                    activeFilter === f ? 'bg-accent-primary text-white shadow-lg' : 'bg-bg-surface border border-border-color text-text-secondary'
                  }`}
                >
                  {f === 'all' ? 'All Updates' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {/* Time Toggle */}
            <div className="flex p-1 bg-bg-surface rounded-2xl border border-border-color max-w-[280px]">
              <button onClick={() => setShowUpcoming(true)} className={`flex-1 py-2 rounded-xl text-sm font-bold ${showUpcoming ? 'bg-accent-warm text-white' : 'text-text-muted'}`}>Upcoming</button>
              <button onClick={() => setShowUpcoming(false)} className={`flex-1 py-2 rounded-xl text-sm font-bold ${!showUpcoming ? 'bg-accent-warm text-white' : 'text-text-muted'}`}>Past</button>
            </div>
          </div>

          {/* Post Feed */}
          <div className="space-y-12">
            {filteredFeed.length > 0 ? (
              filteredFeed.map((post) => (
                <article key={post.id} id={post.id} className="bg-bg-surface rounded-[2.5rem] border border-border-color overflow-hidden hover:shadow-2xl transition-all duration-500">
                  <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-accent-primary to-accent-warm p-[2px]">
                        <div className="w-full h-full rounded-full bg-bg-surface flex items-center justify-center font-bold text-accent-primary text-xs">USM</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm">Pusat Islam USM</p>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ${getTypeColor(post.type)}`}>{post.type}</span>
                        </div>
                        <p className="text-xs text-text-muted flex items-center gap-1 font-medium"><MapPin size={12} className="text-accent-warm" /> {post.location_name || "Masjid Al-Malik Khalid"}</p>
                      </div>
                    </div>
                    <button className="text-text-muted hover:text-text-primary"><Share2 size={20} /></button>
                  </div>

                  <div className="aspect-square bg-bg-base mx-4 rounded-[2rem] overflow-hidden shadow-inner">
                    <img 
                      src={post.display_url} 
                      alt="Mosque post" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        if (!img.src.includes('data:')) {
                          img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23374151" width="400" height="400"/%3E%3Ctext fill="%239CA3AF" font-size="14" x="50%%" y="50%%" text-anchor="middle" dominant-baseline="middle"%3EImage not found%3C/text%3E%3C/svg%3E';
                        }
                      }}
                    />
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <button className="flex items-center gap-2 group"><Heart size={24} className="text-text-muted group-hover:text-rose-500" /><span className="text-sm font-bold text-text-secondary">{post.likes_count}</span></button>
                      <a href={post.ig_url} target="_blank" rel="noreferrer" className="p-3 bg-bg-base border border-border-color rounded-2xl text-accent-primary"><ExternalLink size={20} /></a>
                    </div>
                    <div className="bg-bg-base/50 p-4 rounded-2xl border border-border-color/50 text-text-secondary text-sm italic whitespace-pre-wrap">{post.caption}</div>
                  </div>
                </article>
              ))
            ) : (
              <div className="text-center py-20 bg-bg-surface rounded-[2.5rem] border border-dashed border-border-color">
                <CalIcon size={40} className="mx-auto text-text-muted opacity-20 mb-4" />
                <p className="font-bold text-text-primary">No results found</p>
                <p className="text-sm text-text-muted">Try switching between "Upcoming" and "Past" updates.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Feedpage;