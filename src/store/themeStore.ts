// src/store/useThemeStore.ts
import { create } from 'zustand'

type Theme = 'light' | 'dark'

interface ThemeState {
    theme: Theme
    toggleTheme: () => void
    setTheme: (theme: Theme) => void
}

export const useThemeStore = create<ThemeState>((set) => {
    // Initialize theme from localStorage or default to 'dark'
    const initialTheme =
        (localStorage.getItem('theme') as Theme | null) || 'dark'

    // Apply theme class on initialization
    if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('theme-dark', 'theme-light')
        document.documentElement.classList.add(
            initialTheme === 'dark' ? 'theme-dark' : 'theme-light'
        )
    }

    return {
        theme: initialTheme,
        toggleTheme: () =>
            set((state) => {
                const newTheme = state.theme === 'light' ? 'dark' : 'light'
                // Remove both classes first
                document.documentElement.classList.remove(
                    'theme-dark',
                    'theme-light'
                )
                // Add the appropriate class
                document.documentElement.classList.add(
                    newTheme === 'dark' ? 'theme-dark' : 'theme-light'
                )
                localStorage.setItem('theme', newTheme)
                return { theme: newTheme }
            }),
        setTheme: (theme) => {
            // Remove both classes first
            document.documentElement.classList.remove(
                'theme-dark',
                'theme-light'
            )
            // Add the appropriate class
            document.documentElement.classList.add(
                theme === 'dark' ? 'theme-dark' : 'theme-light'
            )
            localStorage.setItem('theme', theme)
            set({ theme })
        },
    }
})
