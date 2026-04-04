

PRODUCT REQUIREMENTS DOCUMENT
JomSolat
Masjid Al-Malik Khalid Digital Companion
USM Induk, Gelugor, Penang  ·  Ramadan Challenge 2026 (RC26)


Field	Value
Document Title	JomSolat PRD v1.0
Product Name	JomSolat
Team	Murtabug
Event	Kracked Devs Ramadan Challenge 2026 (RC26)
Mosque	Masjid Al-Malik Khalid, Pusat Islam USM, Penang
Document Status	ACTIVE — Working Draft
Last Revised	Ramadan 2026
Classification	Internal / Team Use



 
§1  Introduction & Product Vision
▌ 1.1  Purpose of This Document
This Product Requirements Document (PRD) defines the complete specification for JomSolat — a mobile-first Progressive Web App built for the Muslim community of Masjid Al-Malik Khalid (Pusat Islam USM), Gelugor, Penang. It serves as the single source of truth for design decisions, engineering implementation, system architecture, and acceptance criteria throughout the Kracked Devs Ramadan Challenge 2026 (RC26).
This document is written for a cross-functional audience: frontend engineers, backend engineers, designers, QA testers, and the mosque stakeholder. Every section is self-contained so any team member can read their relevant section independently.

▌ 1.2  Vision Statement
"Empower every Muslim at USM to stay connected with their mosque — from prayer times to community events — through a beautifully designed, fast, and reliable digital companion that feels as welcoming as the masjid itself."

▌ 1.3  Problem Statement
•	USM students miss prayer times or are unaware of prayer schedules across campus zones
•	Mosque event information is scattered across Instagram, WhatsApp, and physical notice boards
•	Visitors unfamiliar with the mosque have no digital guide for facilities, parking, or accessibility
•	There is no centralised, mobile-optimised digital presence for Masjid Al-Malik Khalid
•	Mosque committees have no easy tool for pushing updates to congregants

▌ 1.4  Success Metrics
Metric	RC26 Target	6-Month Target
Registered users	≥ 10 (RC26 Growth Award requirement)	≥ 500
Daily active users (DAU)	≥ 5 unique/day in Week 2	≥ 150/day
Prayer time page views	Majority of sessions include this page	Primary screen open rate > 70%
Events page engagement	≥ 3 events listed by Day 7	Weekly event updates maintained
App install (Add to Home)	Track via beforeinstallprompt event	≥ 100 installs
Admin actions/week	≥ 1 (verifies admin works)	Regular mosque committee usage
Lighthouse PWA score	≥ 90	≥ 95

▌ 1.5  Out of Scope (RC26 Phase)
•	Native iOS / Android app — PWA only for this phase
•	Quran reader or audio streaming
•	Booking system for mosque facilities
•	Multi-mosque support — single mosque only
•	Zakat or financial calculator
•	Real-time chat or community forum
 
§2  Stakeholders & User Personas
▌ 2.1  Stakeholder Map
Stakeholder	Role	Interest / Concern
USM Students	Primary end-user	Fast, accurate prayer times; campus event info
USM Staff & Faculty	Secondary end-user	Event updates, mosque facilities info
Gelugor Community	Secondary end-user	Friday prayers, taraweeh, community events
Mosque Committee	Admin / Content manager	Easy way to publish events; grow congregation
Pusat Islam USM	Official stakeholder	Accurate representation of mosque info
Team Murtabug	Development team	Build, ship, get 10 users, win RC26
Kracked Devs	Hackathon organiser	Verify rules compliance, evaluate quality

▌ 2.2  User Personas
Persona A — Aiman, Year 2 Engineering Student
Age:  20  |  USM Kubang Kerian student on exchange at USM Induk
Goal:  Know exactly when Asar starts so he can plan his afternoon lab
Pain point:  Has to Google 'waktu solat Penang' every day — no reliable single source
Device:  Samsung Galaxy A-series, always on mobile data
Behaviour:  Checks phone between lectures; wants instant info, no loading screens

Persona B — Ustazah Roslina, Admin Officer, Pusat Islam USM
Age:  38  |  Responsible for announcements and events
Goal:  Post upcoming ceramah and taraweeh events without asking the IT team
Pain point:  Currently posts on Instagram but many congregants miss it
Device:  Desktop PC + iPhone 12
Behaviour:  Not highly technical; needs a simple form-based admin dashboard

Persona C — Encik Hazwan, Visiting Lecturer from KL
Age:  45  |  New to USM campus, driving to Friday prayers
Goal:  Find parking, locate the mosque, understand facilities before arrival
Pain point:  Campus map is confusing; doesn't know which lot allows non-staff
Device:  iPhone 14 Pro
Behaviour:  One-time lookup; needs parking map and directions immediately
 
§3  Design System
The design system governs every visual decision in JomSolat. All components must conform to these specs. No ad-hoc colour or font decisions are permitted during implementation.

▌ 3.1  Brand Personality & Mood
Dimension	Direction	NOT This
Tone	Calm, reverent, modern	Loud, flashy, game-like
Aesthetic	Minimalist Islamic geometry	Over-decorated arabesques everywhere
Feel	Premium prayer app, like a Quran app	Generic news website or CRUD app
Motion	Gentle, purposeful, never distracting	Bounce, spin, aggressive transitions
Typography	Elegant serif display + clean sans UI	Comic Sans, random Google Fonts
Colour	Deep purple + warm orange, grounded	Neon, pastel rainbow, garish

▌ 3.2  Colour Palette
Dark Mode (Default)
Token Name	Hex Value	Usage
bg-base	#1A1A2E	Main app background
bg-surface	#16213E	Cards, bottom sheets, modals
bg-elevated	#1E1E2E	Navbar, header background
accent-primary	#7B2FBE	Active states, icons, highlights
accent-warm	#E65C00	CTAs, countdown timer ring, key badges
text-primary	#F5F5F5	Headings and primary labels
text-secondary	#9E9E9E	Subtitles, meta info
text-muted	#4A4A4A	Placeholders, disabled states
border	#2D2D3E	Card and input borders
prayer-active	#E65C00	Currently active prayer highlight
prayer-passed	#4A4A4A	Already passed prayer row
prayer-upcoming	#F5F5F5	Next prayer row

Light Mode
Token Name	Hex Value	Usage
bg-base	#F9F9F9	Main app background
bg-surface	#FFFFFF	Cards, modals
bg-elevated	#FFFFFF	Navbar background with shadow
accent-primary	#4B0082	Active states, icons
accent-warm	#E65C00	CTAs, timer ring
text-primary	#1A1A1A	Headings
text-secondary	#4A4A4A	Subtitles
border	#E0E0E0	Card borders
WARNING: Never hardcode hex values in component code. Always use CSS custom properties (--bg-base etc). This enables the dark/light toggle to work with a single class switch on <html>.

▌ 3.3  Typography
Role	Font Family	Weight	Size (mobile)	Usage
Display / Hero	Amiri (Google Fonts)	700	32–48px	App title, hero headings
Section Heading	Amiri	700	22–28px	Page titles, section headers
Body Text	Poppins (Google Fonts)	400	14–16px	Paragraphs, descriptions
UI Labels	Poppins	500–600	12–14px	Button labels, nav items, badges
Prayer Names (EN)	Poppins	600	16px	Fajr, Dhuhr, Asr labels
Prayer Names (AR)	Noto Naskh Arabic (Google Fonts)	400–700	18–20px	Arabic prayer name text
Numbers / Time	Poppins	700	32–48px	Countdown timer, prayer times
Monospace / Code	JetBrains Mono (admin only)	400	12px	Admin debug / JSON fields
Load fonts via Google Fonts with display=swap to prevent FOIT. Subset Amiri to Latin+Arabic only.

▌ 3.4  Spacing & Layout Grid
•	Base unit: 4px
•	Spacing scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80px
•	Mobile content padding: 16px horizontal, 20px vertical
•	Card border-radius: 16px (large), 12px (medium), 8px (small chips/badges)
•	Bottom navigation height: 64px + safe area inset (env(safe-area-inset-bottom))
•	Bottom navigation icon size: 24px, label: 11px
•	Max content width (desktop): 480px, centred

▌ 3.5  Iconography
Library	Usage	License
Lucide Icons (lucide.dev)	Primary UI icons (nav, actions, status)	ISC — open source
Google Material Symbols	Supplementary (maps, settings, info)	Apache 2.0
Flaticon (selected mosque icons)	Mosque-specific (minaret, prayer mat)	Free with attribution
Note: Use only SVG icons. Never use icon fonts (causes layout shift). All icons must be imported as React components.

▌ 3.6  Animation & Motion Design
Motion in JomSolat is functional and spiritual — it should feel like gentle breathing, not a theme park. Every animation must serve a UX purpose.
Animation	Duration	Easing	Trigger	Purpose
Hero slideshow fade	800ms	ease-in-out	Auto, every 4s	Onboarding visual
Page transition (slide)	300ms	cubic-bezier(.4,0,.2,1)	Nav tab press	Route navigation
Bottom nav icon bounce	200ms	spring (stiffness 400)	Tab press	Tactile feedback
Donut timer tick	1000ms	linear	Every second	Countdown urgency
Prayer row highlight	500ms	ease-out	On prayer entry	Draw attention
Card entrance	250ms	ease-out + stagger	Page load	Content appears polished
Modal slide-up	320ms	ease-out	Trigger action	Context preservation
Pull-to-refresh spin	400ms	linear loop	Pull gesture	Loading indicator
Skeleton shimmer	1500ms	linear loop	Data loading	Perceived performance
Dark/light mode toggle	400ms	ease-in-out	Toggle press	Smooth theme switch
WARNING: Respect prefers-reduced-motion media query. All animations must disable gracefully for accessibility.

▌ 3.7  Component Inventory
ATOMS
Component	Variants	Notes
Button	Primary, Secondary, Ghost, Destructive, Icon-only	48px min touch target
Input	Text, Password, Search	Show/hide for password
Badge / Chip	Prayer status, event type, facility status	12px, rounded-full
Avatar	Initials-only (no photos for privacy)	32px, 40px
Toggle	Dark/Light mode switch	Accessible role=switch
Icon Button	Nav item, action trigger	44px touch area min
Divider	Horizontal, with optional label	Use sparingly
Skeleton	Card, text line, circle	Used during data fetch
MOLECULES
Component	Composition	Notes
Prayer Row	Badge + time + active indicator	Highlighted for current prayer
Donut Timer	SVG circle + countdown text	SVG stroke-dashoffset animation
Event Card	Icon + title + date + type badge	Tap to expand details
Facility Card	Icon + title + status chip	Green=available, Red=closed
Mosque Info Row	Icon + label + value	Used in info page list
Nav Bar Item	Icon + label + active dot	5 items, bottom fixed
Greeting Banner	Salutation + name + date (hijri)	Home screen top
Section Header	Title + optional 'See All' link	Used to introduce card groups
Auth Input Group	Label + Input + error message	Full form field
 
§4  Screen-by-Screen Layout Specification
All measurements are in pixels at 375px viewport (iPhone SE / standard mobile base). Scale proportionally.

▌ 4.1  Onboarding / Landing Screen (Unauthenticated)
Here's the revised text for that section — just paste it into your PRD to replace the old content:
________________________________________
4.1 Landing Page / Hero Screen (Unauthenticated)
This is a full landing page experience — not a traditional mobile onboarding flow. The design takes inspiration from muslimpro.com: polished, content-rich, and scroll-driven. Animations are powered by GSAP (gsap.com) — specifically ScrollTrigger for scroll-based reveals and GSAP timeline for the hero entrance sequence. All animation libraries are open source.
________________________________________
SECTION A — Hero (Above the Fold)
Full-viewport hero with a looping crossfade slideshow of 3–5 high-quality photos of Masjid Al-Malik Khalid USM. A dark gradient overlay sits on top (top: transparent → bottom: rgba(26,26,46,0.92)) so all text remains legible regardless of photo brightness.
GSAP Entrance Animation Sequence (plays once on page load):
•	t=0ms: page background fades in from black (opacity 0 → 1, 600ms)
•	t=300ms: mosque photo crossfade begins cycling (interval: 5000ms, crossfade: 1000ms using GSAP .to on opacity)
•	t=400ms: app logo + wordmark slides down from top (y: -30 → 0, opacity 0 → 1, 500ms, ease: power2.out)
•	t=700ms: Arabic mosque name fades in with a subtle letter-spacing expand (letterSpacing: 4px → 0px, 600ms)
•	t=900ms: headline text reveals word by word using GSAP SplitText (each word staggers in with y: 20 → 0, 400ms, stagger: 0.08s)
•	t=1400ms: subheadline fades up (y: 15 → 0, opacity 0 → 1, 400ms)
•	t=1700ms: CTA buttons pop in with a slight scale (scale: 0.92 → 1, opacity 0 → 1, 350ms, ease: back.out(1.4))
•	t=2000ms: scroll indicator arrow bounces in an infinite loop (GSAP yoyo, y: 0 → 8px, duration: 800ms, repeat: -1)
Hero Content Layout (top to bottom):
•	Top-left: App logo (SVG, 32px) + "JomSolat" wordmark (Amiri, 22px, white) — acts as the navbar brand
•	Top-right: "Log In" ghost button (transparent, white border, 14px) + "Sign Up" filled button (orange background, white text, 14px) — side by side, minimal, clean
•	Centre-top: Arabic text — "مسجد الملك خالد" (Noto Naskh Arabic, 20px, rgba(255,200,100,0.9), subtle glow text-shadow)
•	Centre: Main headline — "Your Masjid. Your Community. Your Daily Guide." (Amiri, 48px on desktop / 32px mobile, white, bold)
•	Centre-below: Subheadline — "Prayer times, events, and everything about Masjid Al-Malik Khalid USM — in one place." (Poppins, 16px, rgba(255,255,255,0.75))
•	Bottom-centre: Two CTAs stacked on mobile / side by side on desktop: 
o	Primary: "Get Started — It's Free" (orange filled, 48px tall, rounded-full, Poppins 600)
o	Secondary: "Explore the Mosque" (ghost, white border, same size) — smooth-scrolls to Section B below
•	Bottom-centre below CTAs: Animated scroll indicator — a thin vertical line + downward chevron icon from Lucide (ChevronDown), bouncing gently. Label: "Scroll to discover" (11px, muted white)
________________________________________
SECTION B — Mosque Heritage (First Scroll Section)
Triggered by GSAP ScrollTrigger: as the user scrolls into this section, content animates in from the sides (left text slides from left, right image/card fades from right). Use scrub: 0.5 for a smooth parallax feel.
Layout: Two-column on desktop (text left, decorative mosque silhouette or photo right), single column stacked on mobile.
Content:
Section label (small caps, orange, 12px, letter-spaced): A BRIEF HISTORY
Headline (Amiri, 36px): "Where Faith Meets the Heart of USM"
Body paragraphs (Poppins, 15px, line-height 1.8, muted):
"Masjid Al-Malik Khalid stands as the spiritual anchor of Universiti Sains Malaysia's Induk campus in Gelugor, Penang. Named after the late King Khalid of Saudi Arabia, whose generous contribution made its construction possible, the mosque has served the USM community for decades — welcoming students, lecturers, staff, and the surrounding Gelugor neighbourhood to gather, pray, and reflect together."
"Managed by Pusat Islam USM, the mosque is more than a place of worship. It hosts Islamic education programmes, Ramadan taraweeh prayers, Friday ceramah, community welfare initiatives, and daily congregational prayers — forming the beating heart of Muslim campus life at USM."
Visual element: A decorative geometric Islamic pattern (SVG, open source from heropatterns.com or similar) as a subtle background watermark behind the text, opacity 0.05. On scroll, it rotates very slowly using GSAP (rotation: 0 → 15deg, scrub: 2).
________________________________________
SECTION C — What JomSolat Gives You (Feature Overview)
Three feature cards in a horizontal row (desktop) or vertical stack (mobile). Each card animates in with a staggered fade-up on scroll (GSAP ScrollTrigger, stagger: 0.15s, y: 40 → 0, opacity 0 → 1).
Section label: WHAT'S INSIDE
Headline (Amiri, 32px): "Everything You Need, Always at Hand"
Subtext: "JomSolat brings together all the information you need about Masjid Al-Malik Khalid — so you spend less time searching and more time ibadah."
Feature Cards (icon from Lucide or Phosphor Icons — open source):
Card 1 — Icon: Clock (Lucide) with a crescent moon overlay (custom SVG) Title: "Live Prayer Times" Description: "Accurate Gelugor-zone prayer times powered by JAKIM data. A live donut countdown always shows you exactly how long until the next prayer — updated every second."
Card 2 — Icon: CalendarDays (Lucide) Title: "Events & Programmes" Description: "Taraweeh schedules, Friday ceramah, Islamic classes, and community events — all in one updated feed. Never miss what's happening at your mosque."
Card 3 — Icon: MapPin (Lucide) with a mosque silhouette Title: "Complete Mosque Guide" Description: "Wudhu facilities, women's section, wheelchair access, parking zones, and full contact details. Everything a first-timer or regular needs to know."
________________________________________
SECTION D — Prayer Times Preview (Social Proof / Utility Teaser)
A mock-up of the prayer times widget embedded directly in the landing page — live and functional. Shows today's real prayer times for Gelugor pulled from the API. This is not behind a login wall — it demonstrates value immediately before the user signs up.
Section label: TODAY'S PRAYER TIMES · GELUGOR, PENANG
Layout: Dark card (bg: #1E1E2E, border-radius: 20px, max-width: 420px, centred) with the 5 prayer rows visible. Active prayer is highlighted in orange. Non-interactive — just displays. Below the card: "Sign up to unlock reminders, events, and your personal prayer tracker →" CTA.
________________________________________
SECTION E — Community Call to Action (Final Section)
Full-width dark section (bg: #1A1A2E), centred content, animated in on scroll.
Headline (Amiri, 40px, white): "Join the JomSolat Community"
Subtext (Poppins, 15px, muted): "Created by students, for the USM community. Free forever. No ads. Just your masjid."
Two CTAs: "Create Free Account" (orange filled) + "Learn More" (ghost white)
Below: KrackedDevs RC26 badge — small, tasteful. "Built during Ramadan 2026 as part of Kracked Devs RC26."
Footer line (very small, muted): "© 2026 JomSolat — Team Murtabug · krackeddevs.com · Pusat Islam USM"
________________________________________
Animation Library Reference:
•	GSAP Core + ScrollTrigger + SplitText: gsap.com/docs (free for non-commercial / student use under the "No Charge" licence for non-premium plugins; SplitText is Club GSAP — use a CSS-only word-split fallback if no licence)
•	CSS-only fallback for reduced-motion: all GSAP animations wrapped in if (!prefersReducedMotion) check
•	Lottie-style icon animations: use LottieFiles free library (lottiefiles.com) for the feature walkthrough icons, or animated SVG via CSS @keyframes if Lottie adds too much bundle weight


▌ 4.2  Authentication Screens
Sign Up Screen
•	Logo + 'Create Account' heading (Amiri, 28px)
•	Full Name input
•	Email input
•	Password input (show/hide toggle)
•	Confirm Password input
•	Zone selector: 'USM / Gelugor' radio toggle (affects default prayer time zone)
•	'Sign Up' primary button
•	Divider: 'or continue with'
•	Google OAuth button (official Google branding, white background)
•	Apple Sign In button (black background, Apple logo)
•	'Already have an account? Log In' link at bottom

Login Screen
•	Logo + 'Welcome Back' heading
•	Email + Password inputs
•	'Forgot Password?' link (right-aligned, 13px)
•	'Log In' primary button
•	OAuth buttons (Google + Apple)
•	'Don't have an account? Sign Up' link

▌ 4.3  Home / Dashboard Screen
The Home screen is the Mosque Basics page — satisfying RC26 mandatory requirement. It is the first screen after login. Avoid using gradient color to make it human design. Don’t use emoji as icon, use open source available icon in internet, make it minimalist
Layout Structure (top to bottom):
1.	Status Bar area (safe area, transparent)
2.	Header bar: 'JomSolat' logo left, moon/sun toggle right, notification bell right
3.	Greeting Banner: 'Assalamualaikum, [Name]' (Amiri 26px) + Hijri + Gregorian date (Poppins 13px, muted)
4.	Donut Timer Card — next prayer countdown (full-width, 200px tall card):
◦	SVG donut ring (orange stroke on dark track, 80px diameter, 8px stroke)
◦	Centre text: time remaining (Poppins 700, 36px) + 'until [Prayer Name]' (14px, muted)
◦	Ring sweeps clockwise from prayer start to prayer end; percentage is (elapsed/interval)
◦	Card background: subtle radial gradient from dark purple to dark navy
5.	Prayer Time Strip — horizontal scroll, 5 pills (Fajr, Dhuhr, Asr, Maghrib, Isha):
◦	Active prayer: orange background, white text, slightly larger
◦	Passed prayer: grey text, grey background
◦	Upcoming: dark card, white text
◦	Each pill: prayer name (Arabic + EN) + time
6.	Quick-Access Grid — 2×2 cards: Mosque Info, Facilities, Parking, Events
7.	Events Teaser — horizontal scroll of upcoming events (next 2–3)
8.	KrackedDevs promo strip (small, bottom of scrollable content, non-intrusive), later I will insert the kracked devs logo, and the discord link

▌ 4.4  Prayer Times Screen
9.	Zone selector toggle: 'USM (Gelugor)' (default)a
10.	Full prayer table — today's date as header, 5-row table with all prayer times
11.	Active prayer row: highlighted with orange left border and bold time
12.	Month view toggle: tap to switch to monthly table (all 5 prayers × 30 days)
13.	Hijri date badge next to each date in monthly view
14.	'Set Reminder' icon next to each prayer (bell icon) — triggers browser notification prompt
Prayer times sourced from Al-Adhan API (aladhan.com). Use method=11 (Jabatan Kemajuan Islam Malaysia / JAKIM) for accuracy in Malaysia.(don’t display this to front end)

▌ 4.5  Mosque Info Screen
15.	Hero image: top photo of mosque exterior (placeholder → real photo)
16.	Mosque name in Amiri font + Arabic name below
17.	Info rows with icons (Lucide): Address, Phone, Email, WhatsApp
18.	Short description paragraph (from official website)
19.	Operating hours table (admin prayer times, office hours)
20.	Social links: Official Website, Facebook, Instagram (open in browser) (use actual icon social media)
21.	Donation QR Code section: image placeholder + 'Scan to Donate' label
22.	Map embed: Google Maps iframe pinned to mosque coordinates

▌ 4.6  Facilities Screen
Card grid layout (single column on mobile). Each card has: icon, title, status chip (Available / Limited / Closed), and short description. Add a text button called like “view more” to show more facility
Facility	Icon	Key Info to Display
Wudhu Area	Droplets (Lucide)	male/female, 24hr availability (I don’t have enough data for exact amount of wudhu area)
Women's Section	Users (Lucide)	Separate entrance, capacity, wudhu area
Wheelchair Access	Accessibility	Ramp location, accessible wudhu station
Air Conditioning	Wind (Lucide)	Fully air-conditioned main hall
Parking (Cars)	Car (Lucide)	Link to Parking screen for details
Parking (Motos)	Bike icon	Link to Parking screen for details
		
		

Card 1 — Wudhu Area Icon: Droplets (Lucide) Status: Available (green) Short description: "Separate wudhu facilities for men and women. Available 24 hours." View More content: "The mosque provides dedicated wudhu areas for both male and female jemaah located on the ground floor. Exact number of stations to be confirmed — placeholder until verified with Pusat Islam USM. Both sections are accessible at all hours including outside main prayer times." Note to team: Update station count once confirmed with mosque committee.
Card 2 — Women's Prayer Section Icon: Users (Lucide) Status: Available (green) Short description: "Dedicated women's musolla with separate entrance and own wudhu area." View More content: "The women's section is fully partitioned from the main hall and accessed via a dedicated entrance on the side of the building. It has its own wudhu facilities. Capacity information to be confirmed. The section is available for all daily prayers, Jumu'ah, and taraweeh." Note to team: Confirm exact entrance location and capacity.
Card 3 — Wheelchair & Accessibility Icon: Accessibility (Lucide or Google Material Symbols — use accessible icon) Status: Available (green) Short description: "Ramp access and accessible wudhu station available." View More content: "A wheelchair ramp is provided at the main entrance to allow access to the prayer hall. An accessible wudhu station is available on the ground floor. Jemaah requiring assistance are advised to enter via the main ground-floor entrance. Contact Pusat Islam USM for specific accessibility arrangements."
Card 4 — Air Conditioning Icon: Wind (Lucide) Status: Available (green) Short description: "Fully air-conditioned main prayer hall." View More content: "The main prayer hall is fully equipped with central air conditioning, providing a comfortable environment for daily prayers, Friday prayers, and all-night taraweeh sessions during Ramadan."
Card 5 — Library & Islamic Resource Centre Icon: BookOpen (Lucide) Status: Available (green) Short description: "On-site Islamic library with books, references, and study resources." View More content: "Pusat Islam USM maintains an Islamic library and resource centre within the complex, open to all USM students and staff. The collection covers fiqh, Quran sciences, Islamic history, and general Islamic reading. Opening hours follow office hours — contact Pusat Islam for current schedule."
Card 6 — Lecture Hall / Dewan Icon: School (Lucide) Status: Available (green) Short description: "Dedicated lecture and event hall for ceramah, talks, and programmes." View More content: "The complex includes a lecture hall used for Islamic talks, ceramah, educational programmes, and special events such as Hari Raya gatherings and Maulidur Rasul celebrations. Bookings for the hall are managed through the Pusat Islam USM administrative office."
Card 7 — Bilik Seminar / Meeting Rooms Icon: PresentationIcon or LayoutPanel (Lucide) Status: Available (green) Short description: "Seminar and discussion rooms available for Islamic study groups." View More content: "Small seminar rooms within the Pusat Islam complex are available for student Islamic study groups, usrah sessions, and committee meetings. Contact Pusat Islam USM directly to check availability and booking procedures."
Card 8 — Parking (Cars) Icon: Car (Lucide) Status: Limited (amber) Short description: "Car parking available nearby. Limited spaces — peak times on Fridays." View More content: "Car parking is available in the designated lots adjacent to the mosque. Spaces are limited, especially during Friday prayers and Ramadan taraweeh. See the Parking & Location screen for a full annotated map of car and motorcycle parking zones." CTA inside View More: "View Parking Map →" (text button, routes to §4.7 Parking screen)
Card 9 — Parking (Motorcycles) Icon: Use a motorcycle SVG from Lucide (Bike) or Phosphor Icons (motorcycle) Status: Available (green) Short description: "Motorcycle parking bays available close to the mosque entrance." View More content: "Dedicated motorcycle bays are located close to the mosque entrance. Generally more available than car parking. See the Parking & Location screen for exact bay locations." CTA inside View More: "View Parking Map →" (routes to §4.7 Parking screen)
Card 10 — ATM / Banking Icon: CreditCard (Lucide) Status: Info Only (grey) Short description: "ATM machines available within the USM campus nearby." View More content: "While there are no ATM machines inside the mosque complex itself, several are available within walking distance on the USM Induk campus. Check USM's campus map for the nearest locations."
Card 11 — Cafeteria / Canteen Icon: UtensilsCrossed (Lucide) Status: Info Only (grey) Short description: "Halal food options available in the surrounding campus area." View More content: "There is no canteen inside the mosque complex, but USM's campus cafeterias and food stalls are a short walk away. All campus food outlets are certified halal. During Ramadan, bazaar stalls are typically set up nearby for iftar."

Bottom of Facilities screen: A soft note in small muted text: "Facility information is based on Pusat Islam USM's official website (pusatislam.usm.my/fasiliti). For the most up-to-date details, contact Pusat Islam USM directly." With a "Visit Official Website →" text link.

▌ 4.7  Parking & Location Screen
23.	Static annotated satellite image: Google Maps 3D screenshot with colour-coded overlays
◦	Red overlay: car parking zones
◦	Blue overlay: motorcycle parking zones
◦	Green pin: mosque entrance
24.	Legend card below image: colour key + estimated capacity
25.	Walking route cards: 'From Main Gate', 'From DKG', 'From Chancellery' (text + estimated minutes)
26.	'Open in Google Maps' CTA button — deep link to coordinates
27.	Limitations info: restricted zones, Friday peak hours, no overnight parking
Parking image to be prepared by team: screenshot Google Maps 3D view, annotate in Figma/Canva, export as PNG.

▌ 4.8  Events & Programmes Screen
28.	Filter tabs: All | Taraweeh (this one only will be available on Ramadhan, one Ramadhan end, this tab will be remove) | Ceramah | Class | Community
29.	Toggle: Upcoming | Past
30.	Event cards (full-width, stacked): (this I think we can also extract the poster if available from their social media, either from instargram or telegram, need to use special tool to retrieve the photo directly to website instead of manually store to database)
◦	Event type badge (colour-coded: Taraweeh=purple, Ceramah=orange, Class=teal, Community=green)
◦	Event title (Poppins 600, 16px)
◦	Date + time + location (14px, muted)
◦	Short description (2 lines truncated, expandable)
◦	'Add to Calendar' micro-CTA (Lucide calendar+ icon)
31.	Empty state: 'No upcoming events. Check back soon!' with mosque illustration
32.	Admin-only: floating '+' FAB button (visible only to admin users)

▌ 4.9  Profile / Settings Screen
33.	User avatar (initials-based, coloured by name hash, allow user to change profile picture, store to supabase)
34.	Display name + email + zone badge
35.	Settings section:
◦	Dark / Light mode toggle (sync with system or manual override)
◦	Prayer time zone selector (USM / Gelugor / Manual)
◦	Prayer reminders: per-prayer toggle + minutes-before selector
◦	Language: English / Bahasa Melayu (Phase 2)
36.	Account section: Change Password, Sign Out, Delete Account
37.	About section: App version, KrackedDevs link, RC26 badge
38.	Admin Dashboard shortcut (admin role only — visible after role check)

▌ 4.10  Admin Dashboard Screen
Accessible only to users with role=admin. Entry point via Profile > Admin Dashboard.
39.	Analytics overview: Total users, DAU (last 7 days), New sign-ups this week (bar chart)
40.	Events CRUD: list of all events, edit/delete buttons, 'Add Event' form
41.	Add Event form fields: Title, Type, Date, Time, Location, Description, Image URL (optional)
42.	Mosque Info editor: key-value edit form for all dynamic info fields
43.	User list: email, provider, created date, zone (read-only, for RC26 verification)
44.	Prayer override: set a custom prayer time for a specific date
45.	Donation QR upload: image upload input
46.	Parking image upload: image upload input
 
§5  User Flows
▌ 5.1  New User Onboarding Flow
•  User visits the URL → Full landing page loads (not a mobile-splash onboarding). The hero section is immediately visible: mosque photo crossfade slideshow plays in the background with GSAP entrance animations. "Sign Up" and "Log In" buttons are visible in the top-right of the hero section. 
•  User reads the landing page — scrolls through mosque heritage section, feature overview cards, live prayer times preview widget, and the community CTA section (all unauthenticated, no login required to view). 
•  User taps or clicks "Get Started — It's Free" (hero CTA) or "Create Free Account" (bottom CTA) → navigates to the Sign Up screen. 
•  User fills: Full Name, Email, Password, Confirm Password → selects prayer time zone (USM / Gelugor). 
•  OR user taps "Sign in with Google" or "Sign in with Apple" → OAuth redirect flow → on return, completes zone selection if first time. 
•  Account created → email verification sent (email/password path only). User sees a "Check your inbox" confirmation screen with a resend link. 
•  User clicks verification link in email → redirected back to the app → session established automatically. 
•  User lands on Home Dashboard — the mosque basics screen with donut timer, prayer strip, and quick-access grid. 
•  On subsequent visits, the landing page is skipped entirely if a valid session exists — user goes straight to Home Dashboard (see §5.2).
▌ 5.2  Returning User Flow
47.	User visits URL → app checks session (localStorage / Supabase session)
48.	If valid session → skip onboarding, go directly to Home Dashboard
49.	If expired → show Login screen with email pre-filled
50.	Login → Home Dashboard

▌ 5.3  Prayer Time Check Flow
51.	User opens app → Home screen shows donut timer for next prayer
52.	User taps prayer strip OR taps 'Prayer' nav tab → Prayer Times screen
53.	Sees today's full prayer table, active prayer highlighted
54.	Optional: taps bell icon on a prayer → browser asks for notification permission
55.	If granted → ServiceWorker schedules push notification X minutes before prayer

▌ 5.4  Event Discovery Flow
56.	User taps 'Events' nav tab OR events teaser card on Home
57.	Events screen shows upcoming events, default filter: All
58.	User taps a filter tab (e.g. Taraweeh) → list filters in place
59.	User taps an event card → card expands to show full description
60.	User taps 'Add to Calendar' → generates .ics link or opens device calendar

▌ 5.5  Admin Event Creation Flow
61.	Admin logs in → Profile > Admin Dashboard
62.	Taps 'Events' section → sees existing events list
63.	Taps '+' FAB → Add Event modal slides up
64.	Fills form: title, type, date, time, location, description
65.	Taps 'Publish' → event saved to database → appears immediately in Events screen
66.	Admin can tap any event → edit or delete

▌ 5.6  Theme Toggle Flow
67.	User taps sun/moon icon in header (Home) OR toggles in Settings
68.	CSS class swaps on <html> element: class='dark' ↔ class='light'
69.	All CSS custom properties resolve to dark/light values
70.	Transition: 400ms ease-in-out on background-color, color, border-color
71.	Preference saved to localStorage → persists across sessions
 
§6  Feature Specification
▌ 6.1  Feature Priority Matrix
Feature	Priority	RC26 Phase	Description
Mosque Basics page	P0	MVP	RC26 mandatory — prayer times, info, facilities, parking, events
Prayer time display	P0	MVP	Today's 5 prayer times for Gelugor zone via Al-Adhan API
Donut countdown timer	P0	MVP	Real-time SVG ring countdown to next prayer
User authentication	P0	MVP	Email/password + Google OAuth + Apple Sign In
Events & Programmes page	P0	MVP	List of upcoming events with type filter
Mosque Info page	P0	MVP	Name, address, contact, description, socials
Facilities page	P0	MVP	Facility cards with status
Parking & Location page	P0	MVP	Annotated map image + Google Maps link
Admin dashboard	P0	MVP	Event CRUD, mosque info edit, user list
KrackedDevs promo section	P0	MVP	RC26 compliance: logo, message, join link
PWA manifest + install	P1	MVP	Add to Home Screen support
Dark/light mode toggle	P1	MVP	CSS custom property-based theming
Monthly prayer timetable	P1	MVP	Scrollable monthly view
Prayer reminder notifications	P2	Post-MVP	Browser push notifications
Arabic prayer names display	P2	MVP	Noto Naskh Arabic font rendering
Hijri date display	P2	MVP	Convert Gregorian using hijri-js library
Add to Calendar (events)	P2	Post-MVP	ICS file generation
Multi-language (BM)	P3	Post-MVP	i18n support
Quran reader	P3	Post-MVP	Out of scope RC26

▌ 6.2  Donut Timer — Technical Specification
SVG Ring Calculation
The donut ring uses an SVG circle with stroke-dasharray and stroke-dashoffset to animate the prayer countdown.
circumference = 2 × π × radius
radius = 54px (inner radius of ring, 8px stroke, 120px viewBox)
circumference ≈ 339.3px
elapsed = currentTime - prayerStartTime (seconds)
interval = nextPrayerTime - prayerStartTime (seconds)
progress = elapsed / interval  (0.0 to 1.0)
dashOffset = circumference × (1 - progress)
CSS transition on stroke-dashoffset: 1000ms linear — creates smooth per-second sweep. Ring fills clockwise as time passes. Ring resets instantly when next prayer begins.

▌ 6.3  Prayer Time API Integration
Primary Source: Al-Adhan API
GET https://api.aladhan.com/v1/timingsByCity
  ?city=Gelugor&country=Malaysia&method=11&school=0
  Response: { data: { timings: { Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha } } }
Method 11 = Jabatan Kemajuan Islam Malaysia (JAKIM). School 0 = Shafi'i (standard in Malaysia).
✔  Cache daily prayer times in Supabase. Fetch from API once per day via a Supabase Edge Function cron job. Client reads from Supabase, not directly from Al-Adhan API. This prevents rate limiting and enables offline capability.

▌ 6.4  Authentication Specification
Provider	Method	User Count Trackable	Notes
Email/Password	Supabase Auth	Yes	Email verification required before first login
Google OAuth	Supabase OAuth	Yes	Uses Google's hosted OAuth 2.0 flow
Apple Sign In	Supabase OAuth	Yes	Required for iOS users; Supabase has native support
All three providers write to the same auth.users table in Supabase. A trigger creates a public.users record with zone, display_name, and role (default: 'user').
 
§7  Backend & System Architecture
▌ 7.1  Architecture Overview
JomSolat uses a serverless, managed-backend architecture. There is no custom API server to maintain. All backend logic runs through Supabase (PostgreSQL + Auth + Storage + Edge Functions) and the Vercel deployment pipeline.
System Layers:
Layer	Technology	Responsibility
Client (PWA)	React + Vite	UI rendering, state management, service worker, offline cache
Auth	Supabase Auth	JWT issuance, OAuth flows, session management
Database	Supabase PostgreSQL	All persistent data: users, events, mosque info, prayer overrides
Storage	Supabase Storage	Parking images, donation QR codes, mosque photos
Scheduled Jobs	Supabase Edge Functions	Daily prayer time fetch + cache from Al-Adhan API
Deployment / CDN	Vercel	Static hosting, global CDN, automatic HTTPS
External APIs	Al-Adhan API	Prayer time source (Gelugor, Method 11)
Push Notifications	Web Push API + VAPID	Browser-native, no third party needed

▌ 7.2  Data Flow Diagram (Described)
Prayer Times Flow:
72.	Supabase Edge Function (cron, runs at 00:01 daily) calls Al-Adhan API for today's prayer times
73.	Response stored in prayer_cache table with date + zone + 5 prayer times
74.	Client app fetches from prayer_cache via Supabase JS client on app load
75.	Client caches response in localStorage with TTL = end of current day
76.	If network unavailable, client reads from localStorage cache

Auth Flow:
77.	User submits credentials / OAuth → Supabase Auth validates
78.	Supabase issues JWT access token (1 hour) + refresh token (7 days)
79.	Supabase JS client stores tokens in localStorage
80.	All subsequent requests include Bearer token in Authorization header
81.	Row Level Security (RLS) on all tables enforces data access rules
82.	Admin role verified server-side via RLS policy: role = 'admin' in public.users

▌ 7.3  Database Schema
Table: public.users
Column	Type	Constraints	Notes
id	UUID	PK, FK → auth.users	Matches Supabase Auth UID
display_name	TEXT	NOT NULL	From OAuth or signup form
email	TEXT	UNIQUE, NOT NULL	Indexed
zone	TEXT	DEFAULT 'gelugor'	gelugor | usm | manual
role	TEXT	DEFAULT 'user'	user | admin
provider	TEXT	NOT NULL	email | google | apple
created_at	TIMESTAMPTZ	DEFAULT now()	For analytics / RC26 count
last_seen_at	TIMESTAMPTZ	NULLABLE	Updated on session open

Table: public.events
Column	Type	Constraints	Notes
id	UUID	PK, DEFAULT gen_random_uuid()	
title	TEXT	NOT NULL	Event display name
type	TEXT	NOT NULL	taraweeh | ceramah | class | community
event_date	DATE	NOT NULL	Indexed
event_time	TIME	NULLABLE	NULL = all-day event
location	TEXT	NULLABLE	e.g. Dewan Kuliah A
description	TEXT	NULLABLE	Max 1000 chars
image_url	TEXT	NULLABLE	Supabase Storage URL
is_active	BOOLEAN	DEFAULT true	Soft delete
created_by	UUID	FK → public.users	Admin who created it
created_at	TIMESTAMPTZ	DEFAULT now()	
updated_at	TIMESTAMPTZ	DEFAULT now()	

Table: public.mosque_info
Column	Type	Notes
id	UUID	PK
key	TEXT	UNIQUE — e.g. 'contact_phone', 'description', 'donation_qr_url'
value	TEXT	The content value
updated_at	TIMESTAMPTZ	Tracks last admin update
updated_by	UUID	FK → public.users (admin)

Table: public.prayer_cache
Column	Type	Notes
id	UUID	PK
date	DATE	UNIQUE + zone — composite key
zone	TEXT	gelugor | usm
fajr	TIME	
sunrise	TIME	For reference only (not a fard prayer time)
dhuhr	TIME	
asr	TIME	
maghrib	TIME	
isha	TIME	
fetched_at	TIMESTAMPTZ	When the API was called

Table: public.prayer_overrides
Column	Type	Notes
id	UUID	PK
date	DATE	Which date this override applies
prayer_name	TEXT	fajr | dhuhr | asr | maghrib | isha
override_time	TIME	Replaces cached value for this date only
reason	TEXT	Admin note (e.g. 'Ramadan khusus')
created_by	UUID	FK → public.users (admin)

▌ 7.4  Row Level Security (RLS) Policies
Table	Operation	Policy	Effect
public.users	SELECT	auth.uid() = id OR role = 'admin'	Users see own; admins see all
public.users	UPDATE	auth.uid() = id	Users update own only
public.events	SELECT	is_active = true	All authenticated users see active events
public.events	INSERT	EXISTS (SELECT 1 FROM users WHERE id=auth.uid() AND role='admin')	Admins only
public.events	UPDATE	Same as INSERT	Admins only
public.events	DELETE	Same as INSERT	Admins only (hard delete)
public.mosque_info	SELECT	TRUE (public read)	Any authenticated user
public.mosque_info	UPDATE	Admin only	Admin role required
public.prayer_cache	SELECT	TRUE (public read)	All authenticated users
public.prayer_cache	INSERT	Service role only (Edge Function)	Only cron job can write
 
§8  API Specification
JomSolat does not expose a custom REST API. All data access is through the Supabase JS client (supabase-js v2), which wraps PostgREST. This section documents the key query patterns.

▌ 8.1  External API — Al-Adhan
Endpoint	Method	Usage	Caching
https://api.aladhan.com/v1/timingsByCity?city=Gelugor&country=Malaysia&method=11	GET	Fetch daily prayer times for Gelugor zone	Daily via Edge Function cron
Response Shape (simplified):
{ data: { timings: { Fajr: '05:50', Sunrise: '07:10',
           Dhuhr: '13:15', Asr: '16:40',
           Maghrib: '19:28', Isha: '20:40' } } }

▌ 8.2  Supabase Client Query Patterns
Get today's prayer times:
const { data } = await supabase
  .from('prayer_cache')
  .select('*')
  .eq('date', today)
  .eq('zone', userZone)
  .single()

Get upcoming events (next 14 days):
const { data } = await supabase
  .from('events')
  .select('*')
  .eq('is_active', true)
  .gte('event_date', today)
  .lte('event_date', twoWeeksFromNow)
  .order('event_date', { ascending: true })

Create event (admin only):
const { error } = await supabase
  .from('events')
  .insert({ title, type, event_date, event_time, location, description, created_by: user.id })

Get mosque info by key:
const { data } = await supabase
  .from('mosque_info')
  .select('key, value')

▌ 8.3  Supabase Edge Function — Prayer Cache Cron
Function: refresh-prayer-cache
Schedule:  0 0 * * *  (midnight UTC+8, i.e. 16:00 UTC)
Runtime:   Deno (Supabase Edge Functions)
Logic:
  1. Fetch today + next 7 days from Al-Adhan API
  2. Upsert into prayer_cache (date + zone as unique key)
  3. Log result to Supabase logs
  4. Return { success: true, datesUpdated: n }
✔  Fetch 7 days ahead so the client always has data even if the cron job fails for a day.
 
§9  Technology Stack & Trade-offs
▌ 9.1  Recommended Stack
Layer	Chosen Tech	Why This Choice
Frontend Framework	React 18 + Vite 5	Fast HMR, excellent PWA plugin, large ecosystem, team familiarity
State Management	Zustand + React Query	Zustand for global UI state; React Query for server state + caching
Styling	Tailwind CSS v3	Utility-first, mobile-first responsive, pairs well with custom CSS vars for theming
Authentication	Supabase Auth	Built-in OAuth for Google/Apple, JWT, RLS integration, free tier
Database	Supabase PostgreSQL	Managed Postgres, RLS, real-time, PostgREST, generous free tier
File Storage	Supabase Storage	Same ecosystem, S3-compatible, RLS on buckets
Edge Functions	Supabase Deno Edge Functions	For prayer cache cron job, no extra infrastructure
Deployment	Vercel	Zero-config React deploy, global CDN, automatic HTTPS, free tier
PWA	vite-plugin-pwa + Workbox	Manifest generation, service worker, offline cache out of the box
Prayer Times	Al-Adhan REST API	Free, JAKIM method, no API key required, reliable
Hijri Date	hijri-js npm package	Pure JS, no external call, accurate Islamic calendar conversion
Icons	Lucide React v0.263	Tree-shakeable SVG, open source, consistent stroke weight
Fonts	Google Fonts (Amiri + Poppins + Noto Naskh Arabic)	Free, self-hostable, FOIT prevention via display=swap
Forms	React Hook Form + Zod	Minimal re-renders, schema-based validation, TypeScript-friendly
Routing	React Router v6	Mature, nested routes for admin, hash or history routing

▌ 9.2  Trade-off Analysis
Decision 1: Supabase vs. Firebase
Factor	Supabase	Firebase
Database	Real PostgreSQL — powerful SQL queries	NoSQL Firestore — limited querying
Cost model	Free tier: 500MB DB, 2GB storage, 5GB bandwidth	Free tier: limits differ, can spike
RLS	PostgreSQL RLS — fine-grained, declarative	Security Rules — more verbose
Auth	Email + Google + Apple built-in	Same providers available
Offline	Limited (no native offline like Firestore)	Firestore has native offline sync
Vendor lock-in	Lower — standard Postgres, exportable	Higher — proprietary data model
Verdict	✔ CHOSEN — SQL is better for structured mosque data	Not chosen

Decision 2: PWA vs. React Native
Factor	PWA (Chosen)	React Native
Dev speed	Single codebase, no build tools per platform	Separate native builds required
App stores	Not in stores (direct URL install)	App Store + Play Store submission
Time to deploy	Minutes (Vercel push)	Days/weeks (review process)
Push notifications	Web Push API (limited on iOS < 16.4)	Full native push support
Offline support	Service Worker + Workbox cache	Full offline via Redux Persist etc
RC26 timeline	✔ Feasible in 7 days	Not feasible in 7 days
Verdict	✔ CHOSEN for RC26 — revisit post-RC26	Post-MVP consideration

Decision 3: Vercel vs. GitHub Pages
Factor	Vercel (Chosen)	GitHub Pages
Build pipeline	Auto-deploy on push, env vars, preview URLs	CI/CD via GitHub Actions (manual setup)
SPA routing	Handles client-side routing natively	Requires 404.html hack for SPA routing
Custom domain	Free, one-click	Free but manual CNAME config
HTTPS	Automatic	Automatic via GitHub
Edge Functions	Vercel Functions available if needed	Not available
Verdict	✔ CHOSEN — better DX and SPA support	Backup option only
 
§10  Security Requirements
▌ 10.1  Authentication Security
•	All auth handled by Supabase Auth — no custom credential storage
•	Passwords hashed with bcrypt (handled by Supabase, never in client code)
•	JWT tokens expire in 1 hour; refresh tokens expire in 7 days
•	Refresh tokens rotated on use (Supabase default)
•	Email verification required for email/password signup before first dashboard access
•	OAuth state parameter validated by Supabase to prevent CSRF on OAuth flow

▌ 10.2  Database Security
•	Row Level Security (RLS) enabled on ALL tables — no table is unprotected
•	Admin role verification done server-side via RLS policy, never trust client-side role checks
•	Service role key (supabaseServiceKey) used ONLY in Edge Functions — never exposed to client
•	Client uses anon key only — restricted by RLS
•	All queries parameterised through supabase-js (no raw SQL injection risk)
WARNING: Never expose SUPABASE_SERVICE_ROLE_KEY in client-side code or public repos. Use .env and Vercel environment variables.

▌ 10.3  API Security
•	Al-Adhan API called only from Edge Function (server-side), never from client
•	No sensitive keys in client bundle — API keys in Vercel environment variables
•	CORS handled by Supabase (configured to allow app domain only in production)
•	HTTP headers: HSTS, X-Frame-Options, X-Content-Type-Options set via Vercel headers config

▌ 10.4  Data Privacy
•	Only collect: name, email, zone preference. No sensitive personal data.
•	No user photos or location tracking beyond zone selection
•	Analytics data (user count, DAU) used only for RC26 and mosque improvement — not sold
•	User can delete account at any time (Profile > Delete Account)
•	Supabase hosted on AWS ap-southeast-1 (Singapore) — data stays in ASEAN region

▌ 10.5  PWA / Client Security
•	Content Security Policy (CSP) header: restrict script sources to self + trusted CDNs
•	Service Worker: cache only app's own assets, never cache auth tokens in SW cache
•	Sensitive data (JWT) in localStorage — acceptable for this threat model (not a banking app)
•	HTTPS enforced by Vercel — no HTTP allowed
•	Dependabot / npm audit run before final submission to catch known CVEs
 
§11  Non-Functional Requirements
▌ 11.1  Performance
Metric	Target	Measurement Method
First Contentful Paint (FCP)	< 1.5s on 4G	Lighthouse / Chrome DevTools
Largest Contentful Paint (LCP)	< 2.5s on 4G	Lighthouse (Good = < 2.5s)
Time to Interactive (TTI)	< 3.5s on 4G	Lighthouse
Cumulative Layout Shift (CLS)	< 0.1	Lighthouse (Good = < 0.1)
Total bundle size (initial load)	< 200KB gzipped	Vite build output + bundle analyser
Prayer time load from cache	< 100ms	Performance.now() in dev tools
Lighthouse PWA score	≥ 90	Lighthouse PWA audit
Lighthouse Accessibility score	≥ 90	Lighthouse Accessibility audit

▌ 11.2  Accessibility
•	WCAG 2.1 AA compliance target
•	All interactive elements: minimum 44×44px touch target
•	Colour contrast ratio: ≥ 4.5:1 for normal text, ≥ 3:1 for large text
•	All images: meaningful alt text
•	All form inputs: associated <label> elements
•	Focus management: keyboard navigation and visible focus ring
•	Screen reader support: ARIA roles on custom components (nav, timer, tabs)
•	prefers-reduced-motion: all animations disabled or reduced

▌ 11.3  Reliability & Uptime
•	Vercel SLA: 99.99% uptime for hosting
•	Supabase SLA: 99.9% uptime (free tier has no SLA — acceptable for RC26)
•	Prayer time fallback: if Supabase unavailable, read from localStorage cache
•	Offline mode: cached prayer times and mosque info available without network
•	Graceful degradation: if events API fails, show 'Unable to load events' instead of crashing

▌ 11.4  Scalability (Post-RC26)
•	Supabase free tier supports up to 500MB DB and 500 concurrent connections — sufficient for RC26
•	Upgrade path: Supabase Pro at $25/month for production scale
•	React Query caching reduces Supabase API calls (default staleTime: 5 minutes for events)
•	Prayer cache table prevents repeated Al-Adhan API calls under load
 
§12  Constraints & Limitations
▌ 12.1  RC26 Hard Constraints
Constraint	Type	Detail
14-day total timeline	Time	7 days build, 7 days growth — no extension
Must be live by Day 7	Time	Deployed web app at public URL
Must have own sign-up system	Technical	Email or OAuth — user count must be verifiable
Must include KrackedDevs promo	Content	Logo, message, join link, referral link in app
Target: 10 signed-up users	Growth	Required for Growth Award consideration
Tag RC26 in showcase submission	Admin	Use tag RC26 when submitting
Must include Mosque Basics page	Content	All 6 items: prayer times, info, facilities, parking, events, contact
Admin access for verification	Technical	Provide admin credentials to Kracked Devs team

▌ 12.2  Technical Constraints
•	PWA only — no native app store submission in this phase
•	Apple Push Notifications on iOS require iOS 16.4+ and 'Add to Home Screen' install
•	Al-Adhan API rate limit: 100 requests/day per IP — mitigated by Edge Function caching
•	Supabase free tier: 500MB database, 2GB file storage, 5GB bandwidth/month
•	Google Maps API: Embed API is free but requires API key with referrer restriction
•	Google OAuth: requires verified domain in Google Console — use Vercel domain
•	Apple Sign In: requires Apple Developer account — Team lead must register

▌ 12.3  Content Constraints
•	Mosque photos: must be taken by team or used from official social media with permission
•	Parking map: team must manually annotate screenshot — Google Maps screenshot permitted for non-commercial use within app
•	Donation QR code: must be obtained from mosque committee — placeholder until confirmed
•	Event data: manually entered by admin — no automated Instagram scraping (ToS violation)
•	Prayer times: based on Gelugor zone (Penang JAKIM method) — not real-time GPS-based

▌ 12.4  Team Constraints
•	14-day window during Ramadan — team members have fasting + taraweeh obligations
•	Recommended: hard code freeze at Day 6, deploy Day 6, Day 7 for testing and bug fixes only
•	Growth phase (Days 8–14) requires dedicated community outreach time, not just coding
 
§13  RC26 Full Compliance Matrix
Requirement	Status	Owner	Acceptance Criteria
Live deployed web app / PWA	Planned	Backend lead	Public Vercel URL accessible from any browser
Sign-up system (email or OAuth)	Planned	Auth lead	Email + Google + Apple working; users stored in Supabase
KrackedDevs promo section	Planned	Frontend lead	Visible on Home screen; logo, message, join link, referral link
Submission: live URL	Planned	Team lead	URL submitted with RC26 tag in showcase
Submission: mosque name + location	Done	Team lead	Masjid Al-Malik Khalid, USM Induk, Penang
Submission: admin access	Planned	Backend lead	admin@jomsolat.app credentials provided to RC26 verifier
Submission: short description	Done	Team lead	Included in proposal and PRD
RC26 tag in showcase	Planned	Team lead	Tag 'RC26' applied at submission
Mosque Basics — Prayer times	Planned	Frontend lead	5 prayer times displayed correctly for Gelugor zone
Mosque Basics — Mosque info	Planned	Frontend lead	Name, address, contact, description, socials present
Mosque Basics — Facilities	Planned	Frontend lead	Min 6 facility cards displayed with status
Mosque Basics — Parking & Location	Planned	Frontend lead	Annotated map image + Google Maps link
Mosque Basics — Events & Programmes	Planned	Admin	Min 3 events entered before Day 7
Mosque Basics — Contact details	Planned	Frontend lead	Phone, email, WhatsApp visible
Target 10 users (Growth Award)	In Progress	All	10 unique registered users in Supabase auth.users table
Ship before Day 7	Planned	All	Day 5 internal target — Day 7 hard deadline
 
§14  Development Plan (14-Day Sprint)
▌ Day-by-Day Execution Plan
Day	Phase	Goals	Definition of Done
Pre-event	Setup	Register RC26, join Discord, set up Vercel + Supabase, init React/Vite repo, set up Tailwind + design tokens	Repo live, env vars set, 'Hello World' deployed to Vercel
Day 1	Build	Implement design system (colours, fonts, components), build Auth screens (Login, Sign Up, OAuth)	Auth flow works end-to-end
Day 2	Build	Build Onboarding screens (slideshow, walkthrough), Prayer Times page with Al-Adhan API integration	Prayer times display correctly for Gelugor
Day 3	Build	Build Home Dashboard (donut timer, prayer strip, quick-access grid), implement Hijri date	Countdown timer updates live
Day 4	Build	Build Mosque Info page, Facilities page, Parking page	All mosque basics pages have real content
Day 5	Build	Build Events page, Admin Dashboard (CRUD), KrackedDevs promo section, PWA manifest	Admin can create events; events appear on Events page
Day 6	Polish	Dark/light mode, responsive desktop layout, accessibility pass, Lighthouse audit, bug fixes	Lighthouse PWA ≥ 80, no broken pages
Day 7	Ship	Final deploy, test all user flows end-to-end, submit RC26 showcase entry, brief smoke test	Live URL works; RC26 entry submitted with tag
Day 8	Growth	Post in USM WhatsApp groups, share personal social media, seed 5 users from team contacts	5 registered users
Day 9-10	Growth	Share with USM Muslim Society, post demo video, reach out to Pusat Islam USM Instagram	8 registered users
Day 11-12	Growth	Print QR code for mosque notice board, ask admin at Pusat Islam to share link	10+ registered users
Day 13-14	Retain	Fix any bugs reported by users, respond to feedback, post progress on Discord daily	DAU stable, no critical bugs
Day 15	Showcase	Prepare demo video, present at RC26 showcase, await results	Demo submitted
 
§15  Environment & DevOps
▌ 15.1  Environment Variables
Variable	Where Used	How to Set	Security Level
VITE_SUPABASE_URL	Client (public)	Vercel env var + .env.local	Public — safe to expose
VITE_SUPABASE_ANON_KEY	Client (public)	Vercel env var + .env.local	Public — RLS protects data
SUPABASE_SERVICE_ROLE_KEY	Edge Function only	Supabase Secrets — never in client bundle	SECRET — never expose
VITE_GOOGLE_MAPS_API_KEY	Client (public)	Vercel env var, restrict to app domain	Restricted — domain-locked
VITE_APP_URL	Client	Set to Vercel deployment URL	Public

▌ 15.2  CI/CD Pipeline
83.	Developer pushes to GitHub branch → Vercel auto-deploys preview URL
84.	Preview URL tested by team
85.	Merge to main → Vercel production deploy (< 30 seconds)
86.	Vercel build runs: npm run build (Vite) → static output → CDN distributed
✔  Use Vercel branch deployments for Day 6 polish phase so the live URL stays stable while fixing bugs on a feature branch.

▌ 15.3  Repository Structure
jomsolat/
├── src/
│   ├── components/     # Reusable UI components (Button, Card, PrayerRow...)
│   ├── pages/          # Route-level page components
│   ├── hooks/          # Custom React hooks (usePrayerTimes, useUser...)
│   ├── lib/            # Supabase client, API helpers, hijri utils
│   ├── store/          # Zustand stores (theme, user, prayer state)
│   ├── styles/         # globals.css with CSS custom properties
│   └── types/          # TypeScript type definitions
├── supabase/
│   ├── migrations/     # SQL migration files
│   └── functions/      # Edge Functions (refresh-prayer-cache)
├── public/             # PWA icons, manifest.json, og-image
└── vite.config.ts      # Vite + PWA plugin config
 
§16  Open Questions & Risk Register
▌ 16.1  Open Questions
#	Question	Owner	Due
OQ-01	Can the team obtain official permission from Pusat Islam USM to use their logo/photos?	Team lead	Before Day 1
OQ-02	What is the final donation QR code for the mosque? Who provides it?	Team lead	Day 3
OQ-03	Apple Developer account — does any team member have one for Apple Sign In?	Backend lead	Day 1
OQ-04	Which admin email will be given to Kracked Devs for RC26 verification?	Team lead	Day 7
OQ-05	Should prayer times show Subuh or Fajr as the label? (Both are correct; pick one.)	Design lead	Day 1
OQ-06	Will Pusat Islam USM share our link on their Instagram? (Needed for Growth Award)	Team lead	Day 9

▌ 16.2  Risk Register
Risk	Likelihood	Impact	Mitigation
Prayer time API downtime	Low	High	Cache 7 days ahead in Supabase; localStorage fallback
Team burnout during Ramadan fasting	Medium	High	Hard code freeze Day 6; protect Day 7 as buffer
Apple Sign In setup delay	High	Medium	Ship without Apple Sign In first; add post-Day 1
Supabase free tier quota exceeded	Low	Medium	Monitor usage; Supabase sends alerts before limit
10-user target not met	Medium	Medium	Seed with team + close contacts first; pray for the best 🤲
Content not ready (QR, parking map)	Medium	Medium	Placeholder assets first; team inserts real content Day 5–6
Google Maps API key abuse	Low	Low	Domain-restrict API key in Google Console
Lack of admin to add events pre-launch	High	High	Dev team acts as admin; hand over to mosque later
 
§17  Glossary
Term	Definition
PWA	Progressive Web App — a web app installable on mobile via 'Add to Home Screen'
MVP	Minimum Viable Product — smallest version that satisfies core requirements
RLS	Row Level Security — PostgreSQL feature to restrict table access per-row based on user identity
JWT	JSON Web Token — signed token used for stateless authentication
DAU	Daily Active Users — number of unique users who open the app in a day
CDN	Content Delivery Network — distributed servers that serve assets from edge nodes close to the user
Edge Function	Serverless function that runs close to the user on a CDN edge node
PostgREST	Supabase's auto-generated REST API from the PostgreSQL schema
JAKIM	Jabatan Kemajuan Islam Malaysia — official body setting Malaysian prayer times
Gelugor	The zone/district in Penang under which USM prayer times fall (JAKIM zone: Balik Pulau/Gelugor)
RC26	Ramadan Challenge 2026 — the KrackedDevs hackathon event this app is built for
DXA	DocX Unit — 1/1440th of an inch, used in Word document measurements
CSP	Content Security Policy — HTTP header restricting which scripts/resources can load
VAPID	Voluntary Application Server Identification — keys used to authorise Web Push notifications
OAuth 2.0	Open authorisation protocol for third-party login (Google, Apple)
FOIT	Flash of Invisible Text — text hidden while a web font loads; prevented with font-display: swap
Hijri	Islamic lunar calendar (e.g. 1 Ramadan 1447H)


JomSolat PRD v1.0  ·  Team Murtabug  ·  Ramadan Challenge 2026 (RC26)
krackeddevs.com  ·  Selamat Beribadah
