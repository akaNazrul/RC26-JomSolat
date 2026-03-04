import { ChevronLeft, Phone, Mail, Globe, MapPin, Clock, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MosqueInfo() {
  const infoRows = [
    { icon: MapPin, label: 'Address', value: 'Pusat Islam USM, Universiti Sains Malaysia, 11800 Gelugor, Penang' },
    { icon: Phone, label: 'Phone', value: '+604-653 5432' },
    { icon: Mail, label: 'Email', value: 'pusatislam@usm.my' },
    { icon: Globe, label: 'Website', value: 'pusatislam.usm.my' },
  ];

  const operatingHours = [
    { day: 'Monday - Thursday', hours: '7:00 AM - 10:00 PM' },
    { day: 'Friday', hours: '7:00 AM - 12:00 PM (Closed for Jumu\'ah)' },
    { day: 'Friday (After Jumu\'ah)', hours: '2:00 PM - 10:00 PM' },
    { day: 'Saturday - Sunday', hours: '7:00 AM - 10:00 PM' },
  ];

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-bg-base/80 backdrop-blur-md border-b border-border-color">
        <div className="flex items-center gap-2 px-4 py-4">
          <Link to="/home" className="p-2 -ml-2 rounded-full hover:bg-bg-surface">
            <ChevronLeft size={24} className="text-text-primary" />
          </Link>
          <h1 className="font-display text-xl text-text-primary">Mosque Info</h1>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Hero */}
        <div className="relative h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-accent-primary to-purple-900">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="font-arabic text-4xl text-amber-200 mb-2">مسجد الملك خالد</p>
              <h2 className="font-display text-2xl text-white">Masjid Al-Malik Khalid</h2>
              <p className="font-body text-sm text-white/70">Pusat Islam USM</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="p-4 rounded-2xl bg-bg-surface border border-border-color">
          <p className="font-body text-sm text-text-secondary leading-relaxed">
            Masjid Al-Malik Khalid stands as the spiritual anchor of Universiti Sains Malaysia's Induk campus in Gelugor, Penang. Named after the late King Khalid of Saudi Arabia, the mosque welcomes students, lecturers, staff, and the surrounding community to gather, pray, and reflect together.
          </p>
        </div>

        {/* Info Rows */}
        <div className="space-y-3">
          {infoRows.map((row, index) => (
            <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-bg-surface border border-border-color">
              <div className="p-2 rounded-lg bg-accent-primary/20">
                <row.icon size={20} className="text-accent-primary" />
              </div>
              <div>
                <p className="font-body text-xs text-text-muted">{row.label}</p>
                <p className="font-body text-sm text-text-primary">{row.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Operating Hours */}
        <div className="p-4 rounded-2xl bg-bg-surface border border-border-color">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={18} className="text-accent-primary" />
            <h3 className="font-body font-semibold text-text-primary">Operating Hours</h3>
          </div>
          <div className="space-y-2">
            {operatingHours.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span className="font-body text-sm text-text-secondary">{item.day}</span>
                <span className="font-body text-sm text-text-primary">{item.hours}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-bg-surface border border-border-color hover:bg-bg-elevated">
            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-bg-surface border border-border-color hover:bg-bg-elevated">
            <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </a>
        </div>

        {/* Donation */}
        <div className="p-4 rounded-2xl bg-bg-surface border border-border-color text-center">
          <Heart size={24} className="text-accent-warm mx-auto mb-2" />
          <h3 className="font-body font-semibold text-text-primary mb-1">Support the Mosque</h3>
          <p className="font-body text-sm text-text-secondary mb-3">Your donations help us maintain and improve our services</p>
          <div className="w-32 h-32 mx-auto bg-white rounded-xl flex items-center justify-center">
            <span className="text-xs text-gray-400">QR Code</span>
          </div>
          <p className="font-body text-xs text-text-muted mt-2">Scan to Donate</p>
        </div>

        {/* Map */}
        <div className="h-48 rounded-2xl overflow-hidden bg-bg-surface border border-border-color">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3971.974457576428!2d100.45616537462848!3d5.353072094587724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x304ac0f53a3d5a5b%3A0x33fdfa8c93c60ba1!2sMasjid%20Al-Malik%20Khalid%20(USM)!5e0!3m2!1sen!2smy!4v1706745600000!5m2!1sen!2smy"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Mosque Location"
          />
        </div>
      </div>
    </div>
  );
}

