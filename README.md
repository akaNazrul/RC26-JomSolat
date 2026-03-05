# JomSolat — Masjid Al-Malik Khalid Digital Companion

**JomSolat** is a mobile-first Progressive Web App built for the Muslim community of Masjid Al-Malik Khalid (Pusat Islam USM), Gelugor, Penang. Created by Team Murtabug during Kracked Devs Ramadan Challenge 2026 (RC26).

---

## What It Does

JomSolat serves as a digital companion that keeps the USM community connected with their mosque. It provides accurate prayer times with a live countdown timer, upcoming events and programmes, comprehensive mosque information including facilities and contact details, parking locations, and user authentication for a personalized experience.

---

## Target Users

The app primarily serves USM students who need quick access to prayer schedules, USM staff and faculty seeking event updates, the Gelugor community attending Friday prayers and taraweeh, visitors unfamiliar with the mosque, and mosque administrators who need an easy way to publish events.

---

## Core Features

**Prayer Times** — Displays today's five daily prayer times for Gelugor zone using JAKIM method data, with a real-time donut countdown timer showing time remaining until the next prayer.

**Events & Programmes** — Lists upcoming events including taraweeh (during Ramadan), Friday ceramah, Islamic classes, and community activities with filter options by event type.

**Mosque Information** — Contains the mosque name, address, contact details (phone, email, WhatsApp), operating hours, social media links, donation QR code, and an embedded map.

**Facilities** — Details available facilities such as wudhu areas (separate for men/women), women's prayer section, wheelchair accessibility, air conditioning, library, lecture hall, and parking information.

**Parking & Location** — Provides an annotated map showing car and motorcycle parking zones, walking routes from different campus locations, and a deep link to Google Maps.

**User Authentication** — Supports email/password signup and Google OAuth for user accounts with zone preference selection.

**Theme Support** — Offers dark and light modes with smooth transitions and system preference detection.

---

## Tech Stack

The app is built with React 18 and Vite 5 for the frontend framework, Tailwind CSS for styling, Supabase for backend services (PostgreSQL database, authentication, and storage), Zustand for state management, Al-Adhan API for prayer time data (JAKIM Method 11), and Vite PWA plugin for progressive web app capabilities.

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## Design Highlights

The app follows a minimalist Islamic aesthetic with a deep purple and warm orange color palette. Typography uses Amiri for display headings, Poppins for body text, and Noto Naskh Arabic for Arabic prayer names. Animations are gentle and purposeful, respecting the prefers-reduced-motion accessibility setting.

---

## Credits

- **Team:** Murtabug
- **Event:** Kracked Devs Ramadan Challenge 2026 (RC26)
- **Mosque:** Masjid Al-Malik Khalid, Pusat Islam USM, Penang

---

*Selamat Beribadah* 🤲

