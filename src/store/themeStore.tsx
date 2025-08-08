// src/store/useThemeStore.ts
import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: (localStorage.getItem('theme') as Theme) || 'light',
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      // Remove both classes first
      document.documentElement.classList.remove('theme-dark', 'theme-light');
      // Add the appropriate class
      document.documentElement.classList.add(newTheme === 'dark' ? 'theme-dark' : 'theme-light');
      localStorage.setItem('theme', newTheme);
      return { theme: newTheme };
    }),
  setTheme: (theme) => {
    // Remove both classes first
    document.documentElement.classList.remove('theme-dark', 'theme-light');
    // Add the appropriate class
    document.documentElement.classList.add(theme === 'dark' ? 'theme-dark' : 'theme-light');
    localStorage.setItem('theme', theme);
    set({ theme });
  },
}));
