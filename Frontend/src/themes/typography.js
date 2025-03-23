/**
 * Typography styles for VR Architecture App
 * Defines text styles for the entire application
 */

import { Platform } from 'react-native';

// Base font families
export const FONT_FAMILIES = {
  primary: Platform.select({
    ios: 'SF Pro Display',
    android: 'Roboto',
    web: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
  }),
  secondary: Platform.select({
    ios: 'SF Pro Text',
    android: 'Roboto',
    web: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
  }),
  monospace: Platform.select({
    ios: 'SF Mono',
    android: 'Roboto Mono',
    web: "'SF Mono', 'Roboto Mono', 'Courier New', monospace"
  })
};

// Font weights
export const FONT_WEIGHTS = {
  thin: '100',
  extraLight: '200',
  light: '300',
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  extraBold: '800',
  black: '900'
};

// Font sizes (in pixels)
export const FONT_SIZES = {
  xxs: 10,
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
  '6xl': 60
};

// Line heights (multiplier based on font size)
export const LINE_HEIGHTS = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.7,
  loose: 2
};

// Letter spacing
export const LETTER_SPACING = {
  tight: '-0.05em',
  normal: '0',
  wide: '0.05em',
  wider: '0.1em'
};

// Text transforms
export const TEXT_TRANSFORM = {
  none: 'none',
  capitalize: 'capitalize',
  uppercase: 'uppercase',
  lowercase: 'lowercase'
};

// Text decorations
export const TEXT_DECORATION = {
  none: 'none',
  underline: 'underline',
  lineThrough: 'line-through'
};

// VR specific typography (for 3D text elements)
export const VR_TYPOGRAPHY = {
  label: {
    fontSize: 1,
    depth: 0.1,
    fontFamily: 'helvetiker',
    color: '#FFFFFF',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    padding: 0.2,
    borderRadius: 0.1
  },
  title: {
    fontSize: 2,
    depth: 0.2,
    fontFamily: 'helvetiker',
    color: '#FFFFFF',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 0.3,
    borderRadius: 0.15
  },
  measurement: {
    fontSize: 0.8,
    depth: 0.05,
    fontFamily: 'helvetiker',
    color: '#FFFFFF',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 0.15,
    borderRadius: 0.05
  }
};

// Pre-defined text styles for different UI elements
const createTextStyle = (size, weight, lineHeight, family = 'primary', letterSpacing = 'normal') => ({
  fontFamily: FONT_FAMILIES[family],
  fontSize: FONT_SIZES[size],
  fontWeight: FONT_WEIGHTS[weight],
  lineHeight: FONT_SIZES[size] * LINE_HEIGHTS[lineHeight],
  letterSpacing: LETTER_SPACING[letterSpacing]
});

// Heading styles
export const HEADINGS = {
  h1: createTextStyle('5xl', 'bold', 'tight'),
  h2: createTextStyle('4xl', 'bold', 'tight'),
  h3: createTextStyle('3xl', 'semiBold', 'tight'),
  h4: createTextStyle('2xl', 'semiBold', 'tight'),
  h5: createTextStyle('xl', 'semiBold', 'tight'),
  h6: createTextStyle('lg', 'semiBold', 'tight')
};

// Body text styles
export const BODY = {
  large: createTextStyle('lg', 'regular', 'normal'),
  normal: createTextStyle('md', 'regular', 'normal'),
  small: createTextStyle('sm', 'regular', 'normal'),
  caption: createTextStyle('xs', 'regular', 'normal', 'secondary')
};

// Button text styles
export const BUTTONS = {
  large: createTextStyle('lg', 'medium', 'tight'),
  medium: createTextStyle('md', 'medium', 'tight'),
  small: createTextStyle('sm', 'medium', 'tight')
};

// Label text styles
export const LABELS = {
  large: createTextStyle('md', 'semiBold', 'tight', 'secondary'),
  medium: createTextStyle('sm', 'semiBold', 'tight', 'secondary'),
  small: createTextStyle('xs', 'semiBold', 'tight', 'secondary')
};

// Navigation text styles
export const NAVIGATION = {
  primary: createTextStyle('md', 'medium', 'tight'),
  secondary: createTextStyle('sm', 'medium', 'tight')
};

// Input text styles
export const INPUTS = {
  label: createTextStyle('sm', 'medium', 'tight', 'secondary'),
  value: createTextStyle('md', 'regular', 'normal'),
  placeholder: createTextStyle('md', 'regular', 'normal'),
  helper: createTextStyle('xs', 'regular', 'normal', 'secondary')
};

// Specialized styles for different UI sections
export const SPECIALIZED = {
  vr: {
    controlPanel: createTextStyle('sm', 'medium', 'tight'),
    tooltip: createTextStyle('xs', 'medium', 'tight', 'secondary'),
    measurement: createTextStyle('xs', 'regular', 'tight', 'monospace')
  },
  dashboard: {
    cardTitle: createTextStyle('lg', 'semiBold', 'tight'),
    statValue: createTextStyle('3xl', 'bold', 'tight'),
    statLabel: createTextStyle('xs', 'medium', 'tight', 'secondary')
  },
  editor: {
    code: createTextStyle('sm', 'regular', 'normal', 'monospace')
  }
};

// Media query breakpoints for responsive typography (web)
export const BREAKPOINTS = {
  phone: 480,
  tablet: 768,
  laptop: 1024,
  desktop: 1200
};

// Responsive typography adjustments
export const RESPONSIVE_ADJUSTMENTS = {
  phone: {
    h1: { fontSize: FONT_SIZES['4xl'] },
    h2: { fontSize: FONT_SIZES['3xl'] },
    h3: { fontSize: FONT_SIZES['2xl'] }
  },
  tablet: {
    h1: { fontSize: FONT_SIZES['4xl'] },
    h2: { fontSize: FONT_SIZES['3xl'] },
    h3: { fontSize: FONT_SIZES['2xl'] }
  }
};

// Truncation options
export const TRUNCATE = {
  single: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  multi: (lines) => ({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: lines,
    WebkitBoxOrient: 'vertical'
  })
};

export default {
  FONT_FAMILIES,
  FONT_WEIGHTS,
  FONT_SIZES,
  LINE_HEIGHTS,
  LETTER_SPACING,
  TEXT_TRANSFORM,
  TEXT_DECORATION,
  VR_TYPOGRAPHY,
  HEADINGS,
  BODY,
  BUTTONS,
  LABELS,
  NAVIGATION,
  INPUTS,
  SPECIALIZED,
  BREAKPOINTS,
  RESPONSIVE_ADJUSTMENTS,
  TRUNCATE
};