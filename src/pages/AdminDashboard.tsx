import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, Plus, Calendar, Users, 
  Edit, Trash2, X, Loader2, ToggleLeft, ToggleRight
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import type { Event, User } from '@/types';

export default function AdminDashboard() {
  const { user } = useAppStore();
  const [activeTab, setActiveTab] = useState<'events' | 'users'>('events');
  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  
  // Form state
  const [eventForm, setEventForm] = useState({
    title: '',
    type: 'taraweeh',
    event_date: '',
    event_time: '',
    location: '',
    description: '',
  });

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (isAdmin) {
      if (activeTab === 'events') fetchEvents();
      if (activeTab === 'users') fetchUsers();
    }
  }, [activeTab, isAdmin]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEvent = async () => {
    try {
      setLoading(true);
      
      const eventData = {
        title: eventForm.title,
        type: eventForm.type as Event['type'],
        event_date: eventForm.event_date,
        event_time: eventForm.event_time || null,
        location: eventForm.location || null,
        description: eventForm.description || null,
        is_active: true,
        created_by: user?.id,
      };

      if (editingEvent) {
        // Update existing event
        const { error } = await supabase
          .from('events')
          .update({ ...eventData, updated_at: new Date().toISOString() })
          .eq('id', editingEvent.id);
        
        if (error) throw error;
      } else {
        // Create new event
        const { error } = await supabase
          .from('events')
          .insert(eventData);
        
        if (error) throw error;
      }

      setShowEventModal(false);
      setEditingEvent(null);
      resetEventForm();
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      setLoading(true);
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      // Optimistic local update — no refetch needed
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch (error) {
      console.error('Error deleting event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEventActive = async (event: Event) => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ is_active: !event.is_active, updated_at: new Date().toISOString() })
        .eq('id', event.id);

      if (error) throw error;
      // Optimistic local update — no refetch needed
      setEvents(prev => prev.map(e => e.id === event.id ? { ...e, is_active: !event.is_active } : e));
    } catch (error) {
      console.error('Error toggling event:', error);
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      // Optimistic local update — no refetch needed
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole as User['role'] } : u));
    } catch (error) {
      console.error('Error updating user role:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    
    try {
      setLoading(true);
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      // Optimistic local update — no refetch needed
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetEventForm = () => {
    setEventForm({
      title: '',
      type: 'taraweeh',
      event_date: '',
      event_time: '',
      location: '',
      description: '',
    });
  };

  const openEditEvent = (event: Event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      type: event.type,
      event_date: event.event_date,
      event_time: event.event_time || '',
      location: event.location || '',
      description: event.description || '',
    });
    setShowEventModal(true);
  };

  const openNewEvent = () => {
    setEditingEvent(null);
    resetEventForm();
    setShowEventModal(true);
  };

  // If not admin, show access denied
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="font-display text-2xl text-text-primary mb-2">Access Denied</h1>
          <p className="font-body text-text-secondary">You need admin privileges to access this page.</p>
          <Link to="/profile" className="inline-block mt-4 text-accent-primary">
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-bg-base/80 backdrop-blur-md border-b border-border-color">
        <div className="flex items-center gap-2 px-4 py-4">
          <Link to="/profile" className="p-2 -ml-2 rounded-full hover:bg-bg-surface">
            <ChevronLeft size={24} className="text-text-primary" />
          </Link>
          <h1 className="font-display text-xl text-text-primary">Admin Dashboard</h1>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Tabs */}
        <div className="flex gap-2">
          {[
            { id: 'events', label: 'Events', icon: Calendar },
            { id: 'users', label: 'Users', icon: Users },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-body ${
                activeTab === tab.id
                  ? 'bg-accent-primary text-white'
                  : 'bg-bg-surface border border-border-color text-text-secondary'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="space-y-4">
            <button 
              onClick={openNewEvent}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-accent-warm text-white font-body font-semibold"
            >
              <Plus size={20} />
              Add Event
            </button>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin text-accent-primary" size={32} />
              </div>
            ) : events.length > 0 ? (
              <div className="space-y-3">
                {events.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 rounded-xl bg-bg-surface border border-border-color">
                    <div className="flex-1">
                      <h3 className="font-body font-medium text-text-primary">{event.title}</h3>
                      <p className="font-body text-sm text-text-muted">
                        {event.event_date} · {event.type}
                      </p>
                      <button 
                        onClick={() => handleToggleEventActive(event)}
                        className={`flex items-center gap-1 text-xs mt-1 ${event.is_active ? 'text-green-500' : 'text-gray-500'}`}
                      >
                        {event.is_active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                        {event.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => openEditEvent(event)}
                        className="p-2 rounded-full hover:bg-bg-base"
                      >
                        <Edit size={18} className="text-text-muted" />
                      </button>
                      <button 
                        onClick={() => handleDeleteEvent(event.id)}
                        className="p-2 rounded-full hover:bg-bg-base"
                      >
                        <Trash2 size={18} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar size={48} className="mx-auto text-text-muted mb-4" />
                <p className="font-body text-text-secondary">No events yet</p>
                <p className="font-body text-sm text-text-muted">Click "Add Event" to create one</p>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-3">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin text-accent-primary" size={32} />
              </div>
            ) : users.length > 0 ? (
              users.map((userItem) => (
                <div key={userItem.id} className="flex items-center justify-between p-4 rounded-xl bg-bg-surface border border-border-color">
                  <div>
                    <h3 className="font-body font-medium text-text-primary">{userItem.display_name}</h3>
                    <p className="font-body text-sm text-text-muted">{userItem.email}</p>
                    <p className="font-body text-xs text-text-muted">
                      {userItem.provider} · Joined {new Date(userItem.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={userItem.role}
                      onChange={(e) => handleUpdateUserRole(userItem.id, e.target.value)}
                      className="px-2 py-1 rounded-full text-xs bg-accent-primary/20 text-accent-primary border-none cursor-pointer"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button 
                      onClick={() => handleDeleteUser(userItem.id)}
                      className="p-1 rounded-full hover:bg-bg-base"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Users size={48} className="mx-auto text-text-muted mb-4" />
                <p className="font-body text-text-secondary">No users yet</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-bg-surface rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-xl text-text-primary">
                {editingEvent ? 'Edit Event' : 'Add Event'}
              </h2>
              <button onClick={() => setShowEventModal(false)}>
                <X size={24} className="text-text-muted" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-body text-sm text-text-secondary mb-1">Title *</label>
                <input
                  type="text"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-bg-base border border-border-color text-text-primary"
                  placeholder="Event title"
                />
              </div>

              <div>
                <label className="block font-body text-sm text-text-secondary mb-1">Type *</label>
                <select
                  value={eventForm.type}
                  onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-bg-base border border-border-color text-text-primary"
                >
                  <option value="taraweeh">Taraweeh</option>
                  <option value="ceramah">Ceramah</option>
                  <option value="class">Class</option>
                  <option value="community">Community</option>
                </select>
              </div>

              <div>
                <label className="block font-body text-sm text-text-secondary mb-1">Date *</label>
                <input
                  type="date"
                  value={eventForm.event_date}
                  onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-bg-base border border-border-color text-text-primary"
                />
              </div>

              <div>
                <label className="block font-body text-sm text-text-secondary mb-1">Time</label>
                <input
                  type="time"
                  value={eventForm.event_time}
                  onChange={(e) => setEventForm({ ...eventForm, event_time: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-bg-base border border-border-color text-text-primary"
                />
              </div>

              <div>
                <label className="block font-body text-sm text-text-secondary mb-1">Location</label>
                <input
                  type="text"
                  value={eventForm.location}
                  onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-bg-base border border-border-color text-text-primary"
                  placeholder="e.g., Main Prayer Hall"
                />
              </div>

              <div>
                <label className="block font-body text-sm text-text-secondary mb-1">Description</label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-bg-base border border-border-color text-text-primary"
                  rows={3}
                  placeholder="Event description"
                />
              </div>

              <button
                onClick={handleSaveEvent}
                disabled={loading || !eventForm.title || !eventForm.event_date}
                className="w-full py-3 rounded-xl bg-accent-warm text-white font-body font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Saving...
                  </>
                ) : (
                  <>
                    <Plus size={20} />
                    {editingEvent ? 'Update Event' : 'Create Event'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

