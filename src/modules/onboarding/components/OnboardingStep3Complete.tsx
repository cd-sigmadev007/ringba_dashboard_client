import React from 'react'
import Button from '@/components/ui/Button'
import { useThemeStore } from '@/store/themeStore'
import { SuccessCheckIcon } from '@/assets/svg'
import { OnboardingDots } from './OnboardingDots'

export interface OnboardingStep3CompleteProps {
    onLetsGo: () => void
    dots: { total: number; current: number }
}

/**
 * Everything Looks Great! Figma 2439-35329
 * Your profile setup is finished successfully. | Let's Go!
 */
export const OnboardingStep3Complete: React.FC<OnboardingStep3CompleteProps> = ({
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
                <h2 className={`text-2xl font-semibold ${textClr}`}>Everything Looks Great!</h2>
                <p className={`text-sm ${textMuted} mt-2 mb-6`}>
                    Your profile setup is finished successfully.
                </p>
                <Button onClick={onLetsGo} className="w-full">
                    Let&apos;s Go!
                </Button>
                <OnboardingDots total={dots.total} current={dots.current} className="mt-8" />
            </div>
            <div className="flex-1 flex items-center justify-center">
                <div
                    className="w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#007FFF' }}
                >
                    <SuccessCheckIcon className="w-10 h-10 md:w-12 md:h-12 text-white" />
                </div>
            </div>
        </div>
    )
}
