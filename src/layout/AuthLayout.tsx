/**
 * Layout for auth screens: logo (top-left), centered content, Footer.
 * Uses design system: theme-dark bg #0a1828, theme-light bg #f4f9fb.
 */

import React from 'react'
import Footer from './Footer'
import Header from './Header'
import { useThemeStore } from '@/store/themeStore'
import { cn } from '@/lib/utils'

export function AuthLayout({ children }: { children: React.ReactNode }) {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'

    return (
        <div
            className={cn(
                'min-h-screen flex flex-col',
                isDark ? 'bg-[#0a1828]' : 'bg-[#f4f9fb]'
            )}
        >
            <Header setOpenMenu={undefined} openMenu={undefined} />
            {/* Spacer for fixed header so main content starts below it */}
            <div className="h-[56px] flex-shrink-0 lg:h-[65px]" aria-hidden />
            <main
                className="flex-1 flex items-center justify-center px-4 py-8 min-h-0"
                style={{
                    background:
                        'linear-gradient(257deg, #253758 -26.08%, #040D16 14.04%, #050F1A 85.51%, #253C50 128.21%)',
                }}
            >
                {children}
            </main>
            <Footer />
        </div>
    )
}
