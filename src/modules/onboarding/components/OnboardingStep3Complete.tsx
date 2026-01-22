import React from 'react'
import { OnboardingDots } from './OnboardingDots'
import Button from '@/components/ui/Button'
import { useThemeStore } from '@/store/themeStore'

import donePng from '@/assets/png/done.png'

export interface OnboardingStep3CompleteProps {
    onLetsGo: () => void
    dots: { total: number; current: number }
}

/**
 * Everything Looks Great! Figma 2439-35329
 * Your profile setup is finished successfully. | Let's Go!
 */
export const OnboardingStep3Complete: React.FC<
    OnboardingStep3CompleteProps
> = ({ onLetsGo, dots }) => {
    const { theme } = useThemeStore()
    const isDark = theme === 'dark'
    const textClr = isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]'
    const textMuted = 'text-[#A1A5B7]'

    return (
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 justify-between items-center p-6">
            <div className="flex flex-col flex-1 w-full md:max-w-[300px]">
                <h2 className={`text-2xl font-semibold ${textClr}`}>
                    Everything Looks Great!
                </h2>
                <p className={`text-sm ${textMuted} mt-2 mb-6`}>
                    Your profile setup is finished successfully.
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
            <div className="flex-1 flex items-center justify-center">
                <img
                    src={donePng}
                    alt=""
                    className="object-contain flex-shrink-0"
                />
            </div>
        </div>
    )
}
