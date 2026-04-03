# JomSolat by team MurtaBug
### Masjid Al-Malik Khalid Digital Companion

<div align="center">

**A mobile-first Progressive Web App for the Muslim community at Universiti Sains Malaysia**

[![Live App](https://img.shields.io/badge/Live%20App-jomsolat.app-6d28d9?style=for-the-badge&logo=vercel)](https://jomsolat.app/)
[![Growth Docs](https://img.shields.io/badge/Growth%20Phase%20Docs-Read%20Here-f97316?style=for-the-badge)](https://tinyurl.com/RC26-JomSolatGrowthPhase)
[![GitHub](https://img.shields.io/badge/GitHub-RC26--JomSolat-181717?style=for-the-badge&logo=github)](https://github.com/akaNazrul/RC26-JomSolat)

</div>

---

## What It Does

JomSolat serves as a digital companion that keeps the USM community connected with their mosque. It provides accurate prayer times with a live countdown timer, upcoming events and programmes, comprehensive mosque information including facilities and contact details, parking locations, and user authentication for a personalized experience.

---

## Who is this for?

- **USM Students** who want quick prayer time reminders between classes
- **USM Staff and Faculty** who want to know what events are on at the mosque
- **Gelugor community members** attending Friday prayers or taraweeh
- **Visitors** who are new to the campus and need to find the mosque
- **Mosque administrators** who want a simple way to publish announcements and events

---

## Live App

The app is hosted and live at: **[https://jomsolat.app/](https://jomsolat.app/)**

---

## Core Features

### Prayer Times
- Shows all five daily prayer times for the **Gelugor zone** using the official **JAKIM** data
- A live donut countdown timer tells you how long until the next prayer
- Data comes from the **Al-Adhan API** which is a trusted open prayer time API

### Events and Programmes
- Browse upcoming mosque events like taraweeh, Friday ceramah, Islamic classes and community activities
- Filter events by type so you only see what is relevant to you

### Mosque Information
- Full contact details including phone number, email address and WhatsApp channel link
- Operating hours, social media links and a donation QR code
- Embedded map right inside the app

### Facilities Guide
- Detailed breakdown of what is available at the mosque
- Covers wudhu areas (separate for men and women), women's prayer section, wheelchair access, air conditioning, library and lecture hall

### Parking and Location
- An annotated map showing car and motorcycle parking zones
- Walking routes from different parts of the USM campus
- A deep link to Google Maps for easy navigation

### User Authentication
- Sign up using your email and password
- Log in with Google via OAuth

### Dark and Light Mode
- Automatically follows your device system preference
- Manual toggle available with smooth transitions

---

## Tech Stack

Here is a breakdown of every tool and technology used to build JomSolat.

### Frontend

| Technology | Version | What it does |
|---|---|---|
| React | 18 | The main UI library for building components |
| Vite | 5 | Fast build tool and development server |
| TypeScript | Latest | Adds type safety to JavaScript code |
| Tailwind CSS | Latest | Utility-first CSS for styling |
| Zustand | Latest | Lightweight state management |
| Vite PWA Plugin | Latest | Turns the app into an installable PWA |

### Backend and Data

| Technology | What it does |
|---|---|
| Supabase | Provides PostgreSQL database, authentication and file storage |
| Al-Adhan API | Open API for accurate prayer time data using JAKIM method |

### Hosting and Deployment

| Technology | What it does |
|---|---|
| Vercel | Hosts and auto-deploys the app from the main branch |
| Custom Domain | App is served at `jomsolat.app` |

### Design

- **Typography**: Amiri for headings, Poppins for body text, Noto Naskh Arabic for Arabic prayer names
- **Color Palette**: Deep purple as the primary color with warm orange accents
- **Aesthetic**: Minimalist Islamic design with gentle purposeful animations
- **Accessibility**: Respects the `prefers-reduced-motion` user setting

---

## Project Structure

```
RC26-JomSolat/
├── public/               # Static assets like icons and manifest
├── scripts/              # Helper scripts for development tasks
├── src/                  # All the main application source code
│   ├── components/       # Reusable UI components
│   ├── pages/            # Individual page views
│   ├── stores/           # Zustand state stores
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and API helpers
│   └── types/            # TypeScript type definitions
├── supabase/             # Supabase migration files and configs
├── tests/                # Test files
├── index.html            # Main HTML entry point
├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── vercel.json           # Vercel deployment config
└── package.json          # Project dependencies and scripts
```

---

## How to Set Up Locally

Follow these steps to run JomSolat on your own computer.

### What you need before starting

- **Node.js** version 18 or higher ([Download here](https://nodejs.org))
- **npm** which comes bundled with Node.js
- A **Supabase** account and project ([Free at supabase.com](https://supabase.com))
- A **Google OAuth** client if you want to test Google login ([Set up here](https://console.cloud.google.com))

### Step 1: Clone the repository

```bash
git clone https://github.com/akaNazrul/RC26-JomSolat.git
cd RC26-JomSolat
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Set up your environment variables

Create a file called `.env` in the root folder. Copy the values below and fill in your own Supabase details.

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values inside your Supabase project dashboard under **Settings > API**.

> Note: The `.env` file is already in `.gitignore` so your secrets will not be pushed to GitHub.

### Step 4: Set up the Supabase database

Run the migration files inside the `supabase/` folder to create all the required tables.

```bash
# If you have the Supabase CLI installed
supabase db push
```

Or you can copy and run the SQL files manually inside the Supabase SQL editor.

### Step 5: Configure Google OAuth (optional)

If you want Google login to work locally:

1. Go to the [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add `http://localhost:5173` as an authorized redirect URI
4. Add the Google client ID and secret inside your **Supabase dashboard** under **Authentication > Providers > Google**

### Step 6: Start the development server

```bash
npm run dev
```

Open your browser and go to `http://localhost:5173`. You should see JomSolat running locally.

---

## Available Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Starts the local development server |
| `npm run build` | Builds the app for production |
| `npm run preview` | Previews the production build locally |

---

## Deployment

The app is deployed automatically to Vercel whenever new code is pushed to the `main` branch. The configuration is managed in `vercel.json`.

To deploy your own fork:

1. Push the code to your GitHub
2. Connect the repository to [Vercel](https://vercel.com)
3. Add the environment variables inside the Vercel dashboard
4. Vercel will handle the rest automatically

---

## Growth Phase Documentation

The Growth Phase document covers the planning decisions, design thinking, feature roadmap and lessons learned throughout the RC26 challenge. It is a great read if you want to understand why certain decisions were made.

Read it here: [RC26 JomSolat Growth Phase](https://tinyurl.com/RC26-JomSolatGrowthPhase)

---

## Contributing

This project was created for RC26 but contributions are welcome. If you spot a bug or have a feature idea, feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create a new branch: `git checkout -b your-feature-name`
3. Make your changes and commit: `git commit -m "Add your message here"`
4. Push to your branch: `git push origin your-feature-name`
5. Open a Pull Request

---

## Credits

| | |
|---|---|
| **Team** | Murtabug |
| **Challenge** | Kracked Devs Ramadan Challenge 2026 (RC26) |
| **Mosque** | Masjid Al-Malik Khalid, Pusat Islam USM, Penang |
| **Prayer Data** | Al-Adhan API |
| **Backend** | Supabase |
| **Hosting** | Vercel |

---

<div align="center">

*Selamat Beribadah* 🤲


</div>