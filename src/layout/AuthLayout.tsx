/**
 * Layout for auth screens: logo (top-left), centered content, Footer.
 * Uses design system: theme-dark bg #0a1828, theme-light bg #f4f9fb.
 */

import React from 'react'
import { Link } from '@tanstack/react-router'
import Footer from './Footer'
import { useThemeStore } from '@/store/themeStore'
import Logo from '@/components/logo'
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
            <header className="px-4 lg:px-10 py-4">
                <Link to="/login">
                    <Logo />
                </Link>
            </header>
            <main className="flex-1 flex items-center justify-center px-4 py-8">
                {children}
            </main>
            <Footer />
        </div>
    )
}
