import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, CalendarDays, MapPin, Moon, Sun } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { PRAYER_ORDER, formatTime, type PrayerTimeData } from '@/lib/prayerTimes';

// Constants for images
const HERO_IMAGES = [
  '/assets/masjid-drone-view.png',
  '/assets/masjidUSM-topView.png',
  '/assets/masjidUSM-lowAngle.png'
];

export default function Landing() {
  const { theme, toggleTheme, fetchPrayerData } = useAppStore();
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimeData | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Use cached prayer data from store
    fetchPrayerData().then(setPrayerTimes);
  }, []);

  // Image slider effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000); // Change image every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] md:min-h-screen flex flex-col justify-center">
        {/* Background Image Slider */}
        {HERO_IMAGES.map((img, index) => (
          <div 
            key={img}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out pointer-events-none ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none" />
        
        {/* Bottom gradient to blend smoothly into the rest of the page */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg-base to-transparent z-10 pointer-events-none" />

        {/* Header */}
        <header className="absolute top-0 inset-x-0 z-50 flex items-center justify-between px-4 md:px-8 lg:px-12 py-6 pointer-events-auto">
          <div className="flex items-center gap-2">
            <img
              src="/assets/v2-SVG.svg"
              alt="JomSolat"
              className="h-10 md:h-12 w-auto brightness-0 invert drop-shadow-md transition-all duration-300"
            />
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 md:p-2.5 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-colors border border-white/10"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {/* Get Started - Visible on all screen sizes */}
            <Link
              to="/signup"
              className="flex py-2 md:py-2.5 px-4 md:px-6 rounded-full bg-[#62b959] text-white font-body font-semibold text-xs md:text-sm hover:bg-[#52a04a] transition-all shadow-lg"
            >
              Get Started
            </Link>
          </div>
        </header>

        {/* Hero Content */}
        <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 text-center pt-24 md:pt-20">
          {/* Main Headline */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-white mb-6 leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Your Masjid.<br />Your Community.<br />Your Daily Guide.
          </h1>
          
          {/* Subheadline */}
          <p className="font-body text-base sm:text-lg md:text-xl text-white/90 max-w-md mb-10 drop-shadow-md px-4">
            Prayer times, events, and everything about Masjid Al-Malik Khalid USM — in one place.
          </p>
          
<<<<<<< HEAD
          <div className="flex justify-center">
            {/* Learn More */}
            <button
              onClick={() => scrollToSection('heritage')}
              className="py-3.5 px-8 rounded-full bg-transparent border-2 border-white/80 text-white font-body font-bold text-base transition-all hover:bg-white/10 shadow-lg w-full max-w-xs"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Dynamic Carousel Indicators */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {HERO_IMAGES.map((_, index) => (
            <div 
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-8 h-1.5 cursor-pointer transition-colors duration-300 ${
                index === currentImageIndex ? 'bg-[#62b959]' : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Mosque Heritage Section */}
      <section id="heritage" className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-body font-semibold text-accent-warm uppercase tracking-widest mb-4">
            A Brief History
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-text-primary mb-6">
            Where Faith Meets the Heart of USM
          </h2>
          <div className="font-body text-sm md:text-base text-text-secondary leading-relaxed space-y-4 text-justify">
            <p>
              Masjid Al-Malik Khalid stands as the spiritual anchor of Universiti Sains Malaysia's Induk campus in Gelugor, Penang. Named after the late King Khalid of Saudi Arabia, whose generous contribution made its construction possible, the mosque has served the USM community for decades, welcoming students, lecturers, staff, and the surrounding Gelugor neighbourhood to gather, pray, and reflect together.
            </p>
            <p>
              Managed by Pusat Islam USM, the mosque is more than a place of worship. It hosts Islamic education programmes, Ramadan taraweeh prayers, Friday ceramah, community welfare initiatives, and daily congregational prayers, forming the beating heart of Muslim campus life at USM.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-bg-surface">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-body font-semibold text-accent-warm uppercase tracking-widest mb-4">
            What's Inside
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-text-primary mb-4">
            Everything You Need, Always at Hand
          </h2>
          <p className="font-body text-text-secondary mb-8 text-justify">
            JomSolat brings together all the information you need about Masjid Al-Malik Khalid — so you spend less time searching and more time ibadah.
          </p>

          <div className="space-y-4">
            {/* Feature Card 1 */}
            <div className="p-4 rounded-2xl bg-bg-base border border-border-color">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-accent-primary/20">
                  <Clock className="text-accent-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-body font-semibold text-text-primary mb-1 ">Live Prayer Times</h3>
                  <p className="font-body text-sm text-text-secondary text-justify">
                    Accurate Gelugor-zone prayer times powered by JAKIM data. A live donut countdown always shows you exactly how long until the next prayer that updated every second.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="p-4 rounded-2xl bg-bg-base border border-border-color">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-accent-warm/20">
                  <CalendarDays className="text-accent-warm" size={24} />
                </div>
                <div>
                  <h3 className="font-body font-semibold text-text-primary mb-1">Events & Programmes</h3>
                  <p className="font-body text-sm text-text-secondary text-justify">
                    Taraweeh schedules, Friday ceramah, Islamic classes, and community events, all in one updated feed. Never miss what's happening at your mosque.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="p-4 rounded-2xl bg-bg-base border border-border-color">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-green-500/20">
                  <MapPin className="text-green-500" size={24} />
                </div>
                <div>
                  <h3 className="font-body font-semibold text-text-primary mb-1">Complete Mosque Guide</h3>
                  <p className="font-body text-sm text-text-secondary text-justify">
                    Wudhu facilities, women's section, wheelchair access, parking zones, and full contact details. Everything a first-timer or regular needs to know.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prayer Times Preview */}
      <section className="py-16 px-4">
        <div className="max-w-md mx-auto">
          <p className="text-xs font-body font-semibold text-accent-warm uppercase tracking-widest mb-4 text-center">
            Today's Prayer Times · Gelugor, Penang
          </p>
          
          {prayerTimes ? (
            <div className="p-5 rounded-2xl bg-bg-surface border border-border-color">
              {PRAYER_ORDER.map((prayer) => {
                const prayerTime = prayerTimes[prayer.key as keyof PrayerTimeData] as string;
                return (
                  <div
                    key={prayer.key}
                    className="flex items-center justify-between py-3 border-b border-border-color last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-arabic text-xl md:text-2xl text-text-secondary">{prayer.nameAr}</span>
                      <span className="font-body font-medium text-lg md:text-xl text-text-primary">{prayer.label}</span>
                    </div>
                    <span className="font-body text-lg md:text-xl text-text-primary">
                      {prayerTime ? formatTime(prayerTime) : '--:--'}
                    </span>
                  </div>
                );
              })}
              
              <p className="mt-4 text-sm text-text-secondary text-center">
                Sign up to unlock reminders, events, and your personal prayer tracker →
              </p>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-bg-surface border border-border-color animate-pulse">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 border-b border-border-color last:border-0 skeleton" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-bg-surface">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl text-text-primary mb-4">
            Join the JomSolat Community
          </h2>
          <p className="font-body text-text-secondary mb-8">
            Created by students, for the USM community. Free forever. No ads. Just your masjid.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/signup"
              className="py-4 px-8 rounded-full bg-accent-warm text-white font-body font-semibold hover:bg-accent-warm/90 transition-colors"
            >
              Create Free Account
            </Link>
            <Link
              to="/mosque-info"
              className="py-4 px-8 rounded-full border border-text-secondary/30 text-text-primary font-body font-medium hover:bg-bg-base/50 transition-colors"
            >
              Learn More
            </Link>
          </div>

          {/* KrackedDevs Promo */}
          <div className="mt-12 pt-8 border-t border-border-color">
            <p className="text-xs text-text-muted mb-2">
              Built during Ramadan 2026 as part of Kracked Devs RC26
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-primary/20">
              <span className="text-sm font-body font-medium text-accent-primary">KrackedDevs RC26</span>
            </div>
          </div>

          <p className="mt-8 text-xs text-text-muted">
            © 2026 JomSolat — Team Murtabug · krackeddevs.com · Pusat Islam USM
          </p>
        </div>
      </section>
    </div>
  );
}

