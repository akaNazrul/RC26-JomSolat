import type React from 'react';

export interface User {
  id: string;
  display_name: string;
  email: string;
  avatar_url: string | null;
  zone: 'gelugor' | 'usm' | 'manual';
  role: 'user' | 'admin';
  provider: 'email' | 'google';
  created_at: string;
  last_seen_at: string | null;
}

export interface Event {
  id: string;
  title: string;
  type: 'taraweeh' | 'ceramah' | 'class' | 'community';
  event_date: string;
  event_time: string | null;
  location: string | null;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface MosqueInfo {
  id: string;
  key: string;
  value: string;
  updated_at: string;
  updated_by: string | null;
}

export interface PrayerTimes {
  id: string;
  date: string;
  zone: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  fetched_at: string;
}

export interface PrayerOverride {
  id: string;
  date: string;
  prayer_name: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  override_time: string;
  reason: string | null;
  created_by: string;
}

export type Theme = 'dark' | 'light';

export interface Facility {
  id: string;
  // Lucide icon component (e.g. Waves, Car) — not a string
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  titleAr: string;
  status: 'available' | 'limited' | 'closed' | 'info';
  shortDescription: string;
  fullDescription: string;
}

export type EventType = 'taraweeh' | 'ceramah' | 'class' | 'community' | 'all';