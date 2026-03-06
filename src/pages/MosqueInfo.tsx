import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Phone, Mail, Globe, MapPin, Heart, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const QR_SRC = '/assets/Screenshot 2026-03-05 181900.png';

export default function MosqueInfo() {
  const [qrEnlarged, setQrEnlarged] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Close on Escape key, auto-focus close button when modal opens
  useEffect(() => {
    if (!qrEnlarged) return;
    closeButtonRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setQrEnlarged(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [qrEnlarged]);

  const infoRows = [
    { icon: MapPin, label: 'Address', value: 'Universiti Sains Malaysia, 11800 USM, Penang' },
    { icon: Phone, label: 'Phone', value: '04-653 3910/3753' },
    { icon: Mail, label: 'Email', value: 'pusatislamusminduk@gmail.com' },
    { icon: Globe, label: 'Website', value: 'pusatislam.usm.my' },
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
          <p className="font-body text-sm text-text-secondary leading-relaxed text-justify">
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

        {/* Social Links */}
        <div className="flex justify-center gap-4">
          <a href="https://www.facebook.com/PusatIslamUSM" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-bg-surface border border-border-color hover:bg-bg-elevated" aria-label="Facebook">
            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
          <a href="https://www.instagram.com/pusatislam.usm" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-bg-surface border border-border-color hover:bg-bg-elevated" aria-label="Instagram">
            <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </a>
          <a href="https://www.whatsapp.com/channel/0029VawbEsKKrWR5aL8cdc1a" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-bg-surface border border-border-color hover:bg-bg-elevated" aria-label="WhatsApp">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </a>
          <a href="https://t.me/pusatislamusm" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-bg-surface border border-border-color hover:bg-bg-elevated" aria-label="Telegram">
            <svg className="w-5 h-5 text-sky-500" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
          </a>
        </div>

        {/* Donation */}
        <div className="p-4 rounded-2xl bg-bg-surface border border-border-color text-center">
          <Heart size={24} className="text-accent-warm mx-auto mb-2" />
          <h3 className="font-body font-semibold text-text-primary mb-1">Support the Mosque</h3>
          <p className="font-body text-sm text-text-secondary mb-3">Your donations help us maintain and improve our services</p>
          <button
            onClick={() => setQrEnlarged(true)}
            className="group mx-auto block focus:outline-none"
            aria-label="Enlarge QR code"
          >
            <img
              src={QR_SRC}
              alt="Donation QR Code"
              className="w-36 h-36 mx-auto bg-white rounded-xl object-contain ring-2 ring-transparent group-hover:ring-accent-warm transition-all"
            />
            <p className="font-body text-xs text-text-muted mt-2 group-hover:text-accent-warm transition-colors">
              Click to enlarge
            </p>
          </button>
        </div>

        {/* QR Lightbox */}
        {qrEnlarged && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={() => setQrEnlarged(false)}
          >
            <div
              className="relative bg-white rounded-2xl p-4 shadow-2xl mx-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                ref={closeButtonRef}
                onClick={() => setQrEnlarged(false)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Close"
              >
                <X size={18} className="text-gray-700" />
              </button>
              <img
                src={QR_SRC}
                alt="Donation QR Code (enlarged)"
                className="w-full rounded-xl object-contain"
              />
              <p className="text-center font-body text-sm text-gray-500 mt-3">Scan to Donate</p>
            </div>
          </div>
        )}

        {/* Map */}
        <div className="h-48 rounded-2xl overflow-hidden bg-bg-surface border border-border-color">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3972.4134702551137!2d100.29939657438402!3d5.353702294625012!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x304ac165719f8797%3A0xd395a96db0a73e32!2sAl-Malik%20Khalid%20Mosque!5e0!3m2!1sen!2smy!4v1772789538774!5m2!1sen!2smy"
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

