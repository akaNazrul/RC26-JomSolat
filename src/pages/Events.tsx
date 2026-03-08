import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, Calendar, Clock, MapPin, CalendarPlus, Loader2, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

interface EventData {
  id: string;
  title: string;
  type: 'taraweeh' | 'ceramah' | 'class' | 'community' | 'general';
  date: string;
  time: string;
  location: string;
  description: string;
  ig_url: string;
}

export default function Events() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [showUpcoming, setShowUpcoming] = useState(true);
  const [rawPosts, setRawPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLiveFeed();
  }, []);

  const fetchLiveFeed = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('instagram_feed')
        .select('*')
        .order('event_date', { ascending: false });

      if (error) throw error;
      setRawPosts(data || []);
    } catch (error) {
      console.error('Error syncing events:', error);
    } finally {
      setLoading(false);
    }
  };

  // 🧠 Your Regex Logic: Parsing the Instagram feed into structured Events
  const events = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return rawPosts.map(post => {
      const caption = post.caption || "";
      
      // 1. Extract Date (Your specific format: "10 Mac 2026")
      const dateMatch = caption.match(/(\d{1,2})\s(Mac|Februari)\s2026/);
      if (!dateMatch) return null;

      const monthMap: { [key: string]: number } = { 'Februari': 1, 'Mac': 2 };
      const eventDate = new Date(2026, monthMap[dateMatch[2]], parseInt(dateMatch[1]));
      
      // 2. Determine Type via Keyword
      let type: EventData['type'] = 'general';
      if (caption.toLowerCase().includes('taraweeh')) type = 'taraweeh';
      else if (caption.toLowerCase().includes('ceramah') || caption.toLowerCase().includes('kuliah')) type = 'ceramah';
      else if (caption.toLowerCase().includes('kelas') || caption.toLowerCase().includes('pengajian')) type = 'class';
      else if (caption.toLowerCase().includes('iftar') || caption.toLowerCase().includes('rewang')) type = 'community';

      // 3. Extract Time (Looking for format like "8:30 PM" or "20:30")
      const timeMatch = caption.match(/(\d{1,2}[:.]\d{2}\s?(?:AM|PM|am|pm)?)/);

      return {
        id: post.id,
        title: caption.split('\n')[0].substring(0, 40) + "...", // Uses first line as title
        type,
        date: eventDate.toISOString(),
        time: timeMatch ? timeMatch[0] : 'Check IG',
        location: post.location_name || 'Masjid Al-Malik Khalid, USM',
        description: caption.substring(0, 120) + "...",
        ig_url: post.ig_url
      };
    }).filter(Boolean)
      .filter(event => {
        // Apply Filter Tabs
        if (activeFilter !== 'all' && event?.type !== activeFilter) return false;
        
        // Apply Upcoming/Past Toggle
        const eDate = new Date(event!.date);
        return showUpcoming ? eDate >= today : eDate < today;
      }) as EventData[];
  }, [rawPosts, activeFilter, showUpcoming]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'taraweeh': return 'bg-purple-500/20 text-purple-500';
      case 'ceramah': return 'bg-orange-500/20 text-orange-500';
      case 'class': return 'bg-teal-500/20 text-teal-500';
      case 'community': return 'bg-green-500/20 text-green-500';
      default: return 'bg-accent-primary/20 text-accent-primary';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  return (
    <div className="min-h-screen bg-bg-base pb-20">
      <header className="sticky top-0 z-40 bg-bg-base/80 backdrop-blur-md border-b border-border-color">
        <div className="flex items-center gap-2 px-4 py-4">
          <Link to="/home" className="p-2 -ml-2 rounded-full hover:bg-bg-surface">
            <ChevronLeft size={24} className="text-text-primary" />
          </Link>
          <div className="flex flex-col">
            <h1 className="font-display text-xl text-text-primary">Mosque Events</h1>
            <span className="text-[10px] text-accent-warm font-bold uppercase tracking-widest">Live from Instagram</span>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {['all', 'taraweeh', 'ceramah', 'class', 'community'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-body font-medium whitespace-nowrap transition-all ${
                activeFilter === filter
                  ? 'bg-accent-primary text-white shadow-lg shadow-accent-primary/20'
                  : 'bg-bg-surface border border-border-color text-text-secondary hover:border-accent-primary/50'
              }`}
            >
              {filter === 'all' ? 'All Updates' : filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        {/* Toggle */}
        <div className="flex p-1 bg-bg-surface rounded-2xl border border-border-color">
          <button
            onClick={() => setShowUpcoming(true)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
              showUpcoming ? 'bg-accent-warm text-white shadow-md' : 'text-text-muted'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setShowUpcoming(false)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
              !showUpcoming ? 'bg-accent-warm text-white shadow-md' : 'text-text-muted'
            }`}
          >
            Past
          </button>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-accent-primary" size={40} />
              <p className="text-sm text-text-muted font-medium">Syncing with Pusat Islam USM...</p>
            </div>
          ) : events.length > 0 ? (
            events.map((event) => (
              <div key={event.id} className="group p-5 rounded-[2rem] bg-bg-surface border border-border-color hover:border-accent-primary/30 transition-all hover:shadow-xl hover:shadow-accent-primary/5">
                <div className="flex items-start justify-between mb-4">
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${getTypeColor(event.type)}`}>
                    {event.type}
                  </span>
                  <div className="flex gap-2">
                    <a href={event.ig_url} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-bg-base text-text-muted hover:text-accent-primary transition-colors border border-border-color">
                      <Instagram size={18} />
                    </a>
                    <button className="p-2 rounded-xl bg-accent-primary text-white shadow-md active:scale-90 transition-transform">
                      <CalendarPlus size={18} />
                    </button>
                  </div>
                </div>
                
                <h3 className="font-display font-bold text-lg text-text-primary mb-3 group-hover:text-accent-primary transition-colors">{event.title}</h3>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-bg-base border border-border-color/50">
                    <div className="p-1.5 rounded-lg bg-accent-warm/10 text-accent-warm">
                      <Calendar size={14} />
                    </div>
                    <span className="text-[11px] font-bold text-text-secondary truncate">{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-bg-base border border-border-color/50">
                    <div className="p-1.5 rounded-lg bg-accent-primary/10 text-accent-primary">
                      <Clock size={14} />
                    </div>
                    <span className="text-[11px] font-bold text-text-secondary">{event.time}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-text-muted mb-4 px-1">
                  <MapPin size={14} className="text-accent-warm" />
                  <span className="font-medium">{event.location}</span>
                </div>
                
                <p className="font-body text-sm text-text-secondary leading-relaxed bg-bg-base/30 p-3 rounded-xl italic">
                  "{event.description}"
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-bg-surface rounded-[2rem] border-2 border-dashed border-border-color">
              <Calendar size={48} className="mx-auto text-text-muted/20 mb-4" />
              <p className="font-display font-bold text-text-primary">No {showUpcoming ? 'Upcoming' : 'Past'} Events</p>
              <p className="font-body text-sm text-text-muted px-10">We couldn't find any events matching this filter from the recent mosque updates.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}