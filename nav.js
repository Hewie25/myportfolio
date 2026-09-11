npm i @vercel/analytics

import type { AppProps } from 'next/app';
import { Analytics } from '@vercel/analytics/next';
 
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
 
export default MyApp;
const pages = [
  'portfolio-home.html',
  'portfolio-about.html',
  'portfolio-services.html',
  'portfolio-work.html',
  'portfolio-contact.html'
];

const currentFile = window.location.pathname.split('/').pop() || 'portfolio-home.html';
const currentIndex = pages.indexOf(currentFile);

// ========== THEME ==========
const root = document.documentElement;
const metaTheme = document.querySelector('meta[name="theme-color"]');
const mobileThemeIcon = document.getElementById('mobileThemeIcon');

function getPreferredTheme() {
  const stored = localStorage.getItem('hubert-theme');
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  localStorage.setItem('hubert-theme', theme);
  if (metaTheme) {
    metaTheme.setAttribute('content', theme === 'light' ? '#f4f7f5' : '#0f1419');
  }
  if (mobileThemeIcon) {
    mobileThemeIcon.className = theme === 'light' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }
}

applyTheme(getPreferredTheme());

function toggleTheme() {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
}

document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);
document.getElementById('mobileThemeToggle')?.addEventListener('click', toggleTheme);

// ========== SWIPE NAVIGATION ==========
let startX = 0;
let startY = 0;
let isSwiping = false;

const SWIPE_THRESHOLD = 70;   // minimum distance
const RATIO = 1.5;            // horizontal must be clearly bigger than vertical

document.addEventListener('touchstart', (e) => {
  if (e.touches.length !== 1) return;
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
  isSwiping = true;
}, { passive: true });

document.addEventListener('touchmove', (e) => {
  if (!isSwiping) return;
  // optional: you can add visual feedback here later
}, { passive: true });

document.addEventListener('touchend', (e) => {
  if (!isSwiping || e.changedTouches.length !== 1) {
    isSwiping = false;
    return;
  }

  const endX = e.changedTouches[0].clientX;
  const endY = e.changedTouches[0].clientY;
  const diffX = endX - startX;
  const diffY = endY - startY;

  const absX = Math.abs(diffX);
  const absY = Math.abs(diffY);

  // Only trigger if the swipe is clearly horizontal
  if (absX > SWIPE_THRESHOLD && absX > absY * RATIO) {
    if (diffX < 0) {
      // Swipe left → next page
      goToPage(currentIndex + 1);
    } else {
      // Swipe right → previous page
      goToPage(currentIndex - 1);
    }
  }

  isSwiping = false;
}, { passive: true });

function goToPage(index) {
  if (index < 0 || index >= pages.length) return;
  window.location.href = pages[index];
}

// Optional: also support mouse drag on desktop (for testing)
let mouseDown = false;
let mouseStartX = 0;

document.addEventListener('mousedown', (e) => {
  mouseDown = true;
  mouseStartX = e.clientX;
});

document.addEventListener('mouseup', (e) => {
  if (!mouseDown) return;
  mouseDown = false;
  const diff = e.clientX - mouseStartX;
  if (Math.abs(diff) > 100) {
    if (diff < 0) goToPage(currentIndex + 1);
    else goToPage(currentIndex - 1);
  }
});
