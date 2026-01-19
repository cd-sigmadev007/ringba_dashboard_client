import React from 'react'
import Button from '@/components/ui/Button'
import { useThemeStore } from '@/store/themeStore'
import { OnboardingDots } from './OnboardingDots'

export interface OnboardingStep1WelcomeProps {
    onLetsGo: () => void
    dots: { total: number; current: number }
}

/**
 * Welcome Aboard! Figma 2439-33956
 * Let's set up your profile and get started! | Let's Go!
 */
export const OnboardingStep1Welcome: React.FC<OnboardingStep1WelcomeProps> = ({
    onLetsGo,
    dots,
}) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const textClr = isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
    const textMuted = 'text-[#A1A5B7]'

    return (
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center p-6">
            <div className="flex flex-col flex-1 w-full md:max-w-[300px]">
                <h2 className={`text-2xl font-semibold ${textClr}`}>Welcome Aboard!</h2>
                <p className={`text-sm ${textMuted} mt-2 mb-6`}>
                    Let&apos;s set up your profile and get started!
                </p>
                <Button onClick={onLetsGo} className="w-full">
                    Let&apos;s Go!
                </Button>
                <OnboardingDots total={dots.total} current={dots.current} className="mt-8" />
            </div>
            <div className="flex-1 flex items-center justify-center relative w-full max-w-[240px] md:max-w-[280px]">
                {/* Phone + chat illustration (simplified from Figma) */}
                <div className="relative">
                    <div
                        className="w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: '#002B57' }}
                    >
                        <svg
                            className="w-10 h-10 md:w-12 md:h-12 text-white"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                    </div>
                    {/* Chat bubbles */}
                    <div
                        className="absolute -top-1 -right-2 w-6 h-6 rounded-lg flex items-center justify-center text-[10px]"
                        style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: '#0A1828' }}
                    >
                        ...
                    </div>
                    <div
                        className="absolute -bottom-1 -left-2 w-5 h-5 rounded-lg"
                        style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}
                    />
                </div>
            </div>
        </div>
    )
}
