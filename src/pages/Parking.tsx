import { ChevronLeft, Car, Bike, MapPin, ExternalLink, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Parking() {
  const parkingZones = [
    { type: 'car', icon: Car, color: 'bg-red-500', label: 'Car Parking', capacity: '~100+ spaces', description: 'Main parking area adjacent to mosque' },
    { type: 'motorcycle', icon: Bike, color: 'bg-blue-500', label: 'Motorcycle Parking', capacity: '~100+ spaces', description: 'Covered parking near main entrance' },
  ];

  const walkingRoutes = [
    { from: 'Main Gate (Gerbang Utama)', time: '15 min' },
    { from: 'Mosque Gate (Gerbang Masjid)', time: '5 min' },
    { from: 'RST Gate (Gerbang RST)', time: '15 min' },
  ];

  return (
    <div className="min-h-screen bg-bg-base">
      <header className="sticky top-0 z-40 bg-bg-base/80 backdrop-blur-md border-b border-border-color">
        <div className="flex items-center gap-2 px-4 py-4">
          <Link to="/home" className="p-2 -ml-2 rounded-full hover:bg-bg-surface">
            <ChevronLeft size={24} className="text-text-primary" />
          </Link>
          <h1 className="font-display text-xl text-text-primary">Parking & Location</h1>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Map */}
        <div className="h-64 rounded-2xl overflow-hidden bg-bg-surface border border-border-color">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3972.4134702551137!2d100.29939657438402!3d5.353702294625012!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x304ac165719f8797%3A0xd395a96db0a73e32!2sAl-Malik%20Khalid%20Mosque!5e0!3m2!1sen!2smy!4v1772789538774!5m2!1sen!2smy"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Parking Location"
          />
        </div>

        {/* Legend */}
        <div className="p-4 rounded-2xl bg-bg-surface border border-border-color">
          <h3 className="font-body font-semibold text-text-primary mb-3">Parking Zones</h3>
          <div className="space-y-3">
            {parkingZones.map((zone) => (
              <div key={zone.type} className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${zone.color}/20`}>
                  <zone.icon size={20} className={zone.color.replace('bg-', 'text-')} />
                </div>
                <div>
                  <p className="font-body font-medium text-text-primary">{zone.label}</p>
                  <p className="font-body text-xs text-text-muted">{zone.capacity} · {zone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Walking Routes */}
        <div className="p-4 rounded-2xl bg-bg-surface border border-border-color">
          <h3 className="font-body font-semibold text-text-primary mb-3">Walking Routes from Campus</h3>
          <div className="space-y-2">
            {walkingRoutes.map((route, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-bg-base">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-accent-primary" />
                  <span className="font-body text-sm text-text-secondary">{route.from}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} className="text-text-muted" />
                  <span className="font-body text-sm text-text-muted">{route.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <a
          href="https://www.google.com/maps/dir//Masjid+Al-Malik+Khalid+USM"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-accent-warm text-white font-body font-semibold hover:bg-accent-warm/90 transition-colors"
        >
          <ExternalLink size={20} />
          Open in Google Maps
        </a>

        {/* Info */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <p className="font-body text-sm text-amber-500">
            <strong>Note:</strong> Parking is limited during Friday prayers and Ramadan. Arrive early for best availability. No overnight parking allowed.
          </p>
        </div>
      </div>
    </div>
  );
}

