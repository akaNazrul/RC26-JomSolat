import { useState } from 'react';
import { ChevronLeft, Waves, Users, Accessibility, Wind, BookOpen, School, Car, Bike, CreditCard, UtensilsCrossed, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FacilityData {
  id: string;
  icon: typeof Waves;
  title: string;
  status: 'available' | 'limited' | 'closed' | 'info';
  shortDescription: string;
  fullDescription: string;
}

export default function Facilities() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const facilities: FacilityData[] = [
    {
      id: 'wudhu',
      icon: Waves,
      title: 'Wudhu Area',
      status: 'available',
      shortDescription: 'Separate wudhu facilities for men and women. Available 24 hours.',
      fullDescription: 'The mosque provides dedicated wudhu areas for both male and female jemaah located on the ground floor. Both sections are accessible at all hours including outside main prayer times. Both areas are equipped with modern facilities.',
    },
    {
      id: 'women',
      icon: Users,
      title: "Women's Section",
      status: 'available',
      shortDescription: "Dedicated women's musolla with separate entrance and own wudhu area.",
      fullDescription: "The women's section is fully partitioned from the main hall and accessed via a dedicated entrance on the side of the building. It has its own wudhu facilities. The section is available for all daily prayers, Jumu'ah, and taraweeh.",
    },
    {
      id: 'accessibility',
      icon: Accessibility,
      title: 'Wheelchair Access',
      status: 'available',
      shortDescription: 'Ramp access and accessible wudhu station available.',
      fullDescription: 'A wheelchair ramp is provided at the main entrance to allow access to the prayer hall. An accessible wudhu station is available on the ground floor. Jemaah requiring assistance are advised to enter via the main ground-floor entrance.',
    },
    {
      id: 'ac',
      icon: Wind,
      title: 'Air Conditioning',
      status: 'available',
      shortDescription: 'Fully air-conditioned main prayer hall.',
      fullDescription: 'The main prayer hall is fully equipped with central air conditioning, providing a comfortable environment for daily prayers, Friday prayers, and all-night taraweeh sessions during Ramadan.',
    },
    {
      id: 'library',
      icon: BookOpen,
      title: 'Library',
      status: 'available',
      shortDescription: 'On-site Islamic library with books, references, and study resources.',
      fullDescription: 'Pusat Islam USM maintains an Islamic library and resource centre within the complex, open to all USM students and staff. The collection covers fiqh, Quran sciences, Islamic history, and general Islamic reading.',
    },
    {
      id: 'hall',
      icon: School,
      title: 'Lecture Hall',
      status: 'available',
      shortDescription: 'Dedicated lecture and event hall for ceramah, talks, and programmes.',
      fullDescription: 'The complex includes a lecture hall used for Islamic talks, ceramah, educational programmes, and special events such as Hari Raya gatherings and Maulidur Rasul celebrations.',
    },
    {
      id: 'carpark',
      icon: Car,
      title: 'Car Parking',
      status: 'limited',
      shortDescription: 'Car parking available nearby. Limited spaces — peak times on Fridays.',
      fullDescription: 'Car parking is available in the designated lots adjacent to the mosque. Spaces are limited, especially during Friday prayers and Ramadan taraweeh.',
    },
    {
      id: 'motopark',
      icon: Bike,
      title: 'Motorcycle Parking',
      status: 'available',
      shortDescription: 'Motorcycle parking bays available close to the mosque entrance.',
      fullDescription: 'Dedicated motorcycle bays are located close to the mosque entrance. Generally more available than car parking.',
    },
    {
      id: 'atm',
      icon: CreditCard,
      title: 'ATM / Banking',
      status: 'info',
      shortDescription: 'ATM machines available within the USM campus nearby.',
      fullDescription: 'While there are no ATM machines inside the mosque complex itself, several are available within walking distance on the USM Induk campus.',
    },
    {
      id: 'food',
      icon: UtensilsCrossed,
      title: 'Cafeteria',
      status: 'info',
      shortDescription: 'Halal food options available in the surrounding campus area.',
      fullDescription: 'There is no canteen inside the mosque complex, but USM campus cafeterias are a short walk away.',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500/20 text-green-500';
      case 'limited': return 'bg-amber-500/20 text-amber-500';
      case 'closed': return 'bg-red-500/20 text-red-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-bg-base">
      <header className="sticky top-0 z-40 bg-bg-base/80 backdrop-blur-md border-b border-border-color">
        <div className="flex items-center gap-2 px-4 py-4">
          <Link to="/home" className="p-2 -ml-2 rounded-full hover:bg-bg-surface">
            <ChevronLeft size={24} className="text-text-primary" />
          </Link>
          <h1 className="font-display text-xl text-text-primary">Facilities</h1>
        </div>
      </header>

      <div className="p-4 space-y-3">
        {facilities.map((facility) => (
          <div
            key={facility.id}
            className="p-4 rounded-2xl bg-bg-surface border border-border-color"
          >
            <button
              onClick={() => setExpandedId(expandedId === facility.id ? null : facility.id)}
              className="w-full flex items-start gap-3"
            >
              <div className={`p-2 rounded-xl ${getStatusColor(facility.status)}`}>
                <facility.icon size={20} />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                  <h3 className="font-body font-semibold text-text-primary">{facility.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(facility.status)}`}>
                    {facility.status.charAt(0).toUpperCase() + facility.status.slice(1)}
                  </span>
                </div>
                <p className="font-body text-sm text-text-secondary text-justify">{facility.shortDescription}</p>
              </div>
              {expandedId === facility.id ? (
                <ChevronUp size={20} className="text-text-muted mt-1" />
              ) : (
                <ChevronDown size={20} className="text-text-muted mt-1" />
              )}
            </button>
            
            {expandedId === facility.id && (
              <div className="mt-3 pt-3 border-t border-border-color">
                <p className="font-body text-sm text-text-secondary leading-relaxed text-justify">
                  {facility.fullDescription}
                </p>
              </div>
            )}
          </div>
        ))}

        <p className="text-center font-body text-xs text-text-muted pt-4">
          Facility information based on Pusat Islam USM's official website
        </p>
      </div>
    </div>
  );
}

