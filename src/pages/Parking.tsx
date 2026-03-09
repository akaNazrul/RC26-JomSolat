import { useState } from 'react';
import { 
  ChevronLeft, MapPin, ExternalLink, 
  Clock, Info, X, Maximize2, Map as MapIcon 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Parking() {
  // 📸 State for the Expandable Photo Modal
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const photos = [
    { url: "/entrance_pic.png", label: "Main Entrance Gate" },
    { url: "/front_pic.png", label: "Front Gate Parking" },
    { url: "/main_pic.png", label: "Main Parking Area" },
    { url: "/back_pic.png", label: "Back Parking Area" },
    { url: "/extra_pic.png", label: "Extra Parking Area" }
  ];

  // 🗺️ This is the "Big Picture" that replaces the Google Map Frame
  const bigMapImage = "/heatmap.png";

  return (
    <div className="min-h-screen bg-bg-base pb-20 transition-colors duration-300">
      
      {/* 🖼️ Full Screen Lightbox Modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedPhoto(null)}
        >
          <button className="absolute top-6 right-6 p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors">
            <X size={24} />
          </button>
          <img 
            src={selectedPhoto} 
            className="max-w-full max-h-[85vh] rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300" 
            alt="Expanded view" 
          />
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-bg-base/80 backdrop-blur-md border-b border-border-color px-4 py-4">
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          <Link to="/home" className="p-2 -ml-2 rounded-full hover:bg-bg-surface transition-colors">
            <ChevronLeft size={24} className="text-text-primary" />
          </Link>
          <h1 className="font-display text-xl font-bold">Parking & Location</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-8">
        
        {/* 1. 📸 Top Photo Gallery (Expandable) */}
        <section className="space-y-4">
          <div className="flex items-end justify-between px-1">
            <h3 className="text-xs font-black uppercase tracking-widest text-text-muted">Entrance Previews</h3>
            <span className="text-[10px] text-accent-primary font-bold">Tap to expand</span>
          </div>
          <div className="flex gap-4 overflow-x-auto snap-x no-scrollbar pb-2">
            {photos.map((photo, i) => (
              <div 
                key={i} 
                className="flex-none w-52 snap-start group cursor-pointer"
                onClick={() => setSelectedPhoto(photo.url)}
              >
                <div className="relative aspect-square rounded-[2rem] overflow-hidden border-2 border-border-color transition-all group-hover:border-accent-primary shadow-lg">
                  <img 
                    src={photo.url} 
                    alt={photo.label} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                    <p className="text-[10px] font-bold uppercase tracking-tight">{photo.label}</p>
                    <Maximize2 size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. 🖼️ NEW: Big Map Picture Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
             <h3 className="text-xs font-black uppercase tracking-widest text-text-muted">Parking Layout</h3>
             <span className="text-[10px] text-accent-warm font-bold uppercase">USM Campus Blueprint</span>
          </div>
          <div 
            className="relative h-80 rounded-[2.5rem] overflow-hidden border-2 border-border-color shadow-2xl cursor-pointer group"
            onClick={() => setSelectedPhoto(bigMapImage)}
          >
            {/* The Big Picture */}
            <img 
              src={bigMapImage} 
              alt="Detailed Parking Map" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            
            {/* Floating Indicator */}
            <div className="absolute bottom-6 left-6 flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-white shadow-xl">
              <MapIcon size={18} className="text-accent-warm" />
              <span className="text-xs font-bold">Tap to view full map</span>
            </div>
          </div>
        </section>

        {/* 3. Walking Times from Campus Hostels */}
        <div className="p-6 rounded-[2.5rem] bg-bg-surface border border-border-color shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-accent-primary/10 rounded-xl text-accent-primary">
              <Clock size={20} />
            </div>
            <h3 className="font-display font-bold text-base text-text-primary">Estimated Walking Times</h3>
          </div>
          <div className="space-y-3">
            {[
              { from: 'Gerbang Utama (USM)', time: '15 min' },
              { from: 'Pusat Islam Entrance', time: '5 min' },
              { from: 'Hostel RST / Fajar', time: '15 min' }
            ].map((route) => (
              <div key={route.from} className="flex items-center justify-between p-4 rounded-2xl bg-bg-base border border-border-color/50">
                <div className="flex items-center gap-3">
                    <MapPin size={14} className="text-accent-warm" />
                    <span className="text-xs font-bold text-text-secondary">{route.from}</span>
                </div>
                <span className="text-xs font-black text-accent-primary">{route.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA: Navigation Intent */}
        <a
          href="https://www.google.com/maps/dir/?api=1&destination=Pusat+Islam+USM"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full py-5 rounded-[2rem] bg-accent-warm text-white font-bold shadow-xl shadow-accent-warm/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <ExternalLink size={20} />
          Open Live Navigation
        </a>

        {/* Informational Footer Note */}
        <div className="flex gap-4 p-5 bg-bg-surface rounded-[2rem] border border-border-color">
          <div className="p-2 bg-accent-primary/10 rounded-xl text-accent-primary shrink-0 h-fit">
            <Info size={18} />
          </div>
          <p className="text-[11px] text-text-muted leading-relaxed font-medium italic">
            <strong>USM Policy:</strong> Unauthorized parking on green areas is subject to clamping. Please use designated bays highlighted in the map above.
          </p>
        </div>

      </main>
    </div>
  );
}