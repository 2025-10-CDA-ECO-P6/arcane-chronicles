import localFont from 'next/font/local';

export const cinzel = localFont({
  src: '../assets/fonts/Cinzel-Variable.ttf',
  variable: '--font-cinzel',
  display: 'swap',
});

export const inter = localFont({
  src: '../assets/fonts/Inter-Variable.ttf',
  variable: '--font-inter',
  display: 'swap',
});

export const crimsonText = localFont({
  src: '../assets/fonts/CrimsonText-Regular.ttf',
  variable: '--font-crimson-text',
  weight: '400',
  style: 'normal',
  display: 'swap',
});

export const icons = localFont({
  src: '../assets/fonts/icons/Arcane-chronicle.woff',
  variable: '--font-icons',
  display: 'block',
  adjustFontFallback: false,
});
