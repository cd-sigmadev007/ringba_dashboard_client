/**
 * Theme store using Zustand with TypeScript support and persistence
 */

import React from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { STORAGE_KEYS, DEFAULT_THEME } from '@/lib/constants';
import type { Theme } from '@/lib/types';

interface ThemeState {
  /**
   * Current theme
   */
  theme: Theme;
  /**
   * Toggle between light and dark theme
   */
  toggleTheme: () => void;
  /**
   * Set specific theme
   */
  setTheme: (theme: Theme) => void;
  /**
   * Check if current theme is dark
   */
  isDark: boolean;
}

/**
 * Theme store with persistence
 * Automatically saves theme preference to localStorage
 */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: DEFAULT_THEME,
      isDark: DEFAULT_THEME === 'dark',
      
      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme: Theme = currentTheme === 'light' ? 'dark' : 'light';
        
        set({
          theme: newTheme,
          isDark: newTheme === 'dark',
        });
        
        // Update document class for CSS theming
        updateDocumentTheme(newTheme);
      },
      
      setTheme: (theme: Theme) => {
        set({
          theme,
          isDark: theme === 'dark',
        });
        
        // Update document class for CSS theming
        updateDocumentTheme(theme);
      },
    }),
    {
      name: STORAGE_KEYS.THEME,
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // Update document theme on rehydration
        if (state?.theme) {
          updateDocumentTheme(state.theme);
        }
      },
    }
  )
);

/**
 * Update document class for CSS theming
 */
function updateDocumentTheme(theme: Theme): void {
  const root = document.documentElement;
  const isDark = theme === 'dark';
  
  // Remove existing theme classes
  root.classList.remove('theme-light', 'theme-dark');
  
  // Add new theme class
  root.classList.add(`theme-${theme}`);
  
  // Update data attribute for CSS selectors
  root.setAttribute('data-theme', theme);
  
  // Update meta theme-color for mobile browsers
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute(
      'content',
      isDark ? '#0a1828' : '#f4f9fb'
    );
  }
}

/**
 * Hook to initialize theme on app start
 * Call this in your root component
 */
export const useInitializeTheme = () => {
  const theme = useThemeStore((state) => state.theme);
  
  React.useEffect(() => {
    updateDocumentTheme(theme);
  }, [theme]);
};

// Initialize theme immediately if we're in the browser
if (typeof window !== 'undefined') {
  const storedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
  if (storedTheme) {
    try {
      const parsed = JSON.parse(storedTheme);
      if (parsed.state?.theme) {
        updateDocumentTheme(parsed.state.theme);
      }
    } catch {
      // Fallback to default theme
      updateDocumentTheme(DEFAULT_THEME);
    }
  } else {
    updateDocumentTheme(DEFAULT_THEME);
  }
}
