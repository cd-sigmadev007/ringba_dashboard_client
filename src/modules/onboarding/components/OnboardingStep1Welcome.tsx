import React from 'react'
import { OnboardingDots } from './OnboardingDots'
import Button from '@/components/ui/Button'
import { useThemeStore } from '@/store/themeStore'

import onboarding1Svg from '@/assets/svg/onboarding-1.svg'

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
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 justify-between items-center p-6">
            <div className="flex flex-col flex-1 w-full md:max-w-[300px]">
                <h2 className={`text-2xl font-semibold ${textClr}`}>
                    Welcome Aboard!
                </h2>
                <p className={`text-sm ${textMuted} mt-2 mb-6`}>
                    Let&apos;s set up your profile and get started!
                </p>
                <Button onClick={onLetsGo} className="w-full">
                    Let&apos;s Go!
                </Button>
                <OnboardingDots
                    total={dots.total}
                    current={dots.current}
                    className="mt-8"
                />
            </div>
            <div className="flex-1 flex items-center justify-center w-full max-w-[240px] md:max-w-[280px]">
                <img
                    src={onboarding1Svg}
                    alt=""
                    className="w-full h-auto object-contain"
                />
            </div>
        </div>
    )
}
