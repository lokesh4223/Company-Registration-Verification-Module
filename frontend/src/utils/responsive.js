// responsive.js
// Utility functions for responsive design

export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920
};

export const mediaQueries = {
  xs: `@media (max-width: ${breakpoints.sm - 1}px)`,
  sm: `@media (min-width: ${breakpoints.sm}px) and (max-width: ${breakpoints.md - 1}px)`,
  md: `@media (min-width: ${breakpoints.md}px) and (max-width: ${breakpoints.lg - 1}px)`,
  lg: `@media (min-width: ${breakpoints.lg}px) and (max-width: ${breakpoints.xl - 1}px)`,
  xl: `@media (min-width: ${breakpoints.xl}px)`,
  up: (breakpoint) => `@media (min-width: ${breakpoints[breakpoint]}px)`,
  down: (breakpoint) => `@media (max-width: ${breakpoints[breakpoint] - 1}px)`,
  between: (min, max) => `@media (min-width: ${breakpoints[min]}px) and (max-width: ${breakpoints[max] - 1}px)`
};

export const isMobile = () => window.innerWidth < breakpoints.md;
export const isTablet = () => window.innerWidth >= breakpoints.md && window.innerWidth < breakpoints.lg;
export const isDesktop = () => window.innerWidth >= breakpoints.lg;

export const getDeviceType = () => {
  const width = window.innerWidth;
  if (width < breakpoints.sm) return 'mobile';
  if (width < breakpoints.md) return 'tabletPortrait';
  if (width < breakpoints.lg) return 'tabletLandscape';
  if (width < breakpoints.xl) return 'desktop';
  return 'largeDesktop';
};

export const responsiveSpacing = {
  xs: {
    padding: '0.5rem',
    margin: '0.5rem',
    gap: '0.5rem'
  },
  sm: {
    padding: '1rem',
    margin: '1rem',
    gap: '1rem'
  },
  md: {
    padding: '1.5rem',
    margin: '1.5rem',
    gap: '1.5rem'
  },
  lg: {
    padding: '2rem',
    margin: '2rem',
    gap: '2rem'
  }
};

export const responsiveTypography = {
  h1: {
    xs: '1.75rem',
    sm: '2rem',
    md: '2.5rem',
    lg: '3rem'
  },
  h2: {
    xs: '1.5rem',
    sm: '1.75rem',
    md: '2rem',
    lg: '2.5rem'
  },
  h3: {
    xs: '1.25rem',
    sm: '1.5rem',
    md: '1.75rem',
    lg: '2rem'
  },
  h4: {
    xs: '1.125rem',
    sm: '1.25rem',
    md: '1.5rem',
    lg: '1.75rem'
  },
  body1: {
    xs: '0.875rem',
    sm: '1rem',
    md: '1.125rem',
    lg: '1.25rem'
  },
  body2: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem'
  }
};

export default {
  breakpoints,
  mediaQueries,
  isMobile,
  isTablet,
  isDesktop,
  getDeviceType,
  responsiveSpacing,
  responsiveTypography
};