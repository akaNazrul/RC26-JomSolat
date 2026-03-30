#!/usr/bin/env node
import fs from 'fs';
const base = 'https://jomsolat.app';
const pages = [
  '/',
  '/landing',
  '/home',
  '/prayer-times',
  '/mosque-info',
  '/facilities',
  '/parking',
  '/feed',
  '/profile',
  '/account-settings',
  '/admin-dashboard',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password'
];

const urls = pages.map(p => `${base}${p}`).map(url => `  <url>\n    <loc>${url}</loc>\n  </url>`).join('\n');
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

fs.mkdirSync('public', { recursive: true });
fs.writeFileSync('public/sitemap.xml', xml, 'utf8');
console.log('Wrote public/sitemap.xml');