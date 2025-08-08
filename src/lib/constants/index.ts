/**
 * Application constants
 */

import type { Theme } from '../types';

// Theme constants
export const THEME_KEY = 'ringba-theme';
export const DEFAULT_THEME: Theme = 'light';

// API constants
export const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3000/api';
export const API_TIMEOUT = 10000; // 10 seconds

// Local storage keys
export const STORAGE_KEYS = {
  THEME: THEME_KEY,
  USER_PREFERENCES: 'ringba-user-preferences',
  SEARCH_HISTORY: 'ringba-search-history',
  SIDEBAR_STATE: 'ringba-sidebar-state',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  CALLER_ANALYSIS: '/caller-analysis',
  DEMO_TABLE: '/demo/table',
  DEMO_TANSTACK: '/demo/tanstack-query',
} as const;

// Breakpoints (matching Tailwind CSS)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// Animation durations
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Search constants
export const SEARCH_CONFIG = {
  DEBOUNCE_DELAY: 300,
  MIN_SEARCH_LENGTH: 2,
  MAX_RESULTS: 10,
} as const;

// Form validation
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_INPUT_LENGTH: 255,
  ADDRESS_LENGTH: 42, // Ethereum address length
} as const;

// Z-index layers
export const Z_INDEX = {
  DROPDOWN: 10,
  SIDEBAR: 50,
  MODAL_BACKDROP: 100,
  MODAL: 200,
  TOOLTIP: 300,
  TOAST: 400,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'The requested resource was not found.',
  INTERNAL_ERROR: 'An internal server error occurred.',
  VALIDATION_ERROR: 'Please check your input and try again.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  SAVED: 'Changes saved successfully.',
  DELETED: 'Item deleted successfully.',
  UPDATED: 'Item updated successfully.',
  CREATED: 'Item created successfully.',
} as const;
