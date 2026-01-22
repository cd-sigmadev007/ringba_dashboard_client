/**
 * Layout for auth screens: logo (top-left), centered content, Footer.
 * Uses design system: theme-dark bg #0a1828, theme-light bg #f4f9fb.
 */

import React from 'react'
import Footer from './Footer'
import Header from './Header'
import { useThemeStore } from '@/store/themeStore'
import { cn } from '@/lib/utils'
import {
    AuthBgBitcoin,
    AuthBgChat,
    AuthBgExclamation,
    AuthBgHands1,
    AuthBgHands2,
    AuthBgRefresh,
    AuthBgSearch,
    AuthBgSettings,
} from '@/assets/svg'

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
                className="flex-1 flex items-center justify-center px-4 py-8 min-h-0 relative overflow-hidden"
                style={{
                    background: isDark
                        ? 'linear-gradient(180deg, #0A1828 65.56%, #1F3250 136.64%)'
                        : '#f4f9fb',
                }}
            >
                {/* Decorative icons positioned relative to main bg container as per Figma */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* Exclamation Mark - bottom left area of container */}
                    <div className="absolute bottom-[2%] left-[5%]">
                        <AuthBgExclamation className="w-12 h-12 md:w-14 md:h-14" />
                    </div>
                    {/* Bitcoin Icon - bottom left corner of container */}
                    {/* <div className="absolute bottom-[5%] left-[0%] md:bottom-[6%] md:left-[4%]">
                        <AuthBgBitcoin className="w-8 h-12 md:w-10 md:h-14" />
                    </div> */}
                    {/* Search Icon - bottom center-left area */}
                    <div className="absolute bottom-[5%] left-[23%]">
                        <AuthBgSearch className="w-12 h-12 md:w-14 md:h-14" />
                    </div>
                    {/* Dollar Sign - bottom center area */}
                    <div className="absolute bottom-[10%] left-[0%]">
                        <AuthBgBitcoin className="w-10 h-14 md:w-12 md:h-16" />
                    </div>
                    {/* Refresh Icon - bottom center-right area */}
                    <div className="absolute bottom-[5%] right-[25%]">
                        <AuthBgRefresh className="w-10 h-10 md:w-12 md:h-12" />
                    </div>
                    {/* Chat Bubble 1 - bottom right corner */}
                    <div className="absolute bottom-[6%] right-[0%]">
                        <AuthBgChat className="w-10 h-16 md:w-12 md:h-20" />
                    </div>
                </div>

                {/* Two hand illustrations at the bottom - positioned as per Figma */}
                <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
                    <div className="relative w-full">
                        {/* Left hand - thumbs-up with blue sleeve */}
                        <div className="absolute bottom-0 left-[5%] md:left-[8%]">
                            <AuthBgHands1 className="w-40 h-28 md:w-48 md:h-32" />
                        </div>
                        {/* Right hand - OK gesture with purple/maroon sleeve */}
                        <div className="absolute bottom-0 right-[5%] md:right-[8%]">
                            <AuthBgHands2 className="w-44 h-28 md:w-52 md:h-32" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="relative z-10">{children}</div>
            </main>
            <Footer />
        </div>
    )
}
