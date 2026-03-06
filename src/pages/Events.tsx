import { useState, useEffect } from 'react';
import { ChevronLeft, Calendar, Clock, MapPin, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

interface EventData {
  id: string;
  title: string;
  type: 'taraweeh' | 'ceramah' | 'class' | 'community';
  date: string;
  time: string;
  location: string;
  description: string;
}

export default function Events() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [showUpcoming, setShowUpcoming] = useState(true);
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // AbortController prevents stale results when the user rapidly changes filters
    const controller = new AbortController();
    fetchEvents(controller.signal);
    return () => controller.abort();
  }, [activeFilter, showUpcoming]);

  const fetchEvents = async (signal?: AbortSignal) => {
    try {
      setLoading(true);

      let query = supabase
        .from('events')
        .select('*')
        .eq('is_active', true);

      if (activeFilter !== 'all') {
        query = query.eq('type', activeFilter);
      }

      if (showUpcoming) {
        query = query.gte('event_date', new Date().toISOString().split('T')[0]);
      }

      const { data, error } = await query
        .order('event_date', { ascending: true })
        .order('event_time', { ascending: true });

      // Ignore results if the effect was cleaned up (filters changed mid-flight)
      if (signal?.aborted) return;
      if (error) throw error;

      const formattedEvents: EventData[] = (data || []).map(event => ({
        id: event.id,
        title: event.title,
        type: event.type as EventData['type'],
        date: event.event_date,
        time: event.event_time || 'TBA',
        location: event.location || 'TBA',
        description: event.description || '',
      }));

      setEvents(formattedEvents);
    } catch (error) {
      if (signal?.aborted) return; // suppressed — intentional abort
      console.error('Error fetching events:', error);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'taraweeh': return 'bg-purple-500/20 text-purple-500';
      case 'ceramah': return 'bg-orange-500/20 text-orange-500';
      case 'class': return 'bg-teal-500/20 text-teal-500';
      case 'community': return 'bg-green-500/20 text-green-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  return (
    <div className="min-h-screen bg-bg-base">
      <header className="sticky top-0 z-40 bg-bg-base/80 backdrop-blur-md border-b border-border-color">
        <div className="flex items-center gap-2 px-4 py-4">
          <Link to="/home" className="p-2 -ml-2 rounded-full hover:bg-bg-surface">
            <ChevronLeft size={24} className="text-text-primary" />
          </Link>
          <h1 className="font-display text-xl text-text-primary">Events</h1>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['all', 'taraweeh', 'ceramah', 'class', 'community'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-body whitespace-nowrap ${
                activeFilter === filter
                  ? 'bg-accent-primary text-white'
                  : 'bg-bg-surface border border-border-color text-text-secondary'
              }`}
            >
              {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        {/* Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowUpcoming(true)}
            className={`flex-1 py-2 rounded-xl text-sm font-body ${
              showUpcoming ? 'bg-accent-warm text-white' : 'bg-bg-surface text-text-secondary'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setShowUpcoming(false)}
            className={`flex-1 py-2 rounded-xl text-sm font-body ${
              !showUpcoming ? 'bg-accent-warm text-white' : 'bg-bg-surface text-text-secondary'
            }`}
          >
            Past
          </button>
        </div>

        {/* Events List */}
        <div className="space-y-3">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-accent-primary" size={32} />
            </div>
          ) : events.length > 0 ? (
            events.map((event) => (
              <div key={event.id} className="p-4 rounded-2xl bg-bg-surface border border-border-color">
                <div className="flex items-start justify-between mb-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(event.type)}`}>
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </span>
                </div>
                <h3 className="font-body font-semibold text-text-primary mb-2">{event.title}</h3>
                <div className="space-y-1 mb-3">
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Calendar size={14} />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Clock size={14} />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <MapPin size={14} />
                    <span>{event.location}</span>
                  </div>
                </div>
                <p className="font-body text-sm text-text-muted">{event.description}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Calendar size={48} className="mx-auto text-text-muted mb-4" />
              <p className="font-body text-text-secondary">No upcoming events</p>
              <p className="font-body text-sm text-text-muted">Check back soon!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

