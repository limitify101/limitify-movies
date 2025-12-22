/**
 * Theme Configuration for Limitify Movies
 * Centralized fonts, colors, and styling constants
 */

export const FONTS = {
  heading: "font-['Bebas_Neue']",
  body: "font-['Barlow']",
  condensed: "font-['Barlow_Condensed']",
  serif: "font-['Arvo']"
};

export const COLORS = {
  primary: '#f3b83ae8',
  primaryHover: '#e5a829',
  background: {
    dark: '#000000',
    darker: '#0a0808',
    card: '#1f2123',
    overlay: '#0000005b'
  },
  text: {
    primary: '#ffffff',
    secondary: '#eccbafdd',
    muted: '#6b7280',
    accent: '#ecd364'
  },
  border: '#f3b83ae8'
};

export const GRADIENTS = {
  header: 'linear-gradient(180deg, rgba(10, 8, 8), #212426)',
  cardOverlay: 'linear-gradient(10deg, transparent, rgba(0, 0, 0, .897))',
  bannerOverlay: 'linear-gradient(1turn, transparent, rgba(0, 0, 0, .897))',
  goldText: 'linear-gradient(180deg, #ffc694, rgba(248, 199, 119, .527))'
};

export const TYPOGRAPHY = {
  h1: `${FONTS.heading} text-5xl md:text-6xl lg:text-7xl font-bold`,
  h2: `${FONTS.heading} text-3xl md:text-4xl lg:text-5xl font-bold`,
  h3: `${FONTS.heading} text-2xl md:text-3xl font-bold`,
  h4: `${FONTS.condensed} text-xl md:text-2xl font-semibold`,
  body: `${FONTS.body} text-base`,
  bodyLarge: `${FONTS.body} text-lg`,
  bodySmall: `${FONTS.body} text-sm`,
  caption: `${FONTS.condensed} text-sm`
};
