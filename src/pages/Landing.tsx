import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, CalendarDays, MapPin, ChevronDown, Moon, Sun } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import DonutTimer from '@/components/DonutTimer';
import { fetchPrayerTimes, PRAYER_ORDER, formatTime } from '@/lib/prayerTimes';

export default function Landing() {
  const { theme, toggleTheme } = useAppStore();
  const [prayerTimes, setPrayerTimes] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Fetch prayer times on mount
    fetchPrayerTimes().then(setPrayerTimes);

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg-base z-10" />
        
        {/* Hero background */}
        <div className="absolute inset-0 bg-bg-base">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-accent-primary blur-3xl" />
            <div className="absolute bottom-40 right-10 w-80 h-80 rounded-full bg-accent-warm blur-3xl" />
          </div>
        </div>

        {/* Header */}
        <header className="relative z-20 flex items-center justify-between px-4 py-4 pt-12">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent-primary flex items-center justify-center">
              <span className="text-white font-arabic text-lg">م</span>
            </div>
            <span className="font-display text-xl text-text-primary">JomSolat</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-bg-surface/50 text-text-primary"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        {/* Hero Content */}
        <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 text-center pt-20">
          {/* Arabic Title */}
          <p className="font-arabic text-2xl text-amber-200/90 mb-4" style={{ textShadow: '0 0 20px rgba(251, 191, 36, 0.3)' }}>
            مسجد الملك خالد
          </p>
          
          {/* Main Headline */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-text-primary mb-4 leading-tight">
            Your Masjid.<br />Your Community.<br />Your Daily Guide.
          </h1>
          
          {/* Subheadline */}
          <p className="font-body text-base md:text-lg text-text-secondary max-w-md mb-8">
            Prayer times, events, and everything about Masjid Al-Malik Khalid USM — in one place.
          </p>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
            <Link
              to="/signup"
              className="flex-1 py-4 px-6 rounded-full bg-accent-warm text-white font-body font-semibold text-center hover:bg-accent-warm/90 transition-colors"
            >
              Get Started — It's Free
            </Link>
            <button
              onClick={() => scrollToSection('features')}
              className="flex-1 py-4 px-6 rounded-full border border-text-secondary/30 text-text-primary font-body font-medium text-center hover:bg-bg-surface/50 transition-colors"
            >
              Explore the Mosque
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="relative z-20 flex flex-col items-center pb-8 animate-bounce-gentle">
          <span className="text-xs text-text-muted mb-2">Scroll to discover</span>
          <ChevronDown size={20} className="text-text-muted" />
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
          <div className="font-body text-sm md:text-base text-text-secondary leading-relaxed space-y-4">
            <p>
              Masjid Al-Malik Khalid stands as the spiritual anchor of Universiti Sains Malaysia's Induk campus in Gelugor, Penang. Named after the late King Khalid of Saudi Arabia, whose generous contribution made its construction possible, the mosque has served the USM community for decades — welcoming students, lecturers, staff, and the surrounding Gelugor neighbourhood to gather, pray, and reflect together.
            </p>
            <p>
              Managed by Pusat Islam USM, the mosque is more than a place of worship. It hosts Islamic education programmes, Ramadan taraweeh prayers, Friday ceramah, community welfare initiatives, and daily congregational prayers — forming the beating heart of Muslim campus life at USM.
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
          <p className="font-body text-text-secondary mb-8">
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
                  <h3 className="font-body font-semibold text-text-primary mb-1">Live Prayer Times</h3>
                  <p className="font-body text-sm text-text-secondary">
                    Accurate Gelugor-zone prayer times powered by JAKIM data. A live donut countdown always shows you exactly how long until the next prayer — updated every second.
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
                  <p className="font-body text-sm text-text-secondary">
                    Taraweeh schedules, Friday ceramah, Islamic classes, and community events — all in one updated feed. Never miss what's happening at your mosque.
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
                  <p className="font-body text-sm text-text-secondary">
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
              {PRAYER_ORDER.map((prayer) => (
                <div
                  key={prayer.key}
                  className="flex items-center justify-between py-3 border-b border-border-color last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-arabic text-lg text-text-secondary">{prayer.nameAr}</span>
                    <span className="font-body font-medium text-text-primary">{prayer.label}</span>
                  </div>
                  <span className="font-body text-text-primary">
                    {formatTime(prayerTimes[prayer.key as keyof typeof prayerTimes])}
                  </span>
                </div>
              ))}
              
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

