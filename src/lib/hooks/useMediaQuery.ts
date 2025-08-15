/**
 * useMediaQuery hook
 * Custom hook to detect media query matches
 */

import { useEffect, useState } from 'react'

/**
 * Hook to track media query matches
 * @param query - The media query string to match
 * @returns boolean indicating if the media query matches
 */
export const useMediaQuery = (query: string): boolean => {
    const [matches, setMatches] = useState<boolean>(false)

    useEffect(() => {
        // Check if window is available (SSR safety)
        if (typeof window === 'undefined') {
            return
        }

        const mediaQuery = window.matchMedia(query)

        // Set initial value
        setMatches(mediaQuery.matches)

        // Create event listener function
        const handleChange = (event: MediaQueryListEvent) => {
            setMatches(event.matches)
        }

        // Add listener
        mediaQuery.addEventListener('change', handleChange)

        // Cleanup
        return () => {
            mediaQuery.removeEventListener('change', handleChange)
        }
    }, [query])

    return matches
}

/**
 * Common breakpoint hooks
 */
export const useIsMobile = () => useMediaQuery('(max-width: 767px)')
export const useIsTablet = () =>
    useMediaQuery('(min-width: 768px) and (max-width: 1023px)')
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)')
export const useIsMobileOrTablet = () => useMediaQuery('(max-width: 1023px)')
